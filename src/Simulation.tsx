import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import loadWasm from './loadWasm';
import {
  emptyConfig,
  getDetails,
  getSrc,
  SimulationConfig,
  SimulationConfigDetails,
} from './simulationUtils';

export enum States {
  INIT = "INIT",
  LOADING = "LOADING",
  SIMULATING = "SIMULATING",
  SIMULATED = "SIMULATED",
};

type SimulationContext = {
  state: States,
  config: SimulationConfig,
  results: string[],
  details:  SimulationConfigDetails,
  src:  string,
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>,
  submit: () => void,
  setResults: (value: React.SetStateAction<string[]>) => void,
  reset: () => void,
}

export const SimulationContext = createContext<SimulationContext>({
  state: States.INIT,
  config: emptyConfig,
  results: [],
  details: {
    Hamiltonian: {
      singleQubitTerms: "",
      interactionTerms: "",
    },
    parameters: {
      lasers: [],
      interactions: [],
      baths: []
    },
    collapseOperators: [],
    initialState: ""
  },
  src: "",
  setConfig: () => {},
  submit: () => {},
  setResults: () => {},
  reset: () => {},
});

export default function Simulation({ children }) {
  const [config, setConfig] = useState(emptyConfig);
  const [results, setResults] = useState<string[]>([]);
  const [state, setSimState] = useState(States.INIT);
  const [resultsBuffer, setResultsBuffer] = useState<string[]>([]);

  const pyjsRef = useRef<{exec: Function} | null>(null);

  const details = useMemo(() => getDetails(config), [config])
  const src = useMemo(() => getSrc(config), [config])

  const submit = useCallback(async () => {
    try {
      if (pyjsRef.current === null) {
        setSimState(States.LOADING);
        pyjsRef.current = await loadWasm(loadResults);
      }
      if (pyjsRef.current !== null){
        await pyjsRef?.current.exec(getSrc(config));
        setSimState(States.SIMULATING);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimState(States.SIMULATED);
    }
  }, [config]);

  const loadResults = (results) => {
    setResultsBuffer((state) => [...state, JSON.parse(results)]);
  };

  useEffect(() => {
    if (state === States.SIMULATED) {
      setResults(resultsBuffer);
    }
  }, [state]);

  const reset = () => {
    setSimState(() => States.INIT);
    setResultsBuffer([]);
    setResults([]);
  };

  const value = {
    state,
    config,
    results,
    details,
    src,
    setConfig,
    submit,
    setResults,
    reset,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
