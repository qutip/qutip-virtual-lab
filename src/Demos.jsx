import {
  useContext,
  useState,
} from 'react';

import { SimulationContext } from './Simulation';

const LARMOR = "LARMOR";
const DEPHASING = "DEPHASING";
const SPIN_CHAIN = "SPIN_CHAIN";

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
        <option value={SPIN_CHAIN}>Spin chain</option>
      </select>
    </div>
  );
}

const LarmorPrecessionConfig = {
  system: {
  },
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
  system: {},
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

const SpinChainConfig = {
  system: {},
  details: {
    Hamiltonian:
     "-\\frac{u}{2}\\sum_{n=1}^4 \\sigma_z^{(n)}"
     + "-\\frac{1}{2}\\sum_{n=1}^{3}"
     + "["
     +"J_x\\sigma_x^{(n)}\\sigma_x^{(n+1)}"
     +"J_y\\sigma_y^{(n)}\\sigma_y^{(n+1)}"
     +"J_z\\sigma_z^{(n)}\\sigma_z^{(n+1)}"
     + "]"
     ,
    initialState: "|1000\\rangle",
    collapseOperators: ["\\gamma\\sum_{i=1}^4 \\sigma_z^{(i)}"],
    parameters: [
      { label: "u", value: "2\\pi"},
      { label: "J_x", value: "0.2*\\pi"},
      { label: "J_y", value: "0.2*\\pi"},
      { label: "J_z", value: "0.2*\\pi"},
      { label: "\\gamma", value: "0.02*\\pi"}
    ]
  },
  get src() {
    let str = "from qutip import *; import numpy as np; import json;";
    str += "u = 2 * np.pi;"
    str += "J_x = 0.2*np.pi;"
    str += "J_y = 0.2*np.pi;"
    str += "J_z = 0.2*np.pi;"
    str += "gamma = 0.02*np.pi;"
    str += "psi0 = tensor([basis(2,1)] + [basis(2, 0)] * 3);"
    str += "sx_list = [tensor([sigmax() if i == j else qeye(2) for j in range(4) ]) for i in range(4)];"
    str += "sy_list = [tensor([sigmay() if i == j else qeye(2) for j in range(4) ]) for i in range(4)];"
    str += "sz_list = [tensor([sigmaz() if i == j else qeye(2) for j in range(4) ]) for i in range(4)];"
    str += "H = sum([-0.5*u*sz_list[i] for i in range(4)]);"
    str += "H += sum([-0.5*J_x*sx_list[i]*sx_list[i+1] for i in range(3)]);"
    str += "H += sum([-0.5*J_y*sy_list[i]*sy_list[i+1] for i in range(3)]);"
    str += "H += sum([-0.5*J_z*sz_list[i]*sz_list[i+1] for i in range(3)]);"
    str += "c_ops = [np.sqrt(gamma) * sz_list[i] for i in range(4)];"
    str += "tlist = np.linspace(0, 5, 1000);"
    str += "result = mesolve(H, psi0, tlist, [], []);"
    str += "print(json.dumps([expect(l, result.states)[0].tolist() for l in [sx_list, sy_list, sz_list]]));"
    str += "print(json.dumps([expect(l, result.states)[1].tolist() for l in [sx_list, sy_list, sz_list]]));"
    str += "print(json.dumps([expect(l, result.states)[2].tolist() for l in [sx_list, sy_list, sz_list]]));"
    str += "print(json.dumps([expect(l, result.states)[3].tolist() for l in [sx_list, sy_list, sz_list]]));"
    return str;
  }
}

const demos = {
  [LARMOR]: LarmorPrecessionConfig,
  [DEPHASING]: QubitDephasingConfig,
  [SPIN_CHAIN]: SpinChainConfig
};
