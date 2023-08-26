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

export type InitialStateKey = `${Axis}` | `-${Axis}`
export const eigenStates: Array<InitialStateKey> = [X, Y, Z, `-${X}`, `-${Y}`, `-${Z}`]
export const isInitialState = (state): state is InitialStateKey => eigenStates.includes(state)

export const InitialZero = {
    src: 'basis(2,0)',
    label: '|0\\rangle',
    key: '-z'
} as const

export const InitialOne = {
    src: 'basis(2,1)',
    label: '|1\\rangle',
    key: 'z'
} as const

export const InitialPlus = {
    src: '(basis(2,0) + basis(2,1))/np.sqrt(2)',
    label: '|+\\rangle',
    key: 'x'
} as const

export const InitialMinus = {
    src: '(basis(2,0) - basis(2,1))/np.sqrt(2)',
    label: '|-\\rangle',
    key: '-x'
} as const

export const InitialI = {
    src: '(basis(2,0) + 1j*basis(2,1))/np.sqrt(2)',
    label: '|i\\rangle',
    key: 'y'
} as const

export const InitialMinusI = {
    src: '(basis(2,0) - 1j*basis(2,1))/np.sqrt(2)',
    label: '|-i\\rangle',
    key: '-y'
} as const

export type InitialState = typeof InitialZero 
                        |  typeof InitialOne 
                        |  typeof InitialPlus 
                        |  typeof InitialMinus 
                        |  typeof InitialI 
                        |  typeof InitialMinusI

export const InitialStates: Record<InitialStateKey, InitialState> = {
    '-z': InitialZero,
    z: InitialOne,
    '-x': InitialMinus,
    x: InitialPlus,
    '-y': InitialMinusI,
    y: InitialI
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

const getParameter = v => v.parameter

export const getDetails = (config: SimulationConfig): SimulationConfigDetails => {
    const { lasers, interactions, baths, initialStates, totalTime, timeSteps } = config
    let singleQubitTerms = lasers.map(laser => `${laser.parameter.label} ${laser.operator.label}^{(${laser.qubitId})}`)
    let interactionTerms = interactions.map(({parameter, operator, qubitIds}) => {
        return `${parameter.label} ${operator.label}^{(${qubitIds[0]})}`
        + `${operator.label}^{(${qubitIds[1]})}`
    })
    let H = { 
        singleQubitTerms: singleQubitTerms.join('+'), 
        interactionTerms: interactionTerms.join('+') 
    }

    const parameters = {
        lasers: Object.values(lasers).map(getParameter),
        interactions: interactions.map(getParameter),
        baths: baths.map(getParameter)
    }
    const initialState = Object.values(initialStates).map((state) => state.label).join('\\otimes')
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
    const formatParameter = (p: SimulationParameter) => `${p.src} = ${p.value}`
    const parameters = [
        ...Object.values(lasers),
        ...interactions,
        ...baths
    ].map(getParameter)
    .map(formatParameter)
    .join(';')

    const print_bloch_vectors = Array.from(qubits).flatMap((_, q) => (
        `print(json.dumps([e.tolist() for e in expect(bloch_vector, result.states)[${q}]]))`
    ))

    const qutipImports = [
        "basis", 
        "tensor",
        "mesolve", 
        "qeye", 
        "sigmax", 
        "sigmay", 
        "sigmaz", 
        "sigmap", 
        "sigmam", 
        "expect",
        "expand_operator"
    ].join(', ')

    const getQubitIndexFromId = (qubitId: QubitId) => qubits.findIndex(qid => qid === qubitId)

    if(qubits.length === 1) {
        let H = [
            ...lasers.map(({ operator, parameter }) => `${parameter.src}*${operator.src}`),
            ...interactions.map(({ operator, parameter }) => `${parameter.src}*tensor(${operator.src},${operator.src})`)
        ].join("+") || 'qeye(2)'
         let returnArr: Array<string> = [
            `from qutip import ${qutipImports}`, 
            "import numpy as np; import json", 
            `tlist = np.linspace(0, ${totalTime}, ${timeSteps})`,
            `qubits = 1`,
            `psi0 = ${Object.values(initialStates)[0].src}`,
            parameters,
            `H = ${H}`, 
            `c_ops = ${baths.map(bath => `${bath.parameter.value}*${bath.operator.src}`).join('+') || '[]'}`, 
            "result = mesolve(H, psi0, tlist, c_ops, [])", 
            "components = [sigmax(), sigmay(), sigmaz()]",
            `bloch_vector = [components]`,
            "expectation_values = expect(bloch_vector, result.states)",
            ...print_bloch_vectors
        ].filter(statement => statement !== '')
        console.log(JSON.stringify(returnArr, undefined, 4))
        return returnArr.join(";");
    } else {
        let H = [
            ...lasers.map(({qubitId, operator, parameter}) => `${parameter.src}*expand_operator(${operator.src}, ${qubits.length}, ${getQubitIndexFromId(qubitId)})`),
            ...interactions.map(({operator, qubitIds, parameter}) => {
                return `${parameter.src}*`
                + `expand_operator(`
                + `tensor(${operator.src},${operator.src}),`
                + `${qubits.length},` 
                + `[${getQubitIndexFromId(qubitIds[0])},${getQubitIndexFromId(qubitIds[1])}])`
            })
        ].join("+") || `qeye(${qubits.map(() => 2)})`
        let returnArr: Array<string> = [
            `from qutip import ${qutipImports}`, 
            "import numpy as np; import json", 
            `tlist = np.linspace(0, ${totalTime}, ${timeSteps})`,
            `qubits = ${qubits.length}`,
            `psi0 = tensor(${(Object.keys(initialStates) as Array<string>)
                    .map(Number)
                    .sort((id1, id2) => id1 - id2)
                    .map((qubitId) =>  initialStates[qubitId].src).join(',')})`,
            parameters,
            `H = ${H}`,
            `c_ops = ${baths.map(bath => `[expand_operator(${bath.parameter.value}*${bath.operator.src}, qubits, i) for i in range(qubits)]`).join('+') || '[]'}`, 
            "result = mesolve(H, psi0, tlist, c_ops, [])", 
            "components = [sigmax(), sigmay(), sigmaz()]",
            'bloch_vector = [[tensor([component if q == qubit else qeye(2) for q in range(qubits)]) for component in components] for qubit in range(qubits)]',
            "expectation_values = expect(bloch_vector, result.states)",
            ...print_bloch_vectors
        ]
        console.log(JSON.stringify(returnArr, undefined, 4))
        return returnArr.join(";");
    }
}