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
        {!results.length ? (
          <div className='results-placeholder'>
            Press 'Simulate' to view the results here!
            </div>
        ): (
          <>
          <BlochSphere time={time} data={results}/>
        <LineGraph data={results} onHover={setTime} time={time} onBlur={() => setTime(null)}/>
        </>)}
      </div>
    </div>
  );
}