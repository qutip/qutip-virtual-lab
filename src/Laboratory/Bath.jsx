import {
  Arrow,
  Ellipse,
  Group,
} from 'react-konva';

const HeatBath = ({ position }) => {
  const { x, y } = position;
  const width = 30;
  const waveArray = [
    ...Array.from({ length: 360 + 1 }).flatMap((_, i) => [
      (135 * i) / (360 + 1),
      20 * Math.sin(2 * 2 * Math.PI * (i / (360 + 1))),
    ]),
    ...Array.from({ length: 12 }).flatMap((_, i) => [
      135 + i,
      20 * Math.sin(2 * 2 * Math.PI),
    ]),
  ];
  return (
    <>
      <Group x={x} y={y}>
        <Group x={8}>
          {Array.from({ length: 3 }, (_, i) => (
            <Arrow
              x={x/2  + (20 * i)}
              y={y/2  - (20 * i)}
              shadowBlur={30}
              shadowColor="red"
              stroke="white"
              strokeWidth={2}
              points={waveArray}
              rotation={45}
              fill="white"
            />
          ))}
        </Group>
        <Ellipse
          x={0}
          y={0}
          radius={{ x: x, y: (7 * y) / 12 }}
          shadowBlur={30}
          shadowColor="red"
          fill="#ff00000a"
        />
      </Group>
    </>
  );
};

export default HeatBath;
