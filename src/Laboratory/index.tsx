import React, {
  useContext,
  useEffect,
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
  InitialZero,
  type PauliOperator,
  type PauliOperatorKey,
  PauliOperators,
  type QubitId,
} from '../simulationUtils';
import AddInteractionModal from './AddInteractionModal';
import Bath from './Bath';
import BathModal from './BathModal';
import Grid from './Grid';
import Interaction from './Interaction';
import InteractionModal from './InteractionModal';
import Laser from './Laser';
import Qubit, { QubitMenu } from './Qubit';
import RemoveBathModal from './RemoveBathModal';
import RemoveInteractionModal from './RemoveInteractionModal';
import useResize from './useResize';

enum QubitPosition {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT"
}

interface QubitCoords {
  x: number,
  y: number
}

type InvertResult<T extends Record<PropertyKey, PropertyKey>> = {
  [P in keyof T as T[P]]: P
}

const qubitIds: Record<QubitPosition, QubitId> = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_LEFT: 2,
  BOTTOM_RIGHT: 3
}

const qubitPositionsById: InvertResult<typeof qubitIds> = {
  0: QubitPosition.TOP_LEFT,
  1: QubitPosition.TOP_RIGHT,
  2: QubitPosition.BOTTOM_LEFT,
  3: QubitPosition.BOTTOM_RIGHT,
}

const initQubitState: Record<QubitPosition, boolean> = {
  TOP_LEFT: false,
  TOP_RIGHT: false,
  BOTTOM_LEFT: false,
  BOTTOM_RIGHT: false,
};

const initLasersState: Record<QubitPosition, { on: boolean, orientation: PauliOperatorKey | undefined }> =
{
  TOP_LEFT: { on: false, orientation: undefined },
  TOP_RIGHT: { on: false, orientation: undefined },
  BOTTOM_LEFT: { on: false, orientation: undefined },
  BOTTOM_RIGHT: { on: false, orientation: undefined },
}


export default function Laboratory() {
  const { width, height } = useResize()
  const center = { x: width / 2, y: height / 2 };
  const qubitPositions: Record<QubitPosition, QubitCoords> = {
    TOP_LEFT: { x: width / 5, y: height / 3 },
    TOP_RIGHT: { x: 3 * width / 5, y: height / 3 },
    BOTTOM_LEFT: { x: 2 * width / 5, y: 2 * height / 3 },
    BOTTOM_RIGHT: { x: 4 * width / 5, y: 2 * height / 3 },
  } as const

  const { config, setConfig, demoSelected } = useContext(SimulationContext);
  const [activeQubits, setActiveQubits] =
    useState(initQubitState);
  const [lasers, setLasers] = useState<Record<QubitPosition, { on: boolean, orientation: PauliOperatorKey | undefined }>>(initLasersState)
  const [qubitSelected, setQubitSelected] = useState<undefined | QubitPosition>();
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [isRemovingInteraction, setIsRemovingInteraction] = useState(false);
  const [interactionSourceQubit, setInteractionSourceQubit] = useState<undefined | QubitPosition>();
  const [interactionTargetQubit, setInteractionTargetQubit] = useState<undefined | QubitPosition>();
  const [interactionModalVisible, setInteractionModalVisible] = useState<boolean>(false);
  const [interactions, setInteractions] = useState<Array<{ qubits: QubitPosition[], label: PauliOperatorKey, id: string }>>([])
  const [isAddingBath, setIsAddingBath] = useState(false)
  const [bathModalVisible, setBathModalVisible] = useState(false)
  const [baths, setBaths] = useState<Array<'Sm' | 'Sp'>>([])
  const [isRemovingBath, setIsRemovingBath] = useState(false)

  const numActiveQubits = useMemo(() => {
    return Object.values(activeQubits).reduce(
      (acc, curr) => acc + Number(curr),
      0
    );
  }, [activeQubits]);

  const interactionsByQubit = useMemo(() => {
    return interactions.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.qubits[0]]: acc[curr.qubits[0]] ? [...acc[curr.qubits[0]], curr.id] : [curr.id],
        [curr.qubits[1]]: acc[curr.qubits[1]] ? [...acc[curr.qubits[1]], curr.id] : [curr.id]
      }
    }, {})
  }, [interactions])

  const disabledInteractionOptions: Array<PauliOperatorKey> = useMemo(() => {
    if (interactionSourceQubit && interactionTargetQubit) {
      return interactions.filter(interaction => interaction.qubits.includes(interactionSourceQubit) && interaction.qubits.includes(interactionTargetQubit))
        .map(interaction => interaction.label)
    }
    return []
  }, [interactions, interactionSourceQubit, interactionTargetQubit])

  const disabledBathOptions = useMemo(() => {
    const options: Array<'Sm' | 'Sp'> = ['Sm', 'Sp']
    return options.filter(op => !baths.includes(op))
  }, [baths])

  useEffect(() => {
    if (demoSelected) {
      setActiveQubits(() => {
        let newActiveQubits = { ...initQubitState }
        const keys = Object.keys(initQubitState)
        for (const qubit in config.qubits) {
          newActiveQubits[keys[qubit]] = true
        }
        return newActiveQubits
      })
      setLasers(() => {
        const newLasers = { ...initLasersState }
        const lasersOn = config.lasers.map(l => ({ position: qubitPositionsById[l.qubitId], orientation: l.operator.key }))
        for (const { position, orientation } of lasersOn) {
          newLasers[position] = { on: true, orientation }
        }
        return newLasers
      })
      setInteractions(() => {
        return config.interactions.map(({ qubitIds, operator, parameter, id }) => (
          {
            qubits: qubitIds.map(qid => qubitPositionsById[qid]),
            label: operator.key,
            id
          }
        ))
      })
      setBaths(() => {
        return config.baths.map(({ operator }) => operator.key)
      })
    }
  }, [demoSelected])

  const handleAddQubit = (position) => {
    setActiveQubits((positions) => ({
      ...positions,
      [position]: true
    }));
    setQubitSelected(undefined)

    let newConfigQubits = [...new Set([...config.qubits, qubitIds[position]])]
    setConfig((config) => ({
      ...config,
      qubits: newConfigQubits,
      initialStates: {
        ...config.initialStates,
        [qubitIds[position]]: InitialZero
      }
    }));
  };

  const handleRemoveQubit = (position) => {
    setQubitSelected(undefined)
    setActiveQubits((positions) => ({
      ...positions,
      [position]: false
    }));
    setInteractions(interactions => interactions.filter(({ qubits }) => !qubits.includes(position)))
    setLasers(lasers => ({...lasers, [position]: {on: false, orientation: undefined}}))
    setConfig((config) => {
      const newInitialStates = config.initialStates
      delete newInitialStates[qubitIds[position]]
      return {
        ...config,
        qubits: config.qubits.filter(qubitId => qubitId !== qubitIds[position]),
        lasers: config.lasers.filter(({qubitId}) => qubitId !== qubitIds[position]),
        initialStates: newInitialStates,
        interactions: config.interactions.filter(({ qubitIds: qubits }) => !qubits.includes(qubitIds[position]))
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
      const [qubit1, qubit2] = [qubitIds[interactionSourceQubit], qubitIds[interactionTargetQubit]].sort((a, b) => a - b)
      const id = `${interactionSourceQubit}${interactionTargetQubit}-${operatorKey}`
      setInteractions(interactions => [
        ...interactions,
        {
          qubits: [interactionSourceQubit, interactionTargetQubit].sort((q1, q2) => qubitIds[q1] - qubitIds[q2]),
          label: operatorKey,
          id: id,
        }
      ])
      let parameter = {
        value: scalar,
        label: `\\lambda^{(${qubit1}${qubit2})}_${operator.label.slice(-1)}`,
        src: `lambda_${qubit1}${qubit2}_${operator.label.slice(-1)}`
      }
      const newInteraction = {
        qubitIds: [qubit1, qubit2],
        operator,
        parameter,
        id
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

  const handleRemoveInteraction = (qubitId) => {
    setQubitSelected(undefined);
    setIsRemovingInteraction(true)
    setInteractionSourceQubit(qubitId)
  }

  const handleCancelRemoveInteraction = () => {
    setIsRemovingInteraction(false);
    setInteractionSourceQubit(undefined);
  }

  const handleFinishRemoveInteraction = (interactionId) => {
    setIsRemovingInteraction(false)
    setInteractionSourceQubit(undefined)
    setInteractions(interactions => interactions.filter(interaction => interaction.id !== interactionId))
    setConfig(config => ({
      ...config,
      interactions: config.interactions.filter(interaction => interaction.id !== interactionId)
    }))
  }

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
            parameter: {
              label: `\\lambda^{(${qubitIds[key]})}`,
              src: `lambda_${qubitIds[key]}`,
              value: 1
            }
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

  const handleAddBath = () => {
    setIsAddingBath(true)
    setBathModalVisible(true)
  }

  const handleCancelAddBath = () => {
    setIsAddingBath(false)
    setBathModalVisible(false)
    setQubitSelected(undefined)
  }

  const handleFinishAddBath = ({ operatorKey, operator, scalar }) => {
    setIsAddingBath(false)
    setBaths(baths => [...baths, operatorKey])
    setConfig(config => ({
      ...config,
      baths: [...config.baths, {
        label: `bath-${config.baths.length}`,
        operator,
        parameter: {
          label: operatorKey === 'Sm' ? '\\gamma^{(n)}_-' : '\\gamma^{(n)}_+',
          src: `gamma_${operatorKey}`,
          value: scalar
        }
      }]
    }))
    setQubitSelected(undefined)
  }

  const handleRemoveBath = () => {
    setIsRemovingBath(true)
  }

  const handleFinishRemoveBath = ({ operatorKey }) => {
    setQubitSelected(undefined)
    setBaths(baths => baths.filter(bath => (bath !== operatorKey)))
    setConfig(config => ({
      ...config,
      baths: config.baths.filter(bath => (bath.operator.key !== operatorKey))
    }))
    setIsRemovingBath(false)
  };

  const handleCancelRemoveBath = () => {
    setIsRemovingBath(false)
  }

  return (
    <>
      <Stage
        width={width}
        height={height}
        style={{ background: "#252525", position: "absolute" }}
      >
        <Layer>
          <Grid width={width} height={height} />
        </Layer>
        <Layer>
          {baths.map((operatorKey) => <Bath operatorKey={operatorKey} position={center} key={operatorKey + 'b'} />)}
          {(Object.entries(lasers) as Array<[QubitPosition, { orientation, on }]>).map(([key, { orientation, on }]) => (
            activeQubits[key] && <Laser
              on={on}
              key={key + 'l'}
              onSelectOrientation={(val) => handleSelectOrientation(val, key)}
              at={qubitPositions[key]}
              orientation={orientation}
              onTogglePower={() => handleToggleLaser(key)}
              label={orientation}
              position={key.includes('TOP') ? 'bottom' : 'top'}
            />
          ))}
          <Group>
            {interactions.map(({ qubits, label, id }) => (
              <Interaction
                key={id}
                qubit1Position={qubitPositions[qubits[0]]}
                qubit2Position={qubitPositions[qubits[1]]}
                label={label}
                disabled={interactionSourceQubit ? !qubits.includes(interactionSourceQubit) : false}
                onRemove={isRemovingInteraction ? () => handleFinishRemoveInteraction(id) : false}
                isRemoving={isRemovingInteraction && interactionSourceQubit && qubits.includes(interactionSourceQubit)}
              />
            ))}
            {(Object.entries(activeQubits) as Array<[QubitPosition, boolean]>).map(
              ([key, active]) => (
                (
                  <>
                    <Qubit
                      key={key}
                      id={qubitIds[key]}
                      selected={qubitSelected === key}
                      active={active}
                      onActivate={() => handleAddQubit(key)}
                      onSelect={() => handleSelectQubit(key)}
                      disabled={(isAddingInteraction && (interactionSourceQubit === key)) || isRemovingInteraction}
                      {...qubitPositions[key]}
                    />
                  </>
                )
              ))}
          </Group>
        </Layer>
        <Layer>
          <Group>
            {(Object.entries(activeQubits) as Array<[QubitPosition, boolean]>).map(
              ([key, active]) => (
                <QubitMenu
                  key={key + 'menu'}
                  direction={key.includes('BOTTOM') ? 'up' : 'down'}
                  visible={qubitSelected === key}
                  onClose={() => setQubitSelected(undefined)}
                  onRemoveQubit={() => handleRemoveQubit(key)}
                  onAddBath={() => handleAddBath()}
                  onRemoveBath={baths.length ? () => handleRemoveBath() : undefined}
                  onAddLaser={() => handleToggleLaser(key)}
                  onAddInteraction={numActiveQubits > 1 ? () => handleAddInteraction(key) : false}
                  onRemoveInteraction={interactionsByQubit[key]?.length ? () => handleRemoveInteraction(key) : false}
                  {...qubitPositions[key]}
                />
              ))}
          </Group>
        </Layer>
      </Stage>
      {isAddingInteraction && !interactionModalVisible && (
        <AddInteractionModal onCancel={handleCancelAddInteraction} />
      )}
      {isAddingInteraction && interactionModalVisible && (
        <InteractionModal disabledOptions={disabledInteractionOptions} onCancel={handleCancelAddInteraction} onSubmit={handleFinishAddInteraction} />
      )}
      {isRemovingInteraction && (
        <RemoveInteractionModal onCancel={handleCancelRemoveInteraction} />
      )}
      {isAddingBath && bathModalVisible && (
        <BathModal disabledOptions={baths} onCancel={handleCancelAddBath} onSubmit={handleFinishAddBath} />
      )}
      {isRemovingBath && (
        <RemoveBathModal disabledOptions={disabledBathOptions} onCancel={handleCancelRemoveBath} onSubmit={handleFinishRemoveBath} />
      )}
    </>
  );
}
