import { useState } from 'react';

import {
  Arrow,
  Circle,
  Group,
  Rect,
  Text,
} from 'react-konva';

import ClickTarget from './ClickTarget';

const radius = 40;

const Qubit = ({
  x,
  y,
  selected,
  active,
  onActivate,
  onSelect,
  onDeactivate,
  onAddLaser,
  onAddInteraction,
  onAddHeatBath,
}) => {
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
            opacity={0.5}
            strokeWidth={3}
            fill={"#252525"}
          />
          <Arrow
            stroke={"#efefef"}
            points={[0, 2 * radius - 5, 0, -2 * radius - 5]}
            rotation={30}
            fill={"#efefef"}
          />
          <Circle
            radius={radius}
            stroke="#efefef"
            strokeWidth={1}
            fill={"transparent"}
          />
          <Circle
            radius={radius - 3}
            stroke="#efefef"
            strokeWidth={1}
            fill={"#efefef"}
          />
        </Group>
        <ClickTarget
          onClick={onSelect}
          x={x}
          y={y}
          width={4 * radius}
          height={4 * radius}
          {...(selected ? selectedProps : {})}
        />
        <QubitMenu
          x={x - 3 * radius - 5}
          y={y}
          visible={selected}
          onClose={onSelect}
          onRemoveQubit={onDeactivate}
          {...{onAddHeatBath, onAddInteraction, onAddLaser}}
        />
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
          x={x+10}
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

const QubitMenu = ({
  x,
  y,
  visible,
  onClose,
  onAddInteraction,
  onAddHeatBath,
  onAddLaser,
  onRemoveQubit,
}) => {
  const size = radius;
  const width = 120;
  const menuItems = [
    { label: "Add Laser", onClick: onAddLaser },
    { label: "Add Interaction", onClick: onAddInteraction },
    { label: "Add Heat Bath", onClick: onAddHeatBath },
    { label: "Remove Qubit", onClick: onRemoveQubit },
  ];
  const textPadding = { y: size / 2 - 5, x: 5 };
  return (
    <>
      <Group visible={visible} x={x} y={y - size}>
        <Rect fill="black" width={width} height={size} stroke="black" />
        <Text text="×" x={7} fill="white" fontSize={40} />
        <ClickTarget
          stroke="white"
          onClick={onClose}
          width={size}
          height={size-2}
        />
      </Group>
      <Group visible={visible} x={x} y={y}>
        {menuItems.map(({ label, onClick }, i) => (
          <Group y={i * size}>
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
              cornerRadius={i == menuItems.length-1 ? [0,0,10,10] : 0}
            />
          </Group>
        ))}
      </Group>
    </>
  );
};
