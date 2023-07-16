import { useContext } from 'react';

import { SimulationContext } from './Simulation';

export default function Debug() {
  const { 
    // getDetails, 
    // getSrc, 
    config
  } = useContext(SimulationContext);

  const info = {
    // details: getDetails(), 
    // src: getSrc(), 
    config: config}
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 1,
        backgroundColor: "black",
        color: "white",
        border: "1px solid white",
        padding: "5px",
        width: 300,
        fontSize: 10,
        fontFamily: "monospace",
      }}
    >
      <details>
        <summary>Debug</summary>
        {Object.entries(config).map(([key, value]) => (
          <>
            <h2>{key}:</h2>
            {key === 'src' ? 
            value.split(';').map((v)=> <pre style={{ fontSize: 10, whiteSpace: 'pre-line', margin: 0 }}>{v}</pre>)
            : <pre style={{ fontSize: 10 }}>{JSON.stringify(value, null, 2)}</pre>
            }
          </>
        ))}
      </details>
    </div>
  );
}
