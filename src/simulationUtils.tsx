export type QubitId = number;
export type Axis = "x" | "y" | "z";
export type PauliOperatorKey = `S${Axis}`

export const PauliX = { 
    src: "sigmax()",
    label: "\\sigma_x",
} as const
export const PauliY = {
    src: "sigmay()",
    label: "\\sigma_y",
} as const
export const PauliZ = {
    src: "sigmaz()",
    label: "\\sigma_z"
} as const


export type PauliOperator = (typeof PauliX) | typeof PauliY | typeof PauliZ

export const PauliOperators: Record<PauliOperatorKey, PauliOperator> = {
    Sx: PauliX,
    Sy: PauliY,
    Sz: PauliZ
}

type SimulationParameter = {
    label: string;
    src: string;
    value: number;
}

export type SingleQubitOperator = {
    qubitId: QubitId;
    operator: PauliOperator;
    parameter: SimulationParameter;
}

export type InteractionOperator = {
    qubitIds: QubitId[];
    operator: PauliOperator;
    parameter: SimulationParameter;
}

type CollapseOperator = {
    label: string;
    operator: PauliOperator;
    parameter: SimulationParameter
}

export interface SimulationConfigDetails {
    Hamiltonian: string;
    parameters: Array<SimulationParameter>;
    collapseOperators: Array<CollapseOperator>;
    initialState: string;
}

export interface SimulationConfig {
    qubits: number;
    lasers: Array<SingleQubitOperator>;
    interactions: Array<InteractionOperator>;
    baths: Array<CollapseOperator>;
}

export const emptyConfig: SimulationConfig = {
    lasers: [],
    interactions: [],
    baths: [],
    qubits: 0
}


export const getDetails = (config: SimulationConfig): SimulationConfigDetails => {
    const { lasers, interactions, baths, qubits } = config
    let interactionTerms: Array<string> = []
    let singleQubitTerms: Array<string> = []
    lasers.forEach(laser => {
            const str = `${laser.parameter.label} ${laser.operator.label}^{(${laser.qubitId})}`
            singleQubitTerms = [...singleQubitTerms, str]
    })
    interactions.forEach(interaction => {
        const str = `${interaction.parameter.label} ${interaction.operator.label}^{(${interaction.qubitIds[0]})}`
            + `${interaction.operator.label}^{(${interaction.qubitIds[1]})}`
        interactionTerms = [...interactionTerms, str]
    })
    let H: Array<string> = [...singleQubitTerms, ...interactionTerms]

    const getParameter = v => v.parameter
    const parameters = [
        ...Object.values(lasers).map(getParameter),
        ...interactions.map(getParameter),
        ...baths.map(getParameter)
    ]
    return {
        Hamiltonian: H.join('+'),
        parameters,
        collapseOperators: baths,
        initialState: `|${"0".repeat(qubits)}\\rangle`, // TODO: allow user to set
    };
}

export const getSrc = (config: SimulationConfig): string => {
    const { lasers, interactions, baths, qubits } = config;
    let imports = "from qutip import *; import numpy as np; import json";
    let tlist = "tlist = np.linspace(0, 10, 100)";
    let psi0 = `psi0 = basis(${qubits}, 0)`;
    let H: Array<string> = [];
    let params: Array<string> = [];
    lasers.forEach((laser) => {
            const { qubitId, operator, parameter } = laser ;
            const embedded = Array.from({ length: qubits }, (_, i) =>
            i === qubitId ? `${parameter.src}*${operator.src}` : "qeye(2)"
            ).join();
            params = [...params, `${parameter.src} = ${parameter.value}`]
            H = [...H, `tensor(${embedded})`];
    });
    interactions.forEach((interaction) => {
        const { qubitIds, operator, parameter } = interaction;
        const embedded = Array.from({ length: qubits }, () => "qeye(2)");
        embedded[qubitIds[0]] = `${operator.src}`;
        embedded[qubitIds[1]] = `${operator.src}`;
        params = [...params, `${parameter.src} = ${parameter.value}`]
        H.push(`${parameter.src}*tensor(${embedded.join()})`);
    });
    let c_ops = `c_ops = [${baths.map(bath => `${bath.parameter.value}*${bath.operator.src}`).join()}]`
    const solve =
        "result = mesolve(H, psi0, tlist, c_ops, [sigmax(), sigmay(), sigmaz()])";
    const print = Array.from({ length: 3 })
        .map((_, i) => `print(json.dumps(result.expect[${i}].tolist()))`)
        .join(";");
    return [imports, tlist, psi0, params.join(';'), `H = ${H.join("+")}`, c_ops, solve, print].join(";");
}
