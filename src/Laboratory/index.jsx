import React, {
  useContext,
  useState,
} from 'react';

import {
  Group,
  Layer,
  Stage,
} from 'react-konva';

import { SimulationContext } from '../Simulation';
import Grid from './Grid';
import Qubit from './Qubit';

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
  BOTTOM_LEFT: { x: center.x - 90 , y: center.y + 100, active: false },
  BOTTOM_RIGHT: { x: center.x + 270, y: center.y + 100, active: false },
};

export default function Laboratory() {
  const { config, setConfig } = useContext(SimulationContext);
  const [qubitSelected, setQubitSelected] = useState();
  const [toolSelected, setToolSelected] = useState();
  const [interactions, setInteractions] = useState();
  const [lasers, setLasers] = useState();
  const [heatBaths, setHeatBaths] = useState();
  const [isAddingInteraction, setIsAddingInteraction] = useState();
  const [activeQubitPositions, setActiveQubitPositions] = useState(() => {
    return qubitPositions;
  });

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
    setActiveQubitPositions((positions) => ({
      ...positions,
      [position]: {
        ...positions[position],
        active: false
      }
    }))
  }

  const handleSelectQubit = (key) => {
    setQubitSelected(selected => selected === key ? null : key)
  };

  const getHamiltonian = () => {};

  return (
    <Stage
      width={width}
      height={height}
      style={{ background: "#252525", position: "absolute" }}
    >
      <Layer>
        <Grid width={width} height={height} />
        <Group x={-120} y={-60}>
          {Object.entries(activeQubitPositions).map(
            ([key, { active, ...position }], i) => (
              <Qubit
                key={"q" + i}
                selected={qubitSelected === key}
                active={active}
                onActivate={() => handleAddQubit(key)}
                onSelect={() => handleSelectQubit(key)}
                onDeactivate={() => handleRemoveQubit(key)}
                {...position}
              />
            )
          )}
        </Group>
      </Layer>
    </Stage>
  );
}

const dragProps = {
  onDragStart: null,
  onDragEnd: null,
  draggable: true,
};
