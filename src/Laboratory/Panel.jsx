import { useState } from 'react';

import {
  Group,
  Rect,
  Text,
} from 'react-konva';

import ClickTarget from './ClickTarget';
import HeatBath from './HeatBath';
import Interaction from './Interaction';
import Laser from './Laser';
import Qubit from './Qubit';

const Panel = ({ x }) => {
    const panelWidth = 100;
    const blockHeight = 100;
    const [isDragging, setIsDragging] = useState(false);
    const [draggedId, setDraggedId] = useState(null);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [open, setOpen] = useState(true);
    const handleDrag = (e) => {
      setIsDragging(true);
      setDraggedId(e);
    };
    const handleToggle = () => {
      setOpen((state) => !state);
    };
    return (
      <Group x={x} y={open ? 0 : -4 * blockHeight}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Rect
            key={'p'+i}
            width={panelWidth}
            height={blockHeight}
            stroke="black"
            strokeWidth={2}
            fill={"#252525"}
            x={0}
            y={i * blockHeight + 1}
          />
        ))}
        <Rect
          x={0}
          y={4 * blockHeight}
          fill="#252525"
          width={panelWidth}
          height={30}
          stroke="black"
        />
        <Text
          x={panelWidth / 2 - 22}
          y={4 * blockHeight + 7}
          text={open ? "HIDE" : "SHOW"}
          fontFamily="monospace"
          fontSize={16}
          fill="#efefef"
        />
        <ClickTarget
          x={0}
          y={4 * blockHeight}
          width={panelWidth}
          height={30}
          onClick={handleToggle}
        />
        <Group x={panelWidth / 2} y={blockHeight / 2}>
          <Qubit x={0} y={0} onDrag={() => {}} />
          <Interaction x={0} y={blockHeight} onDrag={() => {}} />
          <Laser x={0} y={2 * blockHeight} onDrag={() => {}} />
          <HeatBath x={0} y={3 * blockHeight} onDrag={() => {}} />
        </Group>
      </Group>
    );
  };
  
  export default Panel