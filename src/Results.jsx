import './Results.css';

import React, {
  useContext,
  useState,
} from 'react';

import BlochSphere from './BlochSphere';
import LineGraph from './LineGraph';
import { SimulationContext } from './Simulation';

export default function Results() {

  const {
    results, 
} = useContext(SimulationContext)


  const [time, setTime] = useState(0)

  return (
    <div>
      <h2>Results</h2>
      <div className="result-container">
        <BlochSphere time={time} data={results}/>
        <LineGraph time={time} data={results}/>
      </div>
      <div className="result-controls">
        <input type="range" value={time} onChange={setTime}/>
      </div>
    </div>
  );
}