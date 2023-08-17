export type QubitId = 0 | 1 | 2 | 3;
export const X = 'x' as const
export const Y = 'y' as const
export const Z = 'z' as const

export type Axis = typeof X | typeof Y | typeof Z;
export type PauliOperatorKey = `S${Axis}`

export const PauliX = {
    src: "sigmax()",
    label: "\\sigma_x",
    key: 'Sx'
} as const
export const PauliY = {
    src: "sigmay()",
    label: "\\sigma_y",
    key: 'Sy'
} as const
export const PauliZ = {
    src: "sigmaz()",
    label: "\\sigma_z",
    key: 'Sz'
} as const
export const PauliPlus = {
    src: "sigmap()",
    label: "\\sigma_+",
    key: 'Sp'
} as const
export const PauliMinus = {
    src: "sigmam()",
    label: "\\sigma_-",
    key: 'Sm'
} as const

export type PauliOperator = (typeof PauliX) | typeof PauliY | typeof PauliZ

export const PauliOperators: Record<PauliOperatorKey, PauliOperator> = {
    Sx: PauliX,
    Sy: PauliY,
    Sz: PauliZ
}

export type InitialState = `${Axis}` | `-${Axis}`
export const eigenStates: Array<InitialState> = [X, Y, Z, `-${X}`, `-${Y}`, `-${Z}`]
export const isInitialState = (state): state is InitialState => eigenStates.includes(state)

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
    id: string;
}

type CollapseOperator = {
    label: string;
    operator: typeof PauliPlus | typeof PauliMinus;
    parameter: SimulationParameter
}

export interface SimulationConfigDetails {
    Hamiltonian: {
        singleQubitTerms: string;
        interactionTerms: string;
    };
    parameters: {
        lasers: Array<SimulationParameter>;
        interactions: Array<SimulationParameter>;
        baths: Array<SimulationParameter>;
    };
    collapseOperators: Array<CollapseOperator>;
    initialState: string;
    totalTime: number;
    timeSteps: number;
}

export interface SimulationConfig {
    qubits: Array<QubitId>;
    lasers: Array<SingleQubitOperator>;
    interactions: Array<InteractionOperator>;
    baths: Array<CollapseOperator>;
    initialStates: {
        [key in QubitId]: InitialState
    } | {};
    totalTime: number;
    timeSteps: number;
}

export const emptyConfig: SimulationConfig = {
    lasers: [],
    interactions: [],
    baths: [],
    qubits: [],
    initialStates: {},
    totalTime: 10,
    timeSteps: 100
}


export const getDetails = (config: SimulationConfig): SimulationConfigDetails => {
    const { lasers, interactions, baths, initialStates, totalTime, timeSteps } = config
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
    let H = { singleQubitTerms: singleQubitTerms.join('+'), interactionTerms: interactionTerms.join('+') }

    const getParameter = v => v.parameter
    const parameters = {
        lasers: Object.values(lasers).map(getParameter),
        interactions: interactions.map(getParameter),
        baths: baths.map(getParameter)
    }
    const initialState = Object.values(initialStates).map((state) => {
        if (state === '-z') return '|0\\rangle'
        if (state === 'z') return '|1\\rangle'
        if (state === 'x') return '|+\\rangle'
        if (state === '-x') return '|-\\rangle'
        if (state === 'y') return '|i\\rangle'
        if (state === '-y') return '|-i\\rangle'
    }).join('\\otimes')
    return {
        Hamiltonian: H,
        parameters,
        collapseOperators: baths,
        initialState,
        totalTime,
        timeSteps,
    };
}

export const getSrc = (config: SimulationConfig): string => {
    const { lasers, interactions, baths, qubits, initialStates, totalTime, timeSteps } = config;
    let imports = "from qutip import *; import numpy as np; import json";
    let tlist = `tlist = np.linspace(0, ${totalTime}, ${timeSteps})`;
    let qs = `qubits = ${qubits.length}`
    let psi0Arr = (Object.keys(initialStates) as Array<string>)
        .map(Number)
        .sort((id1, id2) => id1 - id2)
        .map((qubitId) => {
            const initialState = initialStates[qubitId]
            if (initialState === '-z') return "basis(2,0)"
            if (initialState === 'z') return "basis(2,1)"
            if (initialState === 'x') return "(basis(2,0) + basis(2,1))/np.sqrt(2)"
            if (initialState === '-x') return "(basis(2,0) + basis(2,1))/np.sqrt(2)"
            if (initialState === 'y') return "(basis(2,0) + j*basis(2,1))/np.sqrt(2)"
            if (initialState === '-y') return "(basis(2,0) - j*basis(2,1))/np.sqrt(2)"
        })
    const psi0 = qubits.length === 1 ? `psi0 = ${psi0Arr[0]}` : `psi0 = tensor(${psi0Arr.join()})`
    let H: Array<string> = [];
    let params: Array<string> = [];
    lasers.forEach((laser) => {
        const { qubitId, operator, parameter } = laser;
        const laserSrc = qubits.length > 1 
            ? `expand_operator(${operator.src}, ${qubits.length}, ${qubitId})` 
            : operator.src
        H = [...H, `${parameter.src}*${laserSrc}`];
        params = [...params, `${parameter.src} = ${parameter.value}`]
    });
    interactions.forEach((interaction) => {
        const { qubitIds, operator, parameter } = interaction;
        const interactionSrc = qubits.length > 2 
            ? `expand_operator(tensor(${operator.src},${operator.src}), ${qubits.length}, [${qubitIds[0]},${qubitIds[1]}])` 
            : `tensor(${operator.src},${operator.src})`
        H = [...H, `${parameter.src}*${interactionSrc}`]
        params = [...params, `${parameter.src} = ${parameter.value}`]
    });
    if(!H.length) {
        H = [Array.from(qubits, () => 'qeye(2)').join("*")]
    }
    const bathsSrc = baths.map(bath => `[expand_operator(${bath.parameter.value}*${bath.operator.src}, ${qubits.length}, i) for i in range(${qubits.length})]`)
    let c_ops = `c_ops = ${bathsSrc.join('+') || '[]'}`
    const solve =
        "result = mesolve(H, psi0, tlist, c_ops, [])";

    const expect = [
        "components = [sigmax(), sigmay(), sigmaz()]",
        `bloch_vector = ${qubits.length === 1 ? '[components]' : '[[tensor([component if q == qubit else qeye(2) for q in range(qubits)]) for component in components] for qubit in range(qubits)]'}`,
        "expectation_values = expect(bloch_vector, result.states)"
    ]

    const print_density_matrix = [
        "rhos = [ket2dm(state) for state in result.states]",
        "print(rhos)"
    ]

    const print_bloch_vectors = Array.from(qubits).flatMap((_, q) => (
        `print(json.dumps([e.tolist() for e in expect(bloch_vector, result.states)[${q}]]))`
    ))

    const print_q_func = [
        "print(json.dumps([qfunc(rho, np.linspace(), np.linspace()) for rho in rhos]))",
    ]

    const print_outputs = [
        // ...print_density_matrix, 
        ...print_bloch_vectors,
        // ...print_q_func
    ]

    let returnArr = [
        imports, 
        tlist, 
        qs, 
        psi0,
        ...(params.length ? [params.join(";")] : []),
        `H = ${H.join("+")}`, 
        c_ops, 
        solve, 
        ...expect,
        ...print_outputs
    ].filter(statement => statement !== '')
    console.log(JSON.stringify(returnArr, undefined, 4))
    return returnArr.join(";");
}