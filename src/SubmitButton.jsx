import { useContext } from 'react';

import {
  SimulationContext,
  states,
} from './Simulation';

export default function () {
  const { submit, state } = useContext(SimulationContext);

  return (
    <button
      id="submit"
      onClick={submit}
      disabled={[states.SIMULATING, states.LOADING].includes(state)}
    >
      {state === states.INIT && "Simulate   ▶️"}
      {state === states.LOADING && "Loading QuTiP..."}
      {state === states.SIMULATING && "Simulating..."}
      {state === states.SIMULATED && "Run Again ⟳"}
    </button>
  );
}
