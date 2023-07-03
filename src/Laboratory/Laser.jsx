import {
  Circle,
  Group,
  Line,
  Rect,
} from 'react-konva';

const Laser = ({ x, y, onDrag }) => {
    const width = 30;
    return (
      <Group draggable>
        <Rect
          x={x - width}
          y={y - 7.5}
          height={15}
          width={width / 2}
          stroke={"black"}
          strokeWidth={2}
          fill={"black"}
        />
        <Line
          x={x - width / 2}
          y={y}
          stroke="orange"
          strokeWidth={2}
          points={[0, 0, width, 0]}
          shadowColor="red"
          shadowBlur={20}
        />
        <Circle x={x + width / 2} y={y} fill="white" radius={4} />
        <Group x={width / 2} y={0}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Group key={'l'+i}>
              <Line
                x={x}
                y={y}
                points={[6, 0, 10, 0]}
                rotation={60 * i}
                stroke="orange"
                shadowColor="red"
                shadowBlur={20}
              />
              <Line
                x={x}
                y={y}
                points={[6, 0, 10, 0]}
                rotation={30 * i}
                stroke="orange"
                shadowColor="red"
                shadowBlur={20}
              />
            </Group>
          ))}
        </Group>
      </Group>
    );
  };

  export default Laser