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

const panelWidth = 150;
const blockHeight = 150;

const Tools = {
  Interaction: Interaction,
  Laser: Laser,
  "Heat bath": HeatBath,
};

const Panel = ({ x, toolSelected, onSelectTool }) => {
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
  const selectedProps = { stroke: "orange" };
  return (
    <Group x={x} y={open ? 0 : -4 * blockHeight}>
      {Object.keys(Tools).map((key, i) => {
        const Tool = Tools[key];
        return (
          <Group x={0} y={i * blockHeight + 1}>
            <Rect
              key={"p" + i}
              width={panelWidth}
              height={blockHeight}
              stroke="black"
              strokeWidth={2}
              fill={"#252525"}
            />
            <Tool x={panelWidth / 2} y={blockHeight / 2} />
            <Text
              text={key}
              fontFamily="monospace"
              fontSize={16}
              fill="#efefef"
              y={blockHeight - 20}
            />
            <ClickTarget
              height={blockHeight}
              width={panelWidth}
              onClick={() => onSelectTool(key)}
              {...(toolSelected === key ? selectedProps : {})}
            />
          </Group>
        );
      })}
      <Hide open={open} onToggle={handleToggle} />
    </Group>
  );
};

export default Panel;

const Hide = ({ open, onToggle }) => {
  return (
    <>
      <Rect
        x={0}
        y={3 * blockHeight}
        fill="#252525"
        width={panelWidth}
        height={30}
        stroke="black"
      />
      <Text
        x={panelWidth / 2 - 22}
        y={3 * blockHeight + 7}
        text={open ? "HIDE" : "SHOW"}
        fontFamily="monospace"
        fontSize={16}
        fill="#efefef"
      />
      <ClickTarget
        x={0}
        y={3 * blockHeight}
        width={panelWidth}
        height={30}
        onClick={onToggle}
      />
    </>
  );
};
