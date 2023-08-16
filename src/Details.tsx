import './Details.css';
import 'katex/dist/katex.min.css';

import React, {
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  BlockMath,
  InlineMath,
} from 'react-katex';

import { SimulationContext } from './Simulation';
import { InitialState } from './simulationUtils';

export default function Details() {
  const { details, setConfig, config } =
    useContext(SimulationContext);

  const initialStateOptions: Array<{ label: string; state: InitialState }> =
    [
      { label: "+", state: 'x' },
      { label: "-", state: '-x' },
      { label: 'i', state: "y" },
      { label: '-i', state: "-y" },
      { label: '1', state: "z" },
      { label: '0', state: "-z" }
    ]

  const { Hamiltonian, initialState, collapseOperators, parameters } = details
  const { initialStates } = config
  const { singleQubitTerms, interactionTerms } = Hamiltonian

  const uniqueParameters = useMemo(() => {
    const uParams = {...parameters}
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

  const handleChangeInitialState = (val: InitialState, qubit) => {
    setConfig(config => {
      let newInitialStates = config.initialStates
      newInitialStates[qubit] = val
      return ({ ...config, initialStates: newInitialStates })
    })
  }

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

  return (
    <div id="details">
      <div className="details-tab--content">
        <div className="details-field-cols">
          <div className="details-field">
            <label>Hamiltonian</label>
            <div className='details-field--body'>
            <BlockMath>{`H = H_{\\text{sys}} + H_{\\text{int}}`}</BlockMath>
            <BlockMath>{`H_{\\text{sys}} = ${singleQubitTerms || "0"}`}</BlockMath>
            <BlockMath>{`H_{\\text{int}} = ${interactionTerms || "0"}`}</BlockMath>
            </div>
          </div>
          <div className="details-field">
            <label>Initial State</label>
            {Object.entries(initialStates).map(([key, initialState]) => (
              <div style={{ paddingLeft: 12, margin: "1em 0" }} key={key}>
                <InlineMath>{`|q_${key}\\rangle = |`}</InlineMath>
                <select value={initialState} onChange={e => handleChangeInitialState(e.target.value as InitialState, key)}>
                  {initialStateOptions.map(option => (
                    <option key={option.state} value={option.state}>{option.label}</option>
                  ))}
                </select>
                <InlineMath>{'\\rangle'}</InlineMath>
              </div>
            ))}
            <BlockMath>{`|\\psi\\rangle = ${initialState}`}</BlockMath>
          </div>
          {!!collapseOperators?.length && (
            <div className="details-field">
              <label>Collapse Operators
              </label>
              <Info text="Collapse operators parameterize the system-bath interaction"/>
              {collapseOperators.map((C, i) => (
                <BlockMath key={i}>{`C^{(n)} = ${C.parameter.label}${C.operator.label}^{(n)}`}</BlockMath>
              ))}
            </div>
          )}
        </div>
        <div className="details-field-cols">
          {Object.keys(uniqueParameters).map(key =>
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
          )}
        </div>
      </div>
    </div>
  );
}

export const Info = ({ text }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible(v => !v)
  return (
    <div className={"info"}><span onClick={toggleVisible}>ⓘ</span>
      <div className={`info--body ${visible ? 'visible' : ''}`}>
        {text}
      </div>
    </div>
  )
}