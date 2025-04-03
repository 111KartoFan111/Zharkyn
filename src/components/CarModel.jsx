import React from "react";
import "./Hero.css";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas, useLoader } from "@react-three/fiber";
import "./Knight3d.css";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Knight = () => {
  const gltf = useLoader(GLTFLoader, "CarModel.glb");
  const knightRef = useRef();
  useFrame(() => {
    if (knightRef.current) {
      knightRef.current.rotation.y += 0.0;
    }
  });
  return (
    <primitive
      ref={knightRef}
      object={gltf.scene}
      scale={10}
      position={[6, -13.3,-1]}
    />
  );
};
const CarModel = () => {
  return (
    <section className="hero-section">
      <div className="hero-block">
        <Canvas camera={{ position: [100, 70, 100], fov: 20 }}>
          <ambientLight intensity={0.10} />
          <directionalLight position={[100, 100, 1]} intensity={40} />
          <Knight />

          <OrbitControls
            enableZoom={false}
            enableRotate={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </section>
  );
};

export default CarModel;
