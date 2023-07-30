import React, {
  useContext,
  useMemo,
  useState,
} from 'react';

// @ts-ignore
import {
  Group,
  Layer,
  Stage,
} from 'react-konva';

import { SimulationContext } from '../Simulation';
import {
  type PauliOperator,
  type PauliOperatorKey,
  PauliOperators,
  PauliX,
  type QubitId,
} from '../simulationUtils';
import AddInteractionModal from './AddInteractionModal';
import Bath from './Bath';
import Grid from './Grid';
import Interaction from './Interaction';
import InteractionModal from './InteractionModal';
import Laser from './Laser';
import Qubit, { QubitMenu } from './Qubit';

const margin = {
  top: 0,
  right: 40,
  bottom: 40,
  left: 0,
};

const noop = () => { }

const width = window.innerWidth - margin.right;
const height = window.innerHeight - margin.bottom;
const center = { x: width / 2, y: height / 2 };

enum QubitPosition {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT"
}

type QubitInteractions = `${QubitPosition},${QubitPosition}`

interface QubitCoords {
  x: number,
  y: number
}

const qubitIds: Record<QubitPosition, QubitId> = {
  TOP_LEFT: 1,
  TOP_RIGHT: 2,
  BOTTOM_LEFT: 3,
  BOTTOM_RIGHT: 4
}

const qubitPositions: Record<QubitPosition, QubitCoords> = {
  TOP_LEFT: { x: center.x - 270, y: center.y + 50 },
  TOP_RIGHT: { x: center.x + 90, y: center.y + 50 },
  BOTTOM_LEFT: { x: center.x - 90, y: center.y - 50 },
  BOTTOM_RIGHT: { x: center.x + 270, y: center.y - 50 },
} as const


const initQubitState: Record<QubitPosition, boolean> = {
  TOP_LEFT: false,
  TOP_RIGHT: false,
  BOTTOM_LEFT: false,
  BOTTOM_RIGHT: false,
};


export default function Laboratory() {
  const { config, setConfig } = useContext(SimulationContext);
  const [activeQubits, setActiveQubits] =
    useState(initQubitState);
  const [lasers, setLasers] = useState<Record<QubitPosition, { on: boolean, orientation: PauliOperatorKey | undefined }>>(
    {
      TOP_LEFT: { on: false, orientation: undefined },
      TOP_RIGHT: { on: false, orientation: undefined },
      BOTTOM_LEFT: { on: false, orientation: undefined },
      BOTTOM_RIGHT: { on: false, orientation: undefined },
    }
  )
  const [qubitSelected, setQubitSelected] = useState<undefined | QubitPosition>();
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [interactionSourceQubit, setInteractionSourceQubit] = useState<undefined | QubitPosition>();
  const [interactionTargetQubit, setInteractionTargetQubit] = useState<undefined | QubitPosition>();
  const [interactionModalVisible, setInteractionModalVisible] = useState<boolean>(false);
  const [interactions, setInteractions] = useState<Array<{ qubits: [QubitPosition, QubitPosition], label: PauliOperatorKey }>>([])

  const numActiveQubits = useMemo(() => {
    return Object.values(activeQubits).reduce(
      (acc, curr) => acc + Number(curr),
      0
    );
  }, [activeQubits]);

  const handleAddQubit = (position) => {
    setActiveQubits((positions) => ({
      ...positions,
      [position]: true
    }));

    setConfig((config) => ({
      ...config,
      qubits: Math.min(4, config.qubits + 1),
      initialStates: {
        ...config.initialStates,
        [qubitIds[position]]: '-z'
      }
    }));
  };

  const handleRemoveQubit = (position) => {
    setQubitSelected(undefined)
    setActiveQubits((positions) => ({
      ...positions,
      [position]: false
    }));
    setInteractions(interactions => interactions.filter(({qubits}) => !qubits.includes(position)))
    setConfig((config) => {
      const newInitialStates = config.initialStates
      delete newInitialStates[qubitIds[position]]
      return {
        ...config,
        qubits: Math.max(0, config.qubits - 1),
        initialStates: newInitialStates,
        interactions: config.interactions.filter(({qubitIds: qubits}) => !qubits.includes(qubitIds[position]))
      }
    });
  };

  const handleSelectQubit = (key: QubitPosition) => {
    if (isAddingInteraction && interactionSourceQubit) {
      setInteractionModalVisible(true)
      setInteractionTargetQubit(key)
    } else setQubitSelected((selected) => (selected === key ? undefined : key));
  };


  const handleAddInteraction = (id) => {
    setQubitSelected(undefined);
    setIsAddingInteraction(true);
    setInteractionSourceQubit(id);
  };
  const handleCancelAddInteraction = () => {
    setIsAddingInteraction(false);
    setInteractionSourceQubit(undefined);
    setInteractionModalVisible(false)
  };

  type handleFinishAddInteractionArgs = { operatorKey: PauliOperatorKey, operator: PauliOperator, scalar: number }
  const handleFinishAddInteraction = ({ operatorKey, operator, scalar }: handleFinishAddInteractionArgs) => {
    if (interactionSourceQubit && interactionTargetQubit) {
      const [qubit1, qubit2] = [qubitIds[interactionSourceQubit], qubitIds[interactionTargetQubit]]
      setInteractions(interactions => [...interactions, { qubits: [interactionSourceQubit, interactionTargetQubit], label: operatorKey }])
      let parameter = {
        value: scalar,
        label: `\\lambda_{${qubit1}${qubit2}}`,
        src: `lambda_${qubit1}${qubit2}`
      }
      const newInteraction = {
        qubitIds: [qubit1, qubit2],
        operator,
        parameter
      }
      setConfig(config => (
        {
          ...config,
          interactions: [...config.interactions, newInteraction]
        }
      ))
    }
    setIsAddingInteraction(false);
    setInteractionModalVisible(false);
    setInteractionSourceQubit(undefined);
  };

  const handleToggleLaser = (targetQubit: QubitPosition) => {
    const newLasers = lasers
    newLasers[targetQubit] = {
      ...newLasers[targetQubit],
      on: !newLasers[targetQubit].on,
      orientation: !newLasers[targetQubit].orientation ? 'Sx' : newLasers[targetQubit].orientation
    }
    setLasers(newLasers)
    setConfig(config => ({
      ...config,
      lasers: (Object.entries(newLasers) as Array<[QubitPosition, { on: boolean, orientation: PauliOperatorKey }]>)
        .filter(([key, laser]) => laser.on)
        .map(([key, laser]) => {
          return {
            qubitId: qubitIds[key],
            operator: PauliOperators[laser.orientation],
            parameter: { label: `\\lambda_${qubitIds[key]}`, src: `lambda_${qubitIds[key]}`, value: 1 }
          }
        })
    }))
  };

  const handleSelectOrientation = (orientation, targetQubit: QubitPosition) => {
    const newLasers = lasers
    newLasers[targetQubit] = {
      ...newLasers[targetQubit],
      orientation,
    }
    setLasers(newLasers)
    setConfig(config => ({
      ...config,
      lasers: (Object.entries(newLasers) as Array<[QubitPosition, { on: boolean, orientation: PauliOperatorKey }]>)
        .filter(([key, laser]) => laser.on)
        .map(([key, laser]) => {
          return {
            qubitId: qubitIds[key],
            operator: PauliOperators[laser.orientation],
            parameter: { label: `\\lambda_${qubitIds[key]}`, src: `lambda_${qubitIds[key]}`, value: 1 }
          }
        })
    }
    ))
  }

  const handleToggleBath = () => {
    setConfig(config => ({
      ...config,
      baths: config.baths.length ? [] : [{ label: '', parameter: { label: '\\gamma_p', src: '', value: 1 }, operator: PauliX }]
    }))
  };

  return (
    <>
      <Stage
        width={width}
        height={height}
        style={{ background: "#252525", position: "absolute" }}
      >
        <Layer>
          <Grid width={width} height={height} />
          {(Object.entries(config.baths)).map(([key, { }]) => <Bath position={center} key={key + 'b'} />)}

          {(Object.entries(lasers) as Array<[QubitPosition, { orientation, on }]>).map(([key, { orientation, on }]) => (
            activeQubits[key] && <Laser
              on={on}
              key={key + 'l'}
              onSelectOrientation={(val) => handleSelectOrientation(val, key)}
              at={qubitPositions[key]}
              orientation={orientation}
              onTogglePower={() => handleToggleLaser(key)}
              label={orientation}
            />
          ))}
          <Group x={-120} y={-60}>
            {interactions.map(({ qubits, label }) => (
              <Interaction
                qubit1Position={qubitPositions[qubits[0]]}
                qubit2Position={qubitPositions[qubits[1]]}
                label={label}
              />
            ))}
            {(Object.entries(activeQubits) as Array<[QubitPosition, boolean]>).map(
              ([key, active]) => (
                (
                  <>
                    <Qubit
                      key={key}
                      selected={qubitSelected === key}
                      active={active}
                      onActivate={() => handleAddQubit(key)}
                      onSelect={() => handleSelectQubit(key)}
                      disabled={isAddingInteraction && (interactionSourceQubit === key)}
                      {...qubitPositions[key]}
                    />
                    <QubitMenu
                      visible={qubitSelected === key}
                      onClose={() => handleSelectQubit(key as QubitPosition)}
                      onRemoveQubit={() => handleRemoveQubit(key)}
                      onToggleBath={() => handleToggleBath()}
                      onAddLaser={() => handleToggleLaser(key)}
                      onAddInteraction={numActiveQubits > 1 ? () => handleAddInteraction(key) : false}
                      {...qubitPositions[key]}
                    />
                  </>
                )
              ))}
          </Group>

        </Layer>
      </Stage>
      {isAddingInteraction && !interactionModalVisible && (
        <AddInteractionModal onCancel={handleCancelAddInteraction} />
      )}
      {isAddingInteraction && interactionModalVisible && (
        <InteractionModal onCancel={handleCancelAddInteraction} onSubmit={handleFinishAddInteraction} />
      )}
    </>
  );
}
