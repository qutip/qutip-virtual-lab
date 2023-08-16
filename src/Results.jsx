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

  if (!results.length) {
    return (
      <div id="results">
        <div className="results-placeholder">
          Press 'Simulate' to view the results here!
        </div>
      </div>
    );
  }

  return (
    <div id="results">
      {results.map((data, i) => (
        <div style={{ border: "1px solid black", width: 400 }} key={i}>
          <h2 style={{ alignSelf: "start", background: "black", padding: 5 }}>
            Qubit {i + 1}
          </h2>
          <BlochSphere time={time} data={data} key={"b" + i} />
          <LineGraph
            key={"lg" + i}
            data={data}
            onHover={setTime}
            time={time}
            onBlur={() => setTime(null)}
          />
        </div>
      ))}
      <div style={{width: '100%'}}>
        <h2>Time:</h2>
        <input
          type="range"
          min={0}
          max={results.data?.[0].length}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{width: '100%'}}
        />
      </div>
    </div>
  );
}
