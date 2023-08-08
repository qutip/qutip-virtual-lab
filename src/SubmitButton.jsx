import { useContext } from 'react';

import {
  SimulationContext,
  States,
} from './Simulation';

export default function () {
  const { submit, state, config } = useContext(SimulationContext);
  const { qubits, lasers, interactions, baths } = config

  const isDisabled = (
    [States.SIMULATING, States.LOADING].includes(state) 
    || (qubits === 0)
    || (lasers.length === 0
    && interactions.length === 0
    && baths.length === 0)
  )

  return (
    <button
      id="submit"
      onClick={submit}
      disabled={isDisabled}
    >
      {state === States.INIT && "Simulate   ▶️"}
      {state === States.LOADING && "Loading QuTiP..."}
      {state === States.SIMULATING && "Simulating..."}
      {state === States.SIMULATED && "Run Again ⟳"}
    </button>
  );
}
