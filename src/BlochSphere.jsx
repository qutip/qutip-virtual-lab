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
import { OrbitControls } from '@react-three/drei';
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

export default function ({ data = [[],[],[]], time }) {
  return (
    <div style={{ width, height }}>
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
          up: [0,0,1]
        }}
      >
        <Suspense fallback={null}>
          <BlochSphere data={data} time={time}/>
        </Suspense>
      </Canvas>
    </div>
  );
}

function BlochSphere({ data, time }) {
  const ref = useRef();
  const blochVectorRef = useRef();
  const vector = useMemo(() => {
    const [x,y,z] = data?.map(axis => axis.at(time)) ?? [0,0,0]
    return {x,y,z}
  })
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh position={[0, 0, 0]} ref={ref}>
        <BlochVector x={vector.x} y={vector.y} z={vector.z} ref={blochVectorRef} />
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
  ) : [];
});

const ThreeDimAxis = () => {
  const axisArrowArgs = [
    origin,
    1.2 * SPHERE_RADIUS,
    0x252525,
    0.1 * SPHERE_RADIUS,
    0.1 * SPHERE_RADIUS,
  ];
  return (
    <>
      <arrowHelper args={[xAxis, ...axisArrowArgs]} />
      <arrowHelper args={[yAxis, ...axisArrowArgs]} />
      <arrowHelper args={[zAxis, ...axisArrowArgs]} />
      <arrowHelper args={[negZAxis, ...axisArrowArgs]} />
      <AxisLabel label={"|0⟩"} position={zAxis.multiplyScalar(1.5)} />
      <AxisLabel label={"|1⟩"} position={negZAxis.multiplyScalar(1.5)} />
      <AxisLabel label={"x"} position={xAxis.multiplyScalar(1.5)} />
      <AxisLabel label={"y"} position={yAxis.multiplyScalar(1.5)} />
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
      <meshStandardMaterial attach="material" color={"black"} />
    </mesh>
  );
};
