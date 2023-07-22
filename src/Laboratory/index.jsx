import React, {
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  Group,
  Layer,
  Stage,
} from 'react-konva';

import { SimulationContext } from '../Simulation';
import Grid from './Grid';
import Interaction from './Interaction';
import Qubit, { QubitMenu } from './Qubit';

const margin = {
  top: 0,
  right: 40,
  bottom: 40,
  left: 0,
};

const width = window.innerWidth - margin.right;
const height = window.innerHeight - margin.bottom;
const center = { x: width / 2, y: height / 2 };
const qubitPositions = {
  TOP_LEFT: { x: center.x - 270, y: center.y - 100, active: false },
  TOP_RIGHT: { x: center.x + 90, y: center.y - 100, active: false },
  BOTTOM_LEFT: { x: center.x - 90, y: center.y + 100, active: false },
  BOTTOM_RIGHT: { x: center.x + 270, y: center.y + 100, active: false },
};

export default function Laboratory() {
  const { config, setConfig } = useContext(SimulationContext);
  const [toolSelected, setToolSelected] = useState();
  const [lasers, setLasers] = useState();
  const [heatBaths, setHeatBaths] = useState();
  const [activeQubitPositions, setActiveQubitPositions] =
  useState(qubitPositions);
  const [qubitSelected, setQubitSelected] = useState();
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [interactionSourceQubit, setInteractionSourceQubit] = useState();
  const initInteractionModalState = {
    visible: false,
    qubit1: null,
    qubit2: null,
    operator: null,
    scalar: 0,
  };
  const [interactionModal, setInteractionModal] = useState(
    initInteractionModalState
    );
  const [interactions, setInteractions] = useState([]);

  const numActiveQubits = useMemo(() => {
    return Object.values(activeQubitPositions).reduce(
      (acc, curr) => acc + !!curr.active,
      0
    );
  }, [activeQubitPositions]);

  const handleAddQubit = (position) => {
    setActiveQubitPositions((positions) => ({
      ...positions,
      [position]: {
        ...positions[position],
        active: true,
      },
    }));
    setConfig((config) => ({ ...config, qubits: config.qubits + 1 }));
  };

  const handleRemoveQubit = (position) => {
    setQubitSelected(null)
    setActiveQubitPositions((positions) => ({
      ...positions,
      [position]: {
        ...positions[position],
        active: false,
      },
    }));
  };

  const getHamiltonian = () => {};


  const handleSelectQubit = (key) => {
    if (isAddingInteraction) {
      setInteractionModal(() => ({
        visible: true,
        qubit1: interactionSourceQubit,
        qubit2: key,
        operator: null,
        scalar: 1,
      }));
    } else setQubitSelected((selected) => (selected === key ? null : key));
  };


  const handleAddInteraction = (key) => {
    setQubitSelected(null);
    setIsAddingInteraction(true);
    setInteractionSourceQubit(key);
  };
  const handleCancelAddInteraction = () => {
    setIsAddingInteraction(false);
    setInteractionSourceQubit(null);
    setInteractionModal(initInteractionModalState)
  };

  const handleFinishAddInteraction = () => {
    setIsAddingInteraction(false);
    setInteractionSourceQubit(null);
    const { qubit1, qubit2, operator, scalar } = interactionModal;
    setInteractions((interactions) => [
      ...interactions,
      { qubit1, qubit2, operator, scalar },
    ]);
    setInteractionModal(initInteractionModalState);
  };

  const handleAddHeatBath = () => {};
  const handleAddLaser = () => {};

  return (
    <>
      <Stage
        width={width}
        height={height}
        style={{ background: "#252525", position: "absolute" }}
      >
        <Layer>
          <Grid width={width} height={height} />
          <Group x={-120} y={-60}>
            {interactions.map(({ qubit1, qubit2, operator, scalar }) => (
              <Interaction
                qubit1Position={activeQubitPositions[qubit1]}
                qubit2Position={activeQubitPositions[qubit2]}
                label={operator}
              />
            ))}
            {Object.entries(activeQubitPositions).map(
              ([key, { active, ...position }], i) => (
                <>
                  <Qubit
                    key={"q" + i}
                    selected={qubitSelected === key}
                    active={active}
                    onActivate={() => handleAddQubit(key)}
                    onSelect={() => handleSelectQubit(key)}
                    disabled={isAddingInteraction && (interactionSourceQubit === key)}
                    {...position}
                  />
                  <QubitMenu
                    visible={qubitSelected === key}
                    onClose={() => handleSelectQubit(key)}
                    onRemoveQubit={() => handleRemoveQubit(key)}
                    onAddHeatBath={handleAddHeatBath}
                    onAddLaser={handleAddLaser}
                    {...position}
                    {...(numActiveQubits > 1
                      ? { onAddInteraction: () => handleAddInteraction(key) }
                      : {})}
                  />
                </>
              )
            )}
          </Group>
        </Layer>
      </Stage>
      {isAddingInteraction && !interactionModal.visible && (
        <div
          style={{
            position: "absolute",
            color: "white",
            fontFamily: "monospace",
            fontSize: 20,
            bottom: 140,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#252525",
            padding: "10px 12px",
            border: "1px solid white",
          }}
        >
          Tap another qubit to set an interaction or{" "}
          <button
            style={{ display: "inline !important", fontSize: 18 }}
            onClick={handleCancelAddInteraction}
          >
            Cancel
          </button>
        </div>
      )}
      {isAddingInteraction && interactionModal.visible && (
        <div
          style={{
            position: "absolute",
            color: "white",
            fontFamily: "monospace",
            fontSize: 20,
            bottom: 140,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#252525",
            padding: "10px 12px",
            border: "1px solid white",
          }}
        >
          Operator:{" "}
          <select
            style={{ height: 35, width: "100%" }}
            value={interactionModal.operator || "operator"}
            onChange={(e) =>
              setInteractionModal((v) => ({ ...v, operator: e.target.value }))
            }
          >
            <option disabled value="operator">
              Operator
            </option>
            <option value="Sx">Sx</option>
            <option value="Sy">Sy</option>
            <option value="Sz">Sz</option>
          </select>
          <br />
          Strength:{" "}
          <input
            style={{ height: 35, width: "100%" }}
            type="number"
            value={interactionModal.scalar || 0}
            onChange={(e) =>
              setInteractionModal((v) => ({ ...v, scalar: e.target.value }))
            }
          />
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              margin: "20px 0 10px 0",
            }}
          >
            <button
            style={{padding: '10px 30px'}}
              disabled={
                interactionModal.operator === null ||
                interactionModal.scalar === 0
              }
              onClick={() => handleFinishAddInteraction()}
            >
              OK
            </button>
            <button style={{padding: '10px 30px'}} onClick={handleCancelAddInteraction}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
