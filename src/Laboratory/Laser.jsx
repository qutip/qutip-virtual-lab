import {
  Circle,
  Group,
  Line,
  Rect,
  Text,
} from 'react-konva';

import ClickTarget from './ClickTarget';
import { qubitRadius } from './Qubit';
import useResize from './useResize';

export default function Laser({
  at,
  label,
  on,
  orientation,
  onTogglePower,
  onSelectOrientation,
  position
}) {
  const { height: stageHeight } = useResize()
  const width = 120;
  const height = 90;
  const { x, y } = at;
  const baseline = position === 'top' ? 20 : stageHeight - 40 - height -20;
  const pathLength =  baseline - y + (position === 'top' ? height + qubitRadius : -qubitRadius);
  const fillColors = {
    Sx: "red",
    Sy: "orange",
    Sz: "hotpink",
  };

  return (
    <Group x={x - width / 2} y={baseline}>
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
      <Group y={10} x={width / 3 / 2}>
        {["Sx", "Sy", "Sz"].map((orientationOption, i) => (
          <Group key={orientationOption}>
            <Rect
              x={(i * width / 3)-20/2}
              fill={
                orientation === orientationOption
                  ? fillColors[orientation]
                  : "none"
              }
              stroke="white"
              strokeWidth={1}
              height={20}
              width={20}
            />
            <Text
              fill="white"
              text={orientationOption.at(-1).toUpperCase()}
              x={(i * width / 3) - 5}
              y={25}
            />
            <ClickTarget
              x={(i * width / 3)-20/2}
              fill={
                orientation === orientationOption
                  ? fillColors[orientation]
                  : "none"
              }
              onClick={() => onSelectOrientation(orientationOption)}
              height={20}
              width={20}
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
            width={(width - 14) / 2}
            cornerRadius={[5, 5, 5, 5]}
            onClick={onTogglePower}
          />
        </Group>
      </Group>
      {on && (
        <Group y={position === 'top' ? height : 0}>
          <Line
            x={width / 2}
            y={0}
            stroke="orange"
            strokeWidth={4}
            points={[0, 0, 0, -pathLength]}
            shadowColor="red"
            shadowBlur={20}
          />
          <Circle x={width / 2} y={-pathLength} fill="white" radius={8} />
          <Group x={width / 2} y={-pathLength}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Group key={"l" + i}>
                <Line
                  points={[6, 0, 15, 0]}
                  rotation={60 * i}
                  stroke="orange"
                  shadowColor="red"
                  shadowBlur={20}
                />
                <Line
                  points={[6, 0, 15, 0]}
                  rotation={30 * i}
                  stroke="orange"
                  shadowColor="red"
                  shadowBlur={20}
                />
              </Group>
            ))}
          </Group>
        </Group>
      )}
    </Group>
  );
}
