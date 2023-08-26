import React, { useContext } from 'react';

import {
  BlockMath,
  InlineMath,
} from 'react-katex';

import BlochSphereSvg from '../assets/bloch_sphere.svg';
import { SimulationContext } from '../Simulation';
import {
  InitialStateKey,
  InitialStates,
  QubitId,
} from '../simulationUtils';
import Info from './Info';

export default function InitialState() {
    const { details: { initialState }, setConfig, config: { initialStates } } =
        useContext(SimulationContext);

    const initialStateOptions = InitialStates

    const handleChangeInitialState = (val: InitialStateKey, qubit: QubitId) => {
        setConfig(config => {
            return ({
                ...config,
                initialStates: {
                    ...config.initialStates,
                    [Number(qubit)]: InitialStates[val]
                }
            })
        })
    }

    return (
        <div className="details-field">
            <label>Initial State</label>
            <Info>
                These correspond to the eigenstates on the Bloch Sphere:
                <img src={BlochSphereSvg} width={'100%'}/>
            </Info>
            {Object.entries(initialStates).map(([key, initialState]) => (
                <div style={{ paddingLeft: 12, margin: "1em 0" }} key={key}>
                    <InlineMath>{`|q_${key}\\rangle = |`}</InlineMath>
                    <select value={initialState.key} onChange={e => handleChangeInitialState(e.target.value as InitialStateKey, Number(key) as QubitId)}>
                        {Object.values(initialStateOptions).map(option => (
                            <option key={option.key} value={option.key}>{option.display}</option>
                        ))}
                    </select>
                    <InlineMath>{'\\rangle'}</InlineMath>
                </div>
            ))}
            <BlockMath>{`|\\psi\\rangle = ${initialState}`}</BlockMath>
        </div>
    )
}