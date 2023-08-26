import './Results.css';

import React, {
  useContext,
  useState,
} from 'react';

import BlochSphere from './BlochSphere';
import LineGraph from './LineGraph';
import { SimulationContext } from './Simulation';

export default function Results() {
  const { results, config } = useContext(SimulationContext);

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
      <div className="results-container">
      {results.map((data, i) => (
        <div className="qubit-result" key={i}>
          <h2 style={{ alignSelf: "start", background: "black", padding: 5 }}>
            Qubit {config.qubits[i]}
          </h2>
          <BlochSphere time={time} data={data} key={"b" + i} />
          <div>
          <LineGraph
            key={"lg" + i}
            data={data}
            onHover={setTime}
            time={time}
            onBlur={() => setTime(null)}
          />
          </div>
        </div>
      ))}
      </div>
      <div className="time-slider">
        <h2>Time:</h2>
        <input
          type="range"
          min={0}
          max={results?.[0]?.[0].length-1}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{width: '100%'}}
        />
      </div>
    </div>
  );
}
