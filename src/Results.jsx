import './Results.css';

import React, {
  useContext,
  useState,
} from 'react';

import BlochSphere from './BlochSphere';
import LineGraph from './LineGraph';
import { SimulationContext } from './Simulation';

export default function Results() {
  const { results } = useContext(SimulationContext);

  const [time, setTime] = useState(0);

  return (
    <div id="results">
      <div className="result-container">
        {!results.length ? (
          <div className="results-placeholder">
            Press 'Simulate' to view the results here!
          </div>
        ) : (
          results.map((data, i) => (
            <span key={i}>
            <h2 style={{alignSelf: 'start'}}>Qubit {i}</h2>
              <BlochSphere time={time} data={data} key={"b" + i} />
              <LineGraph
                key={"lg" + i}
                data={data}
                onHover={setTime}
                time={time}
                onBlur={() => setTime(null)}
              />
              <hr style={{backgroundColor: 'white', width: '100%', height: 1}}/>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
