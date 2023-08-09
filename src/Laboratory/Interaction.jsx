import {
  Circle,
  Group,
  Line,
  Text,
} from 'react-konva';

import { radius } from './Qubit';

const Interaction = ({
  qubit1Position,
  qubit2Position,
  label,
  onRemove,
  disabled,
  isRemoving,
}) => {
  const x1 = qubit1Position.x;
  const y1 = qubit1Position.y;
  const x2 = qubit2Position.x;
  const y2 = qubit2Position.y;
  const dot = (q1, q2) => q1.x * q2.x + q1.y * q2.y;
  const abs = (q) => Math.sqrt(Math.pow(q.x, 2) + Math.pow(q.y, 2));
  const diff = { x: x2 - x1, y: y2 - y1 };
  const rotation =
    (180 / Math.PI) *
    Math.acos(dot(diff, { x: 1, y: 0 }) / (abs(diff) * abs({ x: 1, y: 0 })));
  const dist = abs(diff);
  const lineMidpointPosition = { x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2 };
  const lineShift = {
    x: (y2 - y1) / abs(diff),
    y: (x1 - x2) / abs(diff),
  };
  const points = Array.from({ length: 200 }).flatMap((_, i) => {
    const nudge = label === 'Sy' ? 10 : label === 'Sz' ? -10 : 0;
    let coords = { 
      start: { 
        x: x1 + nudge * lineShift.x, 
        y: y1 + nudge * lineShift.y
      }, 
      end: { 
        x: x2 + nudge * lineShift.x,  
        y: y2 + nudge * lineShift.y
      } 
    };
    
    return [
      coords.start.x + (i / 200) * (coords.end.x - coords.start.x),
      coords.start.y + (i / 200) * (coords.end.y - coords.start.y),
    ];
  });
  const interactionStyles = {
    Sx: { stroke: "red", shadowColor: "red" },
    Sy: { stroke: "hotpink", shadowColor: "hotpink" },
    Sz: { stroke: "orange", shadowColor: "orange" },
  };
  return (
    <Group x={2 * radius} y={2 * radius}>
      <Line
        shadowBlur={10}
        strokeWidth={5}
        points={points}
        {...interactionStyles[label]}
        opacity={disabled ? 0.1 : 1}
      />
      {isRemoving && (
        <Group x={lineMidpointPosition.x} y={lineMidpointPosition.y}>
          <Circle
            stroke="black"
            strokeWidth={3}
            height={30}
            width={30}
            onClick={onRemove}
            onTap={onRemove}
            fill={"grey"}
          />
          <Text
            text={"×"}
            onClick={onRemove}
            onTap={onRemove}
            fill="white"
            fontSize={20}
            x={-6}
            y={-8}
            fontFamily="monospace"
          />
        </Group>
      )}
    </Group>
  );
};

export default Interaction;
