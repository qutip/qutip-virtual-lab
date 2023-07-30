import { useContext } from 'react';

import {
  SimulationContext,
  States,
} from './Simulation';

export default function () {
  const { submit, state } = useContext(SimulationContext);

  return (
    <button
      id="submit"
      onClick={submit}
      disabled={[States.SIMULATING, States.LOADING].includes(state)}
    >
      {state === States.INIT && "Simulate   ▶️"}
      {state === States.LOADING && "Loading QuTiP..."}
      {state === States.SIMULATING && "Simulating..."}
      {state === States.SIMULATED && "Run Again ⟳"}
    </button>
  );
}
