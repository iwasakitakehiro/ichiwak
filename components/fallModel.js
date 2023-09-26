import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei"; // ここを追加

function Ball() {
  const x = Math.random() * 10 - 5; // -5 to 5
  const y = Math.random() * 10; // 0 to 10
  const z = Math.random() * 10 - 5; // -5 to 5
  const [ref] = useSphere(() => ({ mass: 1, position: [x, y, z] }));
  return (
    <mesh ref={ref}>
      <sphereGeometry attach="geometry" args={[0.5, 32, 32]} />
      <meshStandardMaterial attach="material" color="blue" />
    </mesh>
  );
}

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} position={[0, 0, 0]} receiveShadow>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial
        attach="material"
        color="green"
        transparent
        opacity={0}
      />
    </mesh>
  );
}

function Scene() {
  const balls = Array.from({ length: 100 }).map((_, i) => {
    const x = Math.random() * 10 - 5;
    return <Ball key={i} position={[x, 10 + i, 0]} />;
  });

  return (
    <Physics>
      <Ground />
      {balls}
      <ambientLight />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      {/* <OrbitControls />  */}
    </Physics>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [50, 10, 20] }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
