import React, {
  createContext,
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

export const SimulationContext = createContext({
  state: states.INIT,
  config: {},
  results: [],
  setConfig: () => {},
  submit: () => {},
  setResults: () => {},
  reset: () => {}
});

const larmorDemo = () => {
  let str = "from qutip import *; import numpy as np; import json;";
  str += "H = sigmax();";
  str += "psi0 = basis(2, 0);";
  str += "tlist = np.linspace(0, 10, 100);";
  str += "result = mesolve(H, psi0, tlist, [], [sigmax(), sigmay(), sigmaz()]);";
  str += "print(json.dumps(result.expect[0].tolist()));";
  str += "print(json.dumps(result.expect[1].tolist()));";
  str += "print(json.dumps(result.expect[2].tolist()));";
  return str;
};

const dephasingDemo = () => {
  let str = "from qutip import *; import numpy as np; import json;";
  str += 'theta = 0.2 * np.pi;'
  str += 'delta = np.pi;'
  str += 'psi0 = basis(2, 0);'
  str += 'H = delta * (np.cos(theta) * sigmaz() + np.sin(theta) * sigmax());'
  str += 'gamma_phase = 0.5;'
  str += 'c_ops = [np.sqrt(gamma_phase) * sigmaz()];'
  str += 'tlist = np.linspace(0, 5, 1000);'
  str += "result = mesolve(H, psi0, tlist, c_ops, [sigmax(), sigmay(), sigmaz()]);";
  str += "print(json.dumps(result.expect[0].tolist()));";
  str += "print(json.dumps(result.expect[1].tolist()));";
  str += "print(json.dumps(result.expect[2].tolist()));";
  return str;
}

const demos = {
  LARMOR: larmorDemo,
  DEPHASING: dephasingDemo,
}

export default function Simulation({ children }) {
  const [config, setConfig] = useState({name: 'LARMOR'});
  const [results, setResults] = useState([]);
  const [state, setSimState] = useState(states.INIT)

  const pyjsRef = useRef(null);
  const [resultsBuffer, setResultsBuffer] = useState([]);
  const submit = async () => {
    try {
      if (pyjsRef.current === null) {
        setSimState(states.LOADING);
        pyjsRef.current = await loadWasm(loadResults);
      }
      setSimState(states.SIMULATING);
      console.log(config.name)
      await pyjsRef.current.exec(demos[config.name]());
    } catch (e) {
      console.error(e);
    } finally {
      setSimState(states.SIMULATED);
    }
  };

  const loadResults = (results) => {
    setResultsBuffer((state) => [...state, JSON.parse(results)]);
  };

  useEffect(() => {
    if (state === states.SIMULATED) {
      console.log(resultsBuffer)
      setResults(resultsBuffer);
    }
  }, [state]);

  const reset = () => {
    setSimState(() => states.INIT)
    setResultsBuffer([])
    setResults([])
  }

  const value = {
    state,
    config,
    results,
    submit,
    setConfig,
    reset,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
