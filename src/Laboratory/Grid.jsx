import {
  Group,
  Line,
} from 'react-konva';

const Grid = ({ spacing, minor = false, width, height }) => {
  const numVerticalLines = width / spacing
  const numHorizontalLines = height / spacing
  const dashProps = minor ? {} : { dash: [2, 10] };
  return (
    <>
      {Array.from({ length: numVerticalLines }).map((_, i) => {
        const start = minor
          ? (i + 1) * spacing - spacing / 2
          : (i + 1) * spacing;
        return (
          <Group key={'g'+i}>
            <Line
              x={start}
              y={0}
              stroke={"#121212"}
              strokeWidth={1}
              points={[0, 0, 0, height]}
              {...dashProps}
            />
          </Group>
        );
      })}
      {Array.from({ length: numHorizontalLines }).map((_, i) => {
        const start = minor
          ? (i + 1) * spacing - spacing / 2
          : (i + 1) * spacing;
        return (
          <Group key={'g'+i}>
            <Line
              x={0}
              y={start}
              stroke={"#121212"}
              strokeWidth={1}
              points={[0, 0, width, 0]}
              {...dashProps}
            />
          </Group>
        );
      })}
    </>
  );
};

export default ({width, height}) => (
  <>
    <Grid numSpaces={8} spacing={40} width={width} height={height}/>
    <Grid numSpaces={8} minor spacing={40} width={width} height={height}/>
  </>
);
