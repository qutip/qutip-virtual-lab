import {
  Group,
  Line,
  Rect,
} from 'react-konva';

const HeatBath = ({ x, y, onDrag }) => {
    const width = 30;
    const waveArray = Array.from({ length: 10 }).flatMap((_, i) => [
      2 * i,
      2 * Math.sin(Math.PI * (i / 4)),
    ]);
    return (
      <>
        <Group x={-width / 2} y={-width / 2} draggable>
          <Group x={8}>
            <Line
              x={x}
              y={y}
              shadowBlur={30}
              shadowColor="red"
              stroke="white"
              strokeWidth={2}
              points={waveArray}
              rotation={90}
            />
            <Line
              x={x + 8}
              y={y}
              shadowBlur={30}
              shadowColor="red"
              stroke="white"
              strokeWidth={2}
              points={waveArray}
              rotation={90}
            />
            <Line
              x={x + 16}
              y={y}
              shadowBlur={30}
              shadowColor="red"
              stroke="white"
              strokeWidth={2}
              points={waveArray}
              rotation={90}
            />
          </Group>
          <Rect x={x} y={y + 20} height={15} width={30} fill={"black"} />
        </Group>
      </>
    );
  };

  export default HeatBath