import './App.css';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { hot } from 'react-hot-loader/root';

import Details from './Details';
import Laboratory from './Laboratory';
import loadWasm from './loadWasm';
import Results from './Results';

export const states = {
  INIT: 'INIT',
  LOADING: 'LOADING',
  SIMULATING: 'SIMULATING',
  SIMULATED: 'SIMULATED'
}

const demo = () => {
  let str = "from qutip import *; import numpy as np; import json;"
  str += "H = sigmax();" 
  str += "psi0 = basis(2, 0);"
  str += "tlist = np.linspace(0, 10, 100);"
  str += "result = mesolve(H, psi0, tlist, [], [sigmax(), sigmay(), sigmaz()]);"
  str += "print(json.dumps(result.expect[0].tolist()));"
  str += "print(json.dumps(result.expect[1].tolist()));"
  str += "print(json.dumps(result.expect[2].tolist()));"
  return str
}

function App() {
  const pyjsRef = useRef(null)
  const [simulationState, setSimulationState] = useState(states.INIT)
  const [simulationResults, setSimulationResults] = useState([])
  const [resultsBuffer, setResultsBuffer] = useState([])
  
  const handleSimulate = async () => {
    try {
      if (pyjsRef.current === null) {
        setSimulationState(states.LOADING)
        pyjsRef.current = await loadWasm(loadResults)
      }
      setSimulationState(states.SIMULATING)
      await pyjsRef.current.exec(demo())
    } catch (e) {
      console.error(e)
    } finally {
      setSimulationState(states.SIMULATED)
    }
  }

  const loadResults = (results) => {
    console.log(results, typeof results)
    setResultsBuffer(state => [...state, JSON.parse(results)])
  }

  useEffect(() => {
    if (simulationState === states.SIMULATED) {
      setSimulationResults(resultsBuffer)
    }
  }, [simulationState])

  return (
    <>
      <div className="main">
        <div className="panel--lab">
          <Laboratory />
          <Details onSimulate={handleSimulate} simulationState={simulationState}/>
        </div>
        <div className="panel--lab">
        <Results simulationResults={simulationResults} simulationState={simulationState}/>
        </div>
      </div>
      {/* <Footer isLoading={isLoading} qutipVersion={qutipVersion}/> */}
    </>
  );
}

export default hot(App);
