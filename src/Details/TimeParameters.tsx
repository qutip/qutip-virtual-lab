import React, { useContext } from 'react';

import { InlineMath } from 'react-katex';

import { SimulationContext } from '../Simulation';

export default function TimeParameters() {
    const { setConfig, details: { totalTime, timeSteps } } =
        useContext(SimulationContext);

    const handleChangeTimeSteps = (val) => {
        setConfig(config => {
            return {
                ...config,
                timeSteps: val
            }
        })
    }
    const handleChangeTotalTime = (val) => {
        setConfig(config => {
            return {
                ...config,
                totalTime: val
            }
        })
    }

    return (
        <div className="details-field">
            <label>Time</label>
            <div style={{ paddingLeft: 12, margin: "1em 0" }}>
                <div>
                    Total simulation time: {' '}
                    <InlineMath>{"t ="}</InlineMath>
                    <input
                        type="number"
                        width="2"
                        step={1}
                        min={10}
                        max={20}
                        value={totalTime}
                        onChange={e => handleChangeTotalTime(Number(e.target.value) as number)}
                    />
                </div>
                <div>
                    Time steps: {' '}
                    <InlineMath>{"n = "}</InlineMath>
                    <input
                        type="range"
                        width="2"
                        step={1}
                        min={100}
                        max={10000}
                        value={timeSteps}
                        onChange={e => handleChangeTimeSteps(Number(e.target.value) as number)}
                    />
                </div>
                <div>
                    Step size: {' '}
                    <InlineMath>
                        {`\\Delta t = t / n = ${(totalTime / timeSteps).toFixed(4)}`}
                    </InlineMath>
                </div>
            </div>
        </div>
    )
}