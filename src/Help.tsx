import './Help.css';

import React, { useState } from 'react';

import addInteraction from './assets/add_interaction.webm';
import addQubit from './assets/add_qubit.webm';
import addRemoveBath from './assets/add_remove_bath.webm';
import changeInitialStates from './assets/change_initial_state.webm';
import changeParameters from './assets/change_parameters.webm';
import changeTimeSteps from './assets/change_time_steps.webm';
import showResults from './assets/show_results.webm';
import toggleLaser from './assets/toggle_laser.webm';

export default function Help() {
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

    return <div id="help">
        <StepComponent />
        <div className="step-counter">{`(${step + 1}/${steps.length})`}</div>
        <div className="button-group">
            {step > 0 && <button onClick={prevStep}>Back</button>}
            {step < steps.length - 1 ? <button onClick={nextStep}>Next</button> : <button>Finish</button>}
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
            <p>This will guide you through the application</p>
            <p>Hit Next to continue</p>
        </>
    )
}

const LabStep = () => {
    return (
        <>
            <h1>Laboratory</h1>
            <p>
                Tapping on any 'Add Qubit' will get you started.
                Once added, you can tap the qubit to toggle the menu.
            </p>
            <div style={{ display: 'flex' }}>
                <video controls width={300}>
                    <source src={addQubit} type='video/webm' />
                </video>
            </div>
            <p>You can add control lasers, interactions between qubits, and model heat baths from this menu</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ flex: '0 1 auto' }}>
                    <video controls height={300}>
                        <source src={toggleLaser} />
                    </video>
                </div>
                <div style={{ flex: '0 1 auto' }}>
                    <video controls width={300}>
                        <source src={addInteraction} />
                    </video>
                </div>
                <div style={{ flex: '0 1 auto' }}>
                    <video controls width={300}>
                        <source src={addRemoveBath} />
                    </video>
                </div>
            </div>
        </>
    )
}

const DetailStep = () => {
    return (
        <>
            <h1>Details</h1>
            <p>
                Here you can see the equations describing the Laboratory model.
                You can tune the parameters that govern the lasers, interactions, and heat baths.
            </p>
            <video controls>
                <source src={changeParameters} />
            </video>
            <p>
                You can change the initial state of each qubit to one of the eigenstates
            </p>
            <video controls>
                <source src={changeInitialStates} />
            </video>
            <p>
                You can also tweak the simulation parameters for the time step and total time.
            </p>
            <video controls>
                <source src={changeTimeSteps}/>
            </video>
            
            <p>Once you have set up your system, click on the</p>
            <button id="submit">Simulate ▶️</button>
            <p>on the bottom of your screen to simulate the system using QuTiP</p>
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
            <video controls>
                <source src={showResults}/>
            </video>
        </>
    )
}

const TabsStep = () => {
    return (
        <>
            <h1>Other Controls</h1>
            <p>The ⤢ button will toggle fullscreen mode</p>
            <p>The ⚛ button will allow you to select an example system. Try it!</p>
        </>
    )
}