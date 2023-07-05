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
