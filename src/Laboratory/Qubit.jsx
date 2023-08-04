import { useState } from 'react';

import {
  Arrow,
  Circle,
  Group,
  Rect,
  Text,
} from 'react-konva';

import ClickTarget from './ClickTarget';

export const radius = 40;

const Qubit = ({ x, y, selected, active, onActivate, onSelect, disabled }) => {
  const selectedProps = {
    stroke: "orange",
    opacity: 0.5,
  };
  if (active)
    return (
      <>
        <Group x={x + 2 * radius} y={y + 2 * radius}>
          <Circle
            radius={radius + 3}
            stroke="orange"
            opacity={disabled ? 0.2 : 1}
            strokeWidth={3}
            fill={"#252525"}
          />
          <Arrow
            stroke={"#efefef"}
            points={[0, 2 * radius - 5, 0, -2 * radius - 5]}
            rotation={30}
            fill={"#efefef"}
            opacity={disabled ? 0.2 : 1}
          />
          <Circle
            radius={radius}
            stroke="#efefef"
            strokeWidth={1}
            opacity={disabled ? 0.2 : 1}
            fill={"transparent"}
          />
          <Circle
            radius={radius - 3}
            stroke="#efefef"
            strokeWidth={1}
            opacity={disabled ? 0.2 : 1}
            fill={"#efefef"}
          />
        </Group>
        {!disabled && (
          <ClickTarget
            onClick={onSelect}
            x={x}
            y={y}
            width={4 * radius}
            height={4 * radius}
            {...(selected ? selectedProps : {})}
          />
        )}
      </>
    );
  return <QubitPlaceholder x={x} y={y} onActivate={onActivate} />;
};

export default Qubit;

export const QubitPlaceholder = ({ x, y, onActivate }) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <Group>
        <Rect
          width={4 * radius}
          height={4 * radius}
          stroke={hover ? "white" : "orange"}
          opacity={hover ? 1 : 0.3}
          x={x}
          y={y}
          cornerRadius={15}
        />
        <Text
          text={"ADD QUBIT"}
          x={x + 10}
          y={y + 2 * radius}
          fill="white"
          fontSize={18}
          fontFamily="monospace"
        />
      </Group>
      <ClickTarget
        x={x}
        y={y}
        width={4 * radius}
        height={4 * radius}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onActivate}
      />
    </>
  );
};

export const QubitMenu = ({
  x,
  y,
  visible,
  onClose,
  onAddInteraction,
  onRemoveInteraction,
  onToggleBath,
  onAddLaser,
  onRemoveQubit,
}) => {
  const size = radius;
  const width = 150;
  const menuItems = [
    { label: "Toggle Laser", onClick: onAddLaser },
    ...(onAddInteraction
      ? [{ label: "Add Interaction", onClick: onAddInteraction }]
      : []),
    ...(onRemoveInteraction
      ? [{ label: "Remove Interaction", onClick: onRemoveInteraction }]
      : []),
    { label: "Toggle Bath", onClick: onToggleBath },
    { label: "Remove Qubit", onClick: onRemoveQubit },
  ];
  const textPadding = { y: size / 2 - 5, x: 5 };
  return (
    <>
      <Group visible={visible} x={x + 2 * radius} y={y + 2 * radius}>
        <Rect fill="black" width={width} height={size} stroke="black" />
        <Text text="×" x={7} fill="white" fontSize={40} />
        <ClickTarget
          stroke="white"
          onClick={onClose}
          width={size}
          height={size - 2}
        />
        {menuItems.map(({ label, onClick }, i) => (
          <Group y={(i + 1) * size}>
            <Rect fill="#252525" width={width} height={size} />
            <Text
              text={label}
              y={textPadding.y}
              x={textPadding.x}
              fill="white"
              fontFamily="monospace"
            />
            <ClickTarget
              stroke="black"
              width={width}
              height={size}
              onClick={onClick}
              cornerRadius={i == menuItems.length - 1 ? [0, 0, 10, 10] : 0}
            />
          </Group>
        ))}
      </Group>
    </>
  );
};
