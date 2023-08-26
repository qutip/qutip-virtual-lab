import React, { useContext } from 'react';

import { BlockMath } from 'react-katex';

import { SimulationContext } from '../Simulation';
import Info from './Info';

export default function CollapseOperators() {
    const { details: { collapseOperators } } =
        useContext(SimulationContext);

    return !!collapseOperators?.length && (
        <div className="details-field">
            <label>Collapse Operators
            </label>
            <Info>{"Collapse operators parameterize the system-bath interaction"}</Info>
            {collapseOperators.map((C, i) => (
                <BlockMath key={i}>{`C^{(n)} = ${C.parameter.label}${C.operator.label}^{(n)}`}</BlockMath>
            ))}
        </div>
    )
}