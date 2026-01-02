'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useProductStore, CAMERA_POSITIONS } from '@/lib/store';
import * as THREE from 'three';

function ProductMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { config } = useProductStore();

  useFrame((state) => {
    if (meshRef.current && !config.customCameraPosition) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[2, 1.5, 1]} />
      <meshStandardMaterial
        color={config.selectedColor.hex}
        roughness={config.selectedMaterial.roughness}
        metalness={config.selectedMaterial.metalness}
      />
    </mesh>
  );
}

function AccessoryMesh({ id }: { id: string }) {
  const { accessories } = useProductStore();
  const accessory = accessories.find((a) => a.id === id);

  if (!accessory) return null;

  return (
    <mesh position={accessory.position} scale={accessory.scale} castShadow>
      {id === 'handle' && <cylinderGeometry args={[0.1, 0.1, 1.2]} />}
      {id === 'stand' && <cylinderGeometry args={[1.2, 1.2, 0.3]} />}
      {id === 'lighting' && <boxGeometry args={[0.2, 0.2, 2]} />}
      {id === 'protector' && <boxGeometry args={[2.2, 1.7, 1.2]} />}
      <meshStandardMaterial
        color={id === 'lighting' ? '#ffffff' : '#888888'}
        roughness={0.5}
        metalness={0.8}
        emissive={id === 'lighting' ? '#ffffff' : '#000000'}
        emissiveIntensity={id === 'lighting' ? 0.5 : 0}
      />
    </mesh>
  );
}

function Accessories() {
  const { config } = useProductStore();

  return (
    <group>
      {config.selectedAccessories.map((id) => (
        <AccessoryMesh key={id} id={id} />
      ))}
    </group>
  );
}

function SceneLighting() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { config } = useProductStore();

  return (
    <>
      <ambientLight intensity={config.lighting.ambientIntensity} />
      <directionalLight
        ref={lightRef}
        position={config.lighting.directionalPosition}
        intensity={config.lighting.directionalIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
      <pointLight position={[5, -5, -5]} intensity={0.3} color="#4455ff" />
    </>
  );
}

function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { config, setTransitioning } = useProductStore();

  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      const targetPos = config.customCameraPosition
        ? CAMERA_POSITIONS[config.cameraAngle]
        : CAMERA_POSITIONS[config.cameraAngle];

      if (targetPos) {
        setTransitioning(true);
        
        const startPosition = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const endPosition = new THREE.Vector3(...targetPos.position);
        const endTarget = new THREE.Vector3(...targetPos.target);

        let startTime: number | null = null;
        const duration = 800;

        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          cameraRef.current?.position.lerpVectors(startPosition, endPosition, easeProgress);
          controlsRef.current?.target.lerpVectors(startTarget, endTarget, easeProgress);
          controlsRef.current?.update();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setTransitioning(false);
          }
        };

        requestAnimationFrame(animate);
      }
    }
  }, [config.cameraAngle, config.customCameraPosition, CAMERA_POSITIONS, setTransitioning]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[3, 2, 4]} fov={50} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function Viewer3D() {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <CameraController />
        <SceneLighting />
        <Environment preset="studio" />
        
        <group position={[0, 0, 0]}>
          <ProductMesh />
          <Accessories />
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
}
