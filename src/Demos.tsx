import React, {
  useContext,
  useState,
} from 'react';

import { SimulationContext } from './Simulation';
import {
  PauliX,
  PauliY,
  PauliZ,
  type SimulationConfig,
} from './simulationUtils';

const LARMOR = "LARMOR";
const DEPHASING = "DEPHASING";
const SPIN_CHAIN = "SPIN_CHAIN";

export default function Demos() {
  const [demoSelected, setDemoSelected] = useState("demo");
  const { setConfig, reset } = useContext(SimulationContext);

  const handleChange = (e) => {
    setDemoSelected(e.target.value);
    setConfig(demos[e.target.value]);
  };

  return (
    <div id="demos">
      <select value={demoSelected} onChange={handleChange}>
        <option disabled value="demo">
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
    qubitId: 1,
    operator: PauliX,
    parameter: {
      label: "\\lambda^{(1)}",
      src: "lambda_1",
      value: 1
    }
  }],
  interactions: [],
  baths: [],
  initialStates: {
    1: '-z'
  }
};

const QubitDephasingConfig: SimulationConfig = {
  qubits: [1],
  lasers: [{
    qubitId: 1,
    operator: PauliX,
    parameter: {
      label: "\\lambda^{(1)}",
      src: "lambda_1",
      value: Math.cos(0.2 * Math.PI)
    }
  },
  {
    qubitId: 1,
    operator: PauliZ,
    parameter: {
      label: "\\lambda^{(2)}",
      src: "lambda_2",
      value: Math.sin(0.2 * Math.PI)
    }
  }
  ],
  interactions: [],
  baths: [{
    label: "bath1",
    //@ts-ignore
    operator: PauliX,
    parameter: {
      label: "\\gamma_p",
      src: "gamma_p",
      value: 0.5
    }
  }],
  initialStates: { 1: "-z" }
};

const SpinChainConfig: SimulationConfig = {
  qubits: [1, 2, 3, 4],
  lasers: Array.from({length: 4}, (_, i) => (
    {
      qubitId: i+1,
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
      qubitIds: [i+1, i+2],
      operator: {x: PauliX, y: PauliY, z: PauliZ}[axis], 
      parameter: {
        label: `J_${axis}`,
        src: `J_${axis}`,
        value: 0.2*Math.PI
      },
      id: `${axis}${i+1}${i+2}`
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
    1: 'z',
    2: '-z',
    3: '-z',
    4: '-z',
  }
}

const demos = {
  [LARMOR]: LarmorPrecessionConfig,
  [DEPHASING]: QubitDephasingConfig,
  [SPIN_CHAIN]: SpinChainConfig
};
