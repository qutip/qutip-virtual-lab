import './Details.css';
import 'katex/dist/katex.min.css';

import React, { useContext } from 'react';

// @ts-ignore
import {
  BlockMath,
  InlineMath,
} from 'react-katex';

import { SimulationContext } from './Simulation';
import { InitialState } from './simulationUtils';

export default function Details() {
  const { details, setConfig, config } =
    useContext(SimulationContext);
    
    const initialStateOptions: Array<InitialState> = ["x", "y", "z", "-x", "-y", "-z"]
    
    const { Hamiltonian, initialState, collapseOperators, parameters } = details
    const { initialStates } = config

  const handleChangeInitialState = (val: InitialState, qubit) => {
    let newInitialStates = config.initialStates
    newInitialStates[qubit] = val
    setConfig(config => ({...config, initialStates: newInitialStates}))
  }

  return (
    <div id="details">
      <div>
        <div className="details-tab--content">
          <div className="details-field-cols">
            <div className="details-field">
              <label>Hamiltonian</label>
              <BlockMath>{`H = ${Hamiltonian}`}</BlockMath>
            </div>
            <div className="details-field">
              <label>Initial State</label>
              {Object.entries(initialStates).map(([key, initialState]) => (
                <div>
                  <InlineMath>{`|q_${key}\\rangle = |`}</InlineMath>
                  <select value={initialState} onChange={e => handleChangeInitialState(e.target.value as InitialState, key)}>
                    {initialStateOptions.map(option => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                  <InlineMath>{'\\rangle'}</InlineMath>
                </div>
              ))}
              <BlockMath>{`|\\psi\\rangle = ${initialState}`}</BlockMath>
            </div>
          </div>
          <div className="details-field-cols">
            {!!collapseOperators?.length && (
              <div className="details-field">
                <label>Collapse Operators</label>
                {collapseOperators.map((C, i) => (
                  <BlockMath>{`C_{${i}} = ${C.parameter.label}${C.operator.label}`}</BlockMath>
                ))}
              </div>
            )}
            {!!parameters?.length && (
              <div className="details-field">
                <label>Parameters</label>
                {parameters.map(({ label, value }, i) => { return (label) && (<BlockMath>{`${label} = ${value}`}</BlockMath>) }
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
