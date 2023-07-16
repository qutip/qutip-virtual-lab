import {
  Group,
  Line,
  Rect,
} from 'react-konva';

const BoundsMarkers = ({ width, height }) => {
  const l = 30;
  const padding = l / 2;
  const numTicks = 4;

  const Reticule = ({ x, y }) => (
    <>
      <Rect
        width={0}
        height={l}
        stroke="#aaaaaa33"
        strokeWidth={3}
        x={x}
        y={y - l / 2}
      />
      <Rect
        width={l}
        height={0}
        stroke="#aaaaaa33"
        strokeWidth={3}
        x={x - l / 2}
        y={y}
      />
    </>
  );

  return (
    <>
      {Array.from({ length: numTicks }).map((_, i) => {
        const spacing = (width - 2 * l - 4 * padding) / (numTicks - 1);
        const startOffset = l + 2 * padding;
        return (
          <Group key={'b'+i}>
            <Rect
              width={2}
              height={l / 4}
              fill="orange"
              stroke="orange"
              strokeWidth={1}
              x={startOffset + i * spacing}
              y={padding}
            />
            <Rect
              width={l / 4}
              height={2}
              fill="orange"
              stroke="orange"
              strokeWidth={1}
              y={startOffset + i * spacing}
              x={padding}
            />
            <Rect
              width={2}
              height={l / 4}
              fill="orange"
              stroke="orange"
              strokeWidth={1}
              x={startOffset + i * spacing}
              y={height - padding - l / 4}
            />
            <Rect
              width={l / 4}
              height={2}
              fill="orange"
              stroke="orange"
              strokeWidth={1}
              y={startOffset + i * spacing}
              x={width - padding - l / 4}
            />
          </Group>
        );
      })}
      {/* <Reticule x={padding} y={padding} />
        <Reticule x={padding} y={height - padding} />
        <Reticule x={width - padding} y={padding} />
        <Reticule x={width - padding} y={height - padding} /> */}
    </>
  );
};

const Grid = ({ numSpaces, minor = false, width, height }) => {
  const numLines = minor ? numSpaces : numSpaces - 1;
  const spacing = width / numSpaces;
  const dashProps = minor ? {} : { dash: [2, 10] };
  return (
    <>
      {Array.from({ length: numLines }).map((_, i) => {
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
    <Grid numSpaces={8} width={width} height={height}/>
    <Grid numSpaces={8} minor width={width} height={height}/>
    <BoundsMarkers width={width} height={height}/>
  </>
);
