import './Results.css';

import React from 'react';

import BlochSphere from './BlochSphere';
import LineGraph from './LineGraph';

export default function Results() {
  return (
    <div>
      <h2>Results</h2>
      <div className="result-container">
        <BlochSphere />
        <LineGraph />
      </div>
      <div className="result-controls">
        <input type="range"/>
      </div>
    </div>
  );
}