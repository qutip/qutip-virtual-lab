import React, { useContext } from 'react';

import { SimulationContext } from './Simulation';
import {
  PauliMinus,
  PauliX,
  PauliY,
  PauliZ,
  type QubitId,
  type SimulationConfig,
} from './simulationUtils';

const LARMOR = "LARMOR";
const DEPHASING = "DEPHASING";
const SPIN_CHAIN = "SPIN_CHAIN";

export default function Demos() {
  const { setConfig, demoSelected, setDemoSelected } = useContext(SimulationContext);

  const handleChange = (e) => {
    setDemoSelected(e.target.value);
    setConfig(demos[e.target.value]);
  };

  return (
    <div id="demos">
      <select value={demoSelected} onChange={handleChange}>
        <option disabled>
          Demo
        </option>
        <option value={LARMOR}>Larmor Precession</option>
        <option value={DEPHASING}>Qubit Dephasing</option>
        <option value={SPIN_CHAIN}>Spin chain</option>
      </select>
    </div>
  );
}

const LarmorPrecessionConfig: SimulationConfig = {
  qubits: [1],
  lasers: [{
    qubitId: 0,
    operator: PauliX,
    parameter: {
      label: "\\lambda^{(0)}",
      src: "lambda_0",
      value: 1
    }
  }],
  interactions: [],
  baths: [],
  initialStates: {
    0: '-z'
  }
};

const QubitDephasingConfig: SimulationConfig = {
  qubits: [1],
  lasers: [{
    qubitId: 0,
    operator: PauliZ,
    parameter: {
      label: "\\lambda^{(0)}",
      src: "lambda_0",
      value: Math.cos(0.2 * Math.PI)
    }
  },
  ],
  interactions: [],
  baths: [{
    label: "bath1",
    operator: PauliMinus,
    parameter: {
      label: "\\gamma_p",
      src: "gamma_p",
      value: 0.5
    }
  }],
  initialStates: { 1: "x" }
};

const SpinChainConfig: SimulationConfig = {
  qubits: [0,1,2,3],
  lasers: ([0,1,2,3] as Array<QubitId>).map((i: QubitId) => (
    {
      qubitId: i,
      operator: PauliZ,
      parameter: {
        label: "u",
        src: "u",
        value: 2*Math.PI
      }
    }
  )),
  //@ts-ignore
  interactions: Array.from({length: 3}).flatMap((_, i) => (
    ['x','y','z'].map((axis => ({
      qubitIds: [i, i+1],
      operator: {x: PauliX, y: PauliY, z: PauliZ}[axis], 
      parameter: {
        label: `J_${axis}`,
        src: `J_${axis}`,
        value: 0.2*Math.PI
      },
      id: `${axis}${i}${i+1}`
    }
  ))))),
  baths: [
    { 
      label: "bath1", 
      //@ts-ignore
      operator: PauliZ,
      parameter: {
        label: "\\gamma",
        src: "gamma",
        value: 0.02*Math.PI
      }
     }
  ],
  initialStates: {
    0: 'z',
    1: '-z',
    2: '-z',
    3: '-z',
  }
}

const demos = {
  [LARMOR]: LarmorPrecessionConfig,
  [DEPHASING]: QubitDephasingConfig,
  [SPIN_CHAIN]: SpinChainConfig
};
