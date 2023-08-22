import React, {
  useContext,
  useMemo,
} from 'react';

import { InlineMath } from 'react-katex';

import { SimulationContext } from '../Simulation';

export default function Parameters() {

    const { details: { parameters }, setConfig } =
        useContext(SimulationContext);

    const uniqueParameters = useMemo(() => {
        const uParams = { ...parameters }
        for (let key of Object.keys(parameters)) {
            const uniqueLabels = new Set(parameters[key].map(p => p.label))
            if (uniqueLabels.size !== parameters[key].length) {
                uParams[key] = []
                uniqueLabels.forEach((label) => {
                    const parameter = parameters[key].find(p => p.label === label)
                    uParams[key].push(parameter)
                })
            }
        }
        return uParams
    }, [parameters])

    const handleChangeParameterValue = (val: number, parameterLabel, key) => {
        setConfig(config => {
            return ({
                ...config,
                [key]: config[key].map(operator => {
                    if (operator.parameter.label === parameterLabel)
                        return { ...operator, parameter: { ...operator.parameter, value: val } }
                    return operator
                })
            })
        })
    }
    return Object.keys(uniqueParameters).map(key =>
        !!uniqueParameters[key]?.length && (
            <div className="details-field" key={key}>
                <label>{`${key.slice(0, -1)} Parameters`}</label>
                <div className='details-field--body'>
                    {
                        uniqueParameters[key].map(({ label, value }, i) => {
                            return (label) && (
                                <div key={label} style={{ padding: "0 12px", margin: "10px 0" }}>
                                    <InlineMath>{`${label} = `}</InlineMath>
                                    <input type="number" width="2" step={0.1} value={value} onChange={e => handleChangeParameterValue(Number(e.target.value) as number, label, key)} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    )
}