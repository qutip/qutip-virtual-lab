import './Demo.css';

import React, { useState } from 'react';

export default function DemoModal({ onExit, setTab }) {
    const [step, setStep] = useState(0)
    const nextStep = () => setStep(step => step + 1)
    const prevStep = () => setStep(step => step - 1)

    const steps = [
        Step1,
        LabStep,
        DetailStep,
        ResultsStep,
        TabsStep,
    ]
    const StepComponent = steps[step]

    return <div id="demo-modal">
        <StepComponent />
        <div className="step-counter">{`(${step + 1}/${steps.length})`}</div>
        <div className="button-group">
            {step > 0 && <button onClick={prevStep}>Back</button>}
            {step < steps.length - 1 ? <button onClick={nextStep}>Next</button> : <button onClick={onExit}>Finish</button>}
            <button onClick={onExit}>Exit</button>
        </div>
    </div>
}

const Step1 = () => {
    return (
        <>
            <h1>{`What is this?`}</h1>
            <p>
                Welcome to the <b>QuTiP Virtual Lab</b>
            </p>
            <p>This application shows how QuTiP can simulate quantum systems</p>
            <p>This modal will guide you through the application</p>
            <p>Hit Next to continue</p>
        </>
    )
}

const LabStep = () => {
    return (
        <>
            <h1>Laboratory</h1>
            <img src="" />
            <p>
                Tapping on any 'Add Qubit' will get you started.
                Once added, you can tap the qubit to toggle the menu.
            </p>
            <img />
            <p>You can add control lasers, interactions between qubits, and model heat baths from this menu</p>
        </>
    )
}

const DetailStep = () => {
    return (
        <>
            <h1>Details</h1>
            <img src="" />
            <p>
                Here you can see the equations describing the Laboratory model.
                You can tune the parameters that govern the lasers, interactions, and heat baths.
            </p>
            <p>
                You can also tweak the simulation parameters for the time step and total time.
            </p>
            <p>Once you have set up your system, click on the</p>
            <button id="submit">Simulate ▶️</button>
            <p>to simulate the system using QuTiP</p>
        </>
    )
}

const ResultsStep = () => {
    return (
        <>
            <h1>Results</h1>
            <p>Here you can see the output from QuTiP</p>
            <p>You can see how the expectation values of the spin vectors for each qubit evolve over time</p>
            <p>The evolution is plotted on the Bloch sphere</p>
            <p>You can also rotate the Bloch sphere</p>
            <p>Drag the slider at the bottom to view the system at a specific point in time</p>
        </>
    )
}

const TabsStep = () => {
    return (
        <>
            <h1>Other Controls</h1>
            <p>The <span className='tab-button'>⤢</span> will toggle fullscreen mode</p>
            <p>The <span className='tab-button'>?</span> will toggle this modal</p>
            <p>The <span className='tab-button'>⚛</span> will allow you to select an example system. Try it!</p>
        </>
    )
}