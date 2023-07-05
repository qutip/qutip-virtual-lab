import './Details.css';
import 'katex/dist/katex.min.css';

import React, { useContext } from 'react';

import { BlockMath } from 'react-katex';

import { SimulationContext } from './Simulation';

export default function Details() {
  const { state, reset, submit, setConfig, config } =
    useContext(SimulationContext);

  const { Hamiltonian, initialState, collapseOperators, parameters } =
    config.details;

  return (
    <div id="details">
      <div>
        <div className="details-tab--content">
          <div className="details-field-cols">
            <div className="details-field">
              <label>Hamiltonian</label>
              <BlockMath>{`\\mathcal{H} = ${Hamiltonian}`}</BlockMath>
            </div>
            <div className="details-field">
              <label>Initial State</label>
              <BlockMath>{`|\\psi(0)\\rangle = ${initialState}`}</BlockMath>
            </div>
          </div>
          <div className="details-field-cols">
            {!!collapseOperators?.length && (
              <div className="details-field">
                <label>Collapse Operators</label>
                {collapseOperators.map((C, i) => (
                  <BlockMath>{`C_{${i}} = ${C}`}</BlockMath>
                ))}
              </div>
            )}
            {!!parameters?.length && (
              <div className="details-field">
                <label>Parameters</label>
                {parameters.map(({label, value}, i) => 
                  {return (label) && (<BlockMath>{`${label} = ${value}`}</BlockMath>)}
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
