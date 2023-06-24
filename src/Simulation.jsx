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
  results: {},
  setConfig: () => {},
  submit: () => {},
  setResults: () => {},
});

const demo = () => {
  let str = "from qutip import *; import numpy as np; import json;";
  str += "H = sigmax();";
  str += "psi0 = basis(2, 0);";
  str += "tlist = np.linspace(0, 10, 100);";
  str +=
    "result = mesolve(H, psi0, tlist, [], [sigmax(), sigmay(), sigmaz()]);";
  str += "print(json.dumps(result.expect[0].tolist()));";
  str += "print(json.dumps(result.expect[1].tolist()));";
  str += "print(json.dumps(result.expect[2].tolist()));";
  return str;
};

export default function Simulation({ children }) {
  const [config, setConfig] = useState({});
  const [results, setResults] = useState({});
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
      await pyjsRef.current.exec(demo());
    } catch (e) {
      console.error(e);
    } finally {
      setSimState(states.SIMULATED);
    }
  };

  const loadResults = (results) => {
    console.log(results, typeof results);
    setResultsBuffer((state) => [...state, JSON.parse(results)]);
  };

  useEffect(() => {
    if (state === states.SIMULATED) {
      setResults(resultsBuffer);
    }
  }, [state]);

  const value = {
    state,
    config,
    results,
    submit,
    setConfig,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
