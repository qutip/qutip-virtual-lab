import {
  useContext,
  useState,
} from 'react';

import { SimulationContext } from './Simulation';

const LARMOR = "LARMOR";
const DEPHASING = "DEPHASING";

export default function Demos() {
  const [demoSelected, setDemoSelected] = useState("demo");
  const { setConfig, reset } = useContext(SimulationContext);

  const handleChange = (e) => {
    setDemoSelected(e.target.value);
    setConfig(demos[e.target.value]);
    reset()
    };

  return (
    <div id="demos">
      <select value={demoSelected} onChange={handleChange}>
        <option default disabled value="demo">
          Demo
        </option>
        <option value={LARMOR}>Larmor Precession</option>
        <option value={DEPHASING}>Qubit Dephasing</option>
      </select>
    </div>
  );
}

const LarmorPrecessionConfig = {
  details: {
    Hamiltonian: "\\lambda_1 \\sigma_x^{(1)}",
    initialState: "|0\\rangle",
    collapseOperators: [],
    parameters: [{ label: "\\lambda_1", value: 1 }],
  },
  get src() {
    let str = "from qutip import *; import numpy as np; import json;";
    str += "H = sigmax();";
    str += "psi0 = basis(2, 0);";
    str += "tlist = np.linspace(0, 10, 100);";
    str +=
      "result = mesolve(H, psi0, tlist, [], [sigmax(), sigmay(), sigmaz()]);";
    str += "print(json.dumps(result.expect[0].tolist()));";
    str += "print(json.dumps(result.expect[1].tolist()));";
    str += "print(json.dumps(result.expect[2].tolist()));";
    return str;
  },
};

const QubitDephasingConfig = {
  details: {
    Hamiltonian:
      "\\Delta(\\cos(\\theta) \\sigma_z^{(1)} + \\sin(\\theta)\\sigma_x^{(1)})",
    initialState: "|0\\rangle",
    collapseOperators: ["\\sqrt{\\gamma_p}\\,\\sigma_z^{(1)}"],
    parameters: [
      { label: "\\Delta", value: "\\pi" },
      { label: "\\theta", value: "0.2*\\pi" },
      { label: "\\gamma_p", value: 0.5 },
    ],
  },
  get src() {
    let str = "from qutip import *; import numpy as np; import json;";
    str += "theta = 0.2 * np.pi;";
    str += "delta = np.pi;";
    str += "psi0 = basis(2, 0);";
    str += "H = delta * (np.cos(theta) * sigmaz() + np.sin(theta) * sigmax());";
    str += "gamma_phase = 0.5;";
    str += "c_ops = [np.sqrt(gamma_phase) * sigmaz()];";
    str += "tlist = np.linspace(0, 5, 1000);";
    str +=
      "result = mesolve(H, psi0, tlist, c_ops, [sigmax(), sigmay(), sigmaz()]);";
    str += "print(json.dumps(result.expect[0].tolist()));";
    str += "print(json.dumps(result.expect[1].tolist()));";
    str += "print(json.dumps(result.expect[2].tolist()));";
    return str;
  },
};

const demos = {
  [LARMOR]: LarmorPrecessionConfig,
  [DEPHASING]: QubitDephasingConfig,
};
