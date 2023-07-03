import {
  Arrow,
  Circle,
  Group,
} from 'react-konva';

const Qubit = ({ x, y, onDrag }) => {
    const radius = 15;
    return (
      <Group draggable>
        <Circle
          radius={radius + 3}
          stroke="orange"
          strokeWidth={3}
          x={x}
          y={y}
          fill={"#252525"}
          {...{ shadowBlur: 10, shadowColor: "red" }}
        />
        <Arrow
          x={x}
          y={y}
          stroke={"#efefef"}
          points={[0, 25, 0, -35]}
          rotation={30}
          fill={"#efefef"}
        />
        <Circle
          radius={radius}
          stroke="#efefef"
          strokeWidth={1}
          x={x}
          y={y}
          fill={"transparent"}
        />
        <Circle
          radius={radius - 3}
          stroke="#efefef"
          strokeWidth={1}
          x={x}
          y={y}
          fill={"#efefef"}
        />
      </Group>
    );
  };

  export default Qubit