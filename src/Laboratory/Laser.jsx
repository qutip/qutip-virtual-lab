import {
  Circle,
  Group,
  Line,
  Rect,
  Text,
} from 'react-konva';

import ClickTarget from './ClickTarget';

export default function Laser({
  at,
  label,
  on,
  orientation,
  onTogglePower,
  onSelectOrientation,
}) {
  const width = 150;
  const height = 100;
  const { x, y } = at;
  const baseline = 100;
  const pathLength = baseline - y + height;
  const fillColors = {
    Sx: 'red',
    Sy: 'orange',
    Sz: 'hotpink'
  }
  
  return (
    <Group x={x - 120} y={baseline}>
      <Rect
        x={0}
        y={0}
        height={height}
        width={width}
        cornerRadius={[5, 5, 5, 5]}
        stroke={"black"}
        strokeWidth={2}
        fill={"black"}
      />
      <Group>
        {["Sx", "Sy", "Sz"].map((orientationOption, i) => (
          <Group y={25} x={width / 3 / 2} key={orientationOption}>
            <Rect
              x={(width / 3) * i - 5}
              fill={orientation === orientationOption ? fillColors[orientation] : "none"}
              stroke="white"
              strokeWidth={1}
              height={10}
              width={10}
            />
            <Text
              fill="white"
              text={orientationOption}
              x={(width / 3) * i - 5}
              y={15}
            />
            <ClickTarget
              x={(width / 3) * i - 5}
              fill={orientation === orientationOption ? fillColors[orientation] : "none"}
              onClick={() => onSelectOrientation(orientationOption)}
              height={10}
              width={10}
            />
          </Group>
        ))}
      </Group>
      <Group x={7} y={(2 * height) / 3}>
        <Rect
          x={0}
          y={0}
          height={height / 4}
          width={width - 14}
          cornerRadius={[5, 5, 5, 5]}
          stroke={"#202020"}
          fill="#202020"
        />
        <Group x={on ? 2 : (width - 14 - 2) / 2}>
          <Rect
            x={0}
            y={0}
            height={height / 4}
            width={(width - 14) / 2}
            cornerRadius={[5, 5, 5, 5]}
            stroke={on ? "red" : "lightgrey"}
            fill={on ? "orange" : "grey"}
          />
          <Text
            x={5}
            y={3}
            text={on ? "ON" : "OFF"}
            fill="black"
            fontFamily="monospace"
            fontSize={20}
          />
          <ClickTarget
            x={0}
            y={0}
            height={height / 4}
            width={(width -14) / 2}
            cornerRadius={[5, 5, 5, 5]}
            onClick={onTogglePower}
          />
        </Group>
      </Group>
      {on && (
        <>
          <Line
            x={width / 2}
            y={height}
            stroke="orange"
            strokeWidth={4}
            points={[0, 0, 0, -pathLength]}
            shadowColor="red"
            shadowBlur={20}
          />
          <Circle
            x={width / 2}
            y={width / 2 - pathLength}
            fill="white"
            radius={8}
          />
          <Group x={width / 2} y={width / 2 - pathLength}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Group key={"l" + i}>
                <Line
                  x={0}
                  y={0}
                  points={[6, 0, 15, 0]}
                  rotation={60 * i}
                  stroke="orange"
                  shadowColor="red"
                  shadowBlur={20}
                />
                <Line
                  x={0}
                  y={0}
                  points={[6, 0, 15, 0]}
                  rotation={30 * i}
                  stroke="orange"
                  shadowColor="red"
                  shadowBlur={20}
                />
              </Group>
            ))}
          </Group>
        </>
      )}
    </Group>
  );
}
