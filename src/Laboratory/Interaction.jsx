import {
  Group,
  Line,
  Text,
} from 'react-konva';

import { radius } from './Qubit';

const Interaction = ({ qubit1Position, qubit2Position, label }) => {
  const x1 = qubit1Position.x;
  const y1 = qubit1Position.y;
  const x2 = qubit2Position.x;
  const y2 = qubit2Position.y;
  const dot = (q1, q2) => q1.x * q2.x + q1.y * q2.y;
  const abs = (q) => Math.sqrt(Math.pow(q.x, 2) + Math.pow(q.y, 2));
  const rotation = Math.acos(
    dot(qubit1Position, qubit2Position) /
      (abs(qubit1Position) * abs(qubit2Position))
  );
  const points = Array.from({ length: 200 }).flatMap((_, i) => [
    // i / 4,
    // 10 * Math.sin(Math.PI * (i / 200)) * Math.sin(Math.PI * (i / 15)),
    x1 + (i / 200) * (x2 - x1),
    y1 + (i / 200) * (y2 - y1),
  ]);
  const lineMidpointPosition = { x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2 };
  const lineNormal = {
    x1: -y1 / abs(qubit1Position),
    y1: x1 / abs(qubit1Position),
    x2: -y2 / abs(qubit2Position),
    y2: x2 / abs(qubit2Position),
  };
  const labelPosition = {x: lineMidpointPosition.x + 30*lineNormal.x1, y: lineMidpointPosition.y + 30*lineNormal.y1 }
  const interactionStyles = {
    Sx: { stroke: 'red', shadowColor: 'red'},
    Sy: { stroke: 'hotpink', shadowColor: 'hotpink'},
    Sz: { stroke: 'orange', shadowColor: 'orange'}
  }
  return (
    <Group x={2 * radius} y={2 * radius}>
      <Line
        stroke="white"
        pointerLength={5}
        pointerWidth={5}
        shadowBlur={10}
        {...interactionStyles[label]}
        strokeWidth={2}
        rotation={rotation}
        points={points}
      />
      <Text {...labelPosition} fill="white" fontSize={25} text={label} />
    </Group>
  );
};

export default Interaction;
