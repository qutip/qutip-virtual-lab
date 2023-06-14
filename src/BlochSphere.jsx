import React, { useRef } from 'react';

import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  Canvas,
  extend,
  useThree,
} from '@react-three/fiber';

export default function BlochSphere() {
  const ref = useRef();
  const vectorDir = new Vector3(2, 0, 0)
  const vectorOrigin = new Vector3(0,0,0)
  const vectorLength = 2
  return (
  <div style={{ width: 200, height: 200 }}>
    <Canvas>
      <Controls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh position={[1.2, 0, 0]} ref={ref}>
        <sphereGeometry args={[2, 32, 16]} />
        <arrowHelper args={[vectorDir, vectorOrigin, vectorLength, 0xffffff, 0.2*vectorLength, 0.2*vectorLength]}/>
        <meshLambertMaterial color={"blue"} transparent={true} opacity={0.5} />
      </mesh>
    </Canvas>
  </div>
  )
}

// TODO: add axes for orientation

extend({ OrbitControls });

const Controls = () => {
  const { camera, gl } = useThree();

  return (
    <orbitControls
      enableZoom={false}
      enablePan={false}
      args={[camera, gl.domElement]}
    />
  );
};
