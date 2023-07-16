import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import loadWasm from './loadWasm';

export const states = {
  INIT: "INIT",
  LOADING: "LOADING",
  SIMULATING: "SIMULATING",
  SIMULATED: "SIMULATED",
};

const emptyConfig = {
  details: {
    Hamiltonian: "",
    parameters: [{}],
    collapseOperators: [],
    initialState: "",
  },
  src: ""
}

export const SimulationContext = createContext({
  state: states.INIT,
  config: emptyConfig,
  results: [],
  setConfig: () => {},
  submit: () => {},
  setResults: () => {},
  reset: () => {},
  getDetails: () => {},
  getSrc: () => {}
});

export default function Simulation({ children }) {
  const [config, setConfig] = useState(emptyConfig);
  const [results, setResults] = useState([]);
  const [state, setSimState] = useState(states.INIT);
  const [resultsBuffer, setResultsBuffer] = useState([]);

  const pyjsRef = useRef(null);

  const submit = useCallback(async () => {
    try {
      if (pyjsRef.current === null) {
        setSimState(states.LOADING);
        pyjsRef.current = await loadWasm(loadResults);
      }
      setSimState(states.SIMULATING);
      await pyjsRef.current.exec(config.src);
    } catch (e) {
      console.error(e);
    } finally {
      setSimState(states.SIMULATED);
    }
  }, [config]);

  const loadResults = (results) => {
    setResultsBuffer((state) => [...state, JSON.parse(results)]);
  };

  useEffect(() => {
    if (state === states.SIMULATED) {
      setResults(resultsBuffer);
    }
  }, [state]);

  const reset = () => {
    setSimState(() => states.INIT);
    setResultsBuffer([]);
    setResults([]);
  };

  const getDetails = () => {
    const { lasers, interactions, baths, qubits } = config
    const Hamiltonian = ""
    return {
      Hamiltonian,
      parameters: [{}],
      collapseOperators: [],
      initialState: `|${"0".repeat(qubits)}\\rangle`,
    };
  }
  
  const getSrc = () => {
    const { lasers, interactions, baths, qubits } = config;
    let imports = "from qutip import *; import numpy as np; import json;";
    let tlist = "tlist = np.linspace(0, 10, 100)";
    let psi0 = `psi0 = basis(${qubits}, 0)`;
    let H = [];
    lasers.forEach((laser) => {
      const { qubit, operator, param } = laser;
      const embedded = Array.from({ length: qubits }, (_, i) =>
        i === qubit ? `${param}*${operator}()` : "qeye(2)"
      ).join();
      H.push(`tensor(${embedded})`);
    });
    interactions.forEach((interaction) => {
      const { pair, operators, param } = interaction;
      const embedded = Array.from({ length: qubits }, () => "qeye(2)");
      embedded[pair[0]] = `${operators[0]}()`;
      embedded[pair[1]] = `${operators[1]}()`;
      H.push(`${param}*tensor(${embedded.join()})`);
    });
    const solve =
      "result = mesolve(H, psi0, tlist, [], [sigmax(), sigmay(), sigmaz()]";
    const print = Array.from({ length: 3 })
      .map((_, i) => `print(json.dumps(result.expect[${i}].tolist()))`)
      .join(";");
    return [imports, tlist, psi0, `H = ${H.join("+")}`, solve, print].join(";");
  }


  const value = {
    state,
    config,
    results,
    submit,
    setConfig,
    reset,
    // getSrc,
    // getDetails,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
