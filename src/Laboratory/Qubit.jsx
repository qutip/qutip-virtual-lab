import { useState } from 'react';

import {
  Arrow,
  Circle,
  Group,
  Rect,
  Text,
} from 'react-konva';

import ClickTarget from './ClickTarget';

export const qubitRadius = 30;

const Qubit = ({ x, y, selected, active, onActivate, onSelect, disabled, id }) => {
  const selectedProps = {
    stroke: "orange",
    opacity: 0.5,
  };
  if (active)
    return (
      <Group x={x} y={y}>
        <Circle
          radius={qubitRadius + 3}
          stroke="orange"
          opacity={disabled ? 0.2 : 1}
          strokeWidth={3}
          fill={"#252525"}
        />
        <Arrow
          stroke={"#efefef"}
          points={[0, 2 * qubitRadius - 5, 0, -2 * qubitRadius - 5]}
          rotation={30}
          fill={"#efefef"}
          opacity={disabled ? 0.2 : 1}
        />
        <Circle
          radius={qubitRadius}
          stroke="#efefef"
          strokeWidth={1}
          opacity={disabled ? 0.2 : 1}
          fill={"transparent"}
        />
        <Circle
          radius={qubitRadius - 3}
          stroke="#efefef"
          strokeWidth={1}
          opacity={disabled ? 0.2 : 1}
          fill={"#efefef"}
        />
        {!disabled && (
          <ClickTarget
            onClick={onSelect}
            x={- 2 * qubitRadius}
            y={- 2 * qubitRadius}
            width={4 * qubitRadius}
            height={4 * qubitRadius}
            {...(selected ? selectedProps : {})}
          />
        )}
      </Group>
    );
  return <QubitPlaceholder x={x} y={y} onActivate={onActivate} id={id} />;
};

export default Qubit;

export const QubitPlaceholder = ({ x, y, onActivate, id }) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <Group x={x-2*qubitRadius} y={y-2*qubitRadius}>
        <Rect
          width={4 * qubitRadius}
          height={4 * qubitRadius}
          stroke={hover ? "white" : "orange"}
          opacity={hover ? 1 : 0.3}
          cornerRadius={15}
        />
        <Text
          text={`ADD QUBIT ${id}`}
          x={10}
          y={2 * qubitRadius}
          fill="white"
          fontSize={14}
          fontFamily="monospace"
        />
      <ClickTarget
        width={4 * qubitRadius}
        height={4 * qubitRadius}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onActivate}
        />
      </Group>
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
  onAddBath,
  onRemoveBath,
  onAddLaser,
  onRemoveQubit,
  direction
}) => {
  const size = 40;
  const width = 150;
  const menuItems = [
    { label: "Toggle Laser", onClick: onAddLaser },
    ...(onAddInteraction
      ? [{ label: "Add Interaction", onClick: onAddInteraction }]
      : []),
    ...(onRemoveInteraction
      ? [{ label: "Remove Interaction", onClick: onRemoveInteraction }]
      : []),
    { label: "Add Bath", onClick: onAddBath },
    ...(onRemoveBath
      ? [{ label: "Remove Bath", onClick: onRemoveBath }]
      : []),
    { label: "Remove Qubit", onClick: onRemoveQubit },
  ];
  const textPadding = { y: size / 2 - 5, x: 5 };
  return (
    <>
      <Group visible={visible} x={x} y={direction === 'up' ? y-size : y}>
        <Rect fill="black" width={width} height={size} stroke="black" />
        <Text text="×" x={7} fill="white" fontSize={40} y={0} />
        <ClickTarget
          stroke="white"
          onClick={onClose}
          width={size}
          height={size - 2}
        />
        {menuItems.map(({ label, onClick }, i) => (
          <Group y={direction =='up' ? -(i + 1) * size : (i + 1) * size} key={`menuitem-${i}-${x}-${y}`}>
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
              cornerRadius={i == menuItems.length - 1 ? direction === 'up' ? [10,10,0,0] : [0, 0, 10, 10] : 0}
            />
          </Group>
        ))}
      </Group>
    </>
  );
};
