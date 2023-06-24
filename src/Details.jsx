import './Details.css';
import 'katex/dist/katex.min.css';

import React, { useContext } from 'react';

import { BlockMath } from 'react-katex';

import {
  SimulationContext,
  states,
} from './Simulation';

export default function Details() {

    const {
        state, 
        submit
    } = useContext(SimulationContext)

  return (
    <div id="details">
      <h2>Details</h2>
      <div>
        <BlockMath>
            {'\\mathcal{H} = \\lambda_1 \\sigma_x^{(1)}'}
        </BlockMath>
      </div>
      <button onClick={submit} disabled={[states.SIMULATING, states.LOADING].includes(state)}>
        {state === states.INIT && 'Simulate ☞'}
        {state === states.LOADING && 'Loading QuTiP...'}
        {state === states.SIMULATING && 'Simulating...'}
        {state === states.SIMULATED && 'Done'}
      </button>
    </div>
  );
}