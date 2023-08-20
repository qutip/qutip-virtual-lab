import React, {
  forwardRef,
  Suspense,
  useMemo,
  useRef,
} from 'react';

import { Vector3 } from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import mathFont
  from '@compai/font-noto-sans-math/data/typefaces/normal-400.json';
import {
  CatmullRomLine,
  OrbitControls,
} from '@react-three/drei';
import {
  Canvas,
  extend,
  useThree,
} from '@react-three/fiber';

extend({ TextGeometry });

const width = 100;
const height = 120;
const origin = new Vector3(0, 0, 0);

const SPHERE_RADIUS = 1;
const xAxis = new Vector3(SPHERE_RADIUS, 0, 0);
const yAxis = new Vector3(0, SPHERE_RADIUS, 0);
const zAxis = new Vector3(0, 0, SPHERE_RADIUS);
const negZAxis = new Vector3(0, 0, -SPHERE_RADIUS);

export default function ({ data = [[], [], []], time }) {
  return (
    <div style={{ width, height, margin: 'auto' }}>
      <Canvas
        orthographic
        camera={{
          zoom: 35,
          position: [5, 5, 5],
          near: 1,
          far: 100,
          top: 5,
          bottom: -5,
          right: 5,
          left: -5,
          up: [0, 0, 1],
        }}
      >
        <Suspense fallback={null}>
          <BlochSphere data={data} time={time} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function BlochSphere({ data, time }) {
  const ref = useRef();
  const blochVectorRef = useRef();
  const vector = useMemo(() => {
    const [x, y, z] = data?.map((axis) => axis.at(time)) ?? [0, 0, 0];
    return { x, y, z };
  }, [data, time]);
  const vertices = useMemo(
    () =>
      {const arr = Array.from({ length: data?.[0].slice(0, time).length }, (_, i) => [
        data[0][i],
        data[1][i],
        data[2][i],
      ])
      return arr.length ? arr : []
    },
    [data, time]
  );

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {!!(vertices.length > 2) && <CatmullRomLine
        points={vertices}
        curveType="chordal"
        closed={false}
        color="orange"
        lineWidth={1}
        tension={0}
        segments={vertices.length-1}
      />}
      <mesh position={[0, 0, 0]} ref={ref}>
        <BlochVector
          x={vector.x}
          y={vector.y}
          z={vector.z}
          ref={blochVectorRef}
        />
        <sphereGeometry args={[SPHERE_RADIUS, 32, 16]} />
        <ThreeDimAxis />
        <meshLambertMaterial
          color={"#aaaaaa"}
          transparent={true}
          opacity={0.5}
        />
      </mesh>

      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
}

const BlochVector = forwardRef(({ x, y, z }, ref) => {
  const vector = new Vector3(x, y, z);
  return vector.length() ? (
    <arrowHelper
      ref={ref}
      args={[vector, origin, vector.length(), 0xff0000, 0.25, 0.25]}
    />
  ) : (
    []
  );
});

const ThreeDimAxis = () => {
  const axisArrowArgs = [
    origin,
    1.2 * SPHERE_RADIUS,
    0xefefef,
    0.1 * SPHERE_RADIUS,
    0.1 * SPHERE_RADIUS,
  ];
  const xAxisLabel = new Vector3(1.25*SPHERE_RADIUS, 0, 0);
  const yAxisLabel = new Vector3(0, 1.25*SPHERE_RADIUS, 0);
  const zAxisLabel = new Vector3(0, 0, 1.25*SPHERE_RADIUS);
  const negZAxisLabel = new Vector3(0, 0, -1.25*SPHERE_RADIUS);
  return (
    <>
      <arrowHelper args={[xAxis, ...axisArrowArgs]} />
      <arrowHelper args={[yAxis, ...axisArrowArgs]} />
      <arrowHelper args={[zAxis, ...axisArrowArgs]} />
      <arrowHelper args={[negZAxis, ...axisArrowArgs]} />
      <AxisLabel label={"|0⟩"} position={zAxisLabel} />
      <AxisLabel label={"|1⟩"} position={negZAxisLabel} />
      <AxisLabel label={"x"} position={xAxisLabel} />
      <AxisLabel label={"y"} position={yAxisLabel} />
    </>
  );
};

const AxisLabel = ({ label, position }) => {
  const axisRef = useRef();
  const { camera } = useThree();
  const mathRegular = new FontLoader().parse(mathFont);

  return (
    <mesh position={position} ref={axisRef} quaternion={camera.quaternion}>
      <textGeometry
        args={[label, { font: mathRegular, size: 0.3, height: 0.01 }]}
      />
      <meshStandardMaterial attach="material" color={"#efefef"} />
    </mesh>
  );
};
