import {
  Group,
  Line,
} from 'react-konva';

const Interaction = ({ x, y, onDrag }) => {
    return (
      <Group draggable>
        <Line
          x={x - 30}
          y={y}
          stroke="white"
          pointerLength={5}
          pointerWidth={5}
          shadowBlur={10}
          shadowColor="red"
          strokeWidth={2}
          points={Array.from({ length: 200 }).flatMap((_, i) => [
            i / 4,
            10 * Math.sin(Math.PI * (i / 200)) * Math.sin(Math.PI * (i / 15)),
          ])}
        />
      </Group>
    );
  };

  export default Interaction