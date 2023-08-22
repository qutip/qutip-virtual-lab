import React, { useContext } from 'react';

import { BlockMath } from 'react-katex';

import { SimulationContext } from '../Simulation';

export default function Hamiltonian() {
    const { details: { Hamiltonian: { singleQubitTerms, interactionTerms } } } =
        useContext(SimulationContext);

    return (
        <div className="details-field">
            <label>Hamiltonian</label>
            <div className='details-field--body'>
                <BlockMath>{`H = H_{\\text{sys}} + H_{\\text{int}}`}</BlockMath>
                <BlockMath>{`H_{\\text{sys}} = ${singleQubitTerms || "0"}`}</BlockMath>
                <BlockMath>{`H_{\\text{int}} = ${interactionTerms || "0"}`}</BlockMath>
            </div>
        </div>
    )
}