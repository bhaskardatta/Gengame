import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Text, Float, PerspectiveCamera, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { GameInterface } from './GameInterface';
import { DigitalGuardian } from './DigitalGuardian';
import { Scenario, UserStats, GameState } from '../types';

interface Scene3DProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  stats: UserStats;
  currentScenario: Scenario | null;
  isLoading: boolean;
  lastResult: {correct: boolean, diff: number} | null;
  onDecision: (isPhishing: boolean) => void;
  onNext: () => void;
  onAbort: () => void;
}

const HologramPanel = ({ children, position, rotation }: any) => {
    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
                <mesh>
                    <planeGeometry args={[3.5, 4.5]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.05} side={THREE.DoubleSide} />
                </mesh>
                {/* Border Glow */}
                <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(3.5, 4.5)]} />
                    <lineBasicMaterial color="#00f0ff" transparent opacity={0.4} />
                </lineSegments>
                <Html transform scale={0.2} position={[0, 0, 0.05]} style={{ width: '1000px', height: '1200px' }}>
                    <div className="w-full h-full p-4 pointer-events-none">
                         {children}
                    </div>
                </Html>
            </Float>
        </group>
    )
}

const Monitor = ({ gameState, children }: any) => {
    // Screen Glow
    const screenColor = gameState === GameState.EVALUATION ? '#222' : '#050505';

    return (
        <group position={[0, 1.3, -1.5]}>
             {/* Monitor Stand */}
            <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[0.3, 1.2, 0.2]} />
                <meshStandardMaterial color="#111" roughness={0.5} metalness={0.8} />
            </mesh>
             <mesh position={[0, -1.2, 0.2]}>
                <boxGeometry args={[0.8, 0.1, 0.6]} />
                <meshStandardMaterial color="#111" roughness={0.5} metalness={0.8} />
            </mesh>

            {/* Monitor Bezel */}
            <mesh>
                <boxGeometry args={[4.2, 2.5, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </mesh>
            
            {/* The Screen Surface */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[4, 2.3]} />
                <meshBasicMaterial color={screenColor} toneMapped={false} />
            </mesh>

            {/* Interactive HTML Content */}
            <Html 
                transform 
                occlude="blending" 
                position={[0, 0, 0.07]} 
                scale={0.25}
                style={{ 
                    width: '1600px', 
                    height: '920px', 
                    backgroundColor: 'rgba(0,0,0,0.95)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            >
                {children}
            </Html>
        </group>
    );
};

const Desk = () => {
    return (
        <group position={[0, -0.5, -1]}>
             {/* Desk Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[8, 4]} />
                <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Grid Pattern on Desk */}
             <Grid position={[0, 0.01, 0]} args={[8, 4]} cellSize={0.2} cellThickness={0.5} sectionSize={1} sectionThickness={1} fadeDistance={5} sectionColor="#bc13fe" cellColor="#333" />
        </group>
    )
}

export const Scene3D: React.FC<Scene3DProps> = (props) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 2, 4));
  const [targetLook, setTargetLook] = useState(new THREE.Vector3(0, 0, -2));

  // Camera Animation Logic
  useEffect(() => {
    if (props.gameState === GameState.MENU) {
        setTargetPos(new THREE.Vector3(0, 2, 4));
        setTargetLook(new THREE.Vector3(0, 0, -5));
    } else {
        // Zoom into screen
        setTargetPos(new THREE.Vector3(0, 1.3, 0.8));
        setTargetLook(new THREE.Vector3(0, 1.3, -2));
    }
  }, [props.gameState]);

  useFrame((state) => {
    if (cameraRef.current) {
        // Smooth Lerp Camera
        cameraRef.current.position.lerp(targetPos, 0.05);
        
        // Manual LookAt Lerp
        const currentLook = new THREE.Vector3();
        cameraRef.current.getWorldDirection(currentLook);
        const desiredLook = new THREE.Vector3().subVectors(targetLook, cameraRef.current.position).normalize();
        
        // Simple approximation for looking direction
        const nextLook = currentLook.lerp(desiredLook, 0.05);
        cameraRef.current.lookAt(cameraRef.current.position.clone().add(nextLook));
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef as any} fov={60} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#4433aa" />
      <pointLight position={[2, 3, 2]} intensity={20} color="#00f0ff" distance={10} decay={2} />
      <pointLight position={[-2, 2, 2]} intensity={20} color="#bc13fe" distance={10} decay={2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Environment */}
      <Desk />
      
      {/* Main Terminal */}
      <Monitor gameState={props.gameState}>
        <GameInterface {...props} />
      </Monitor>

      {/* Holographic Guardian (Only visible when playing) */}
      {(props.gameState === GameState.PLAYING || props.gameState === GameState.EVALUATION) && props.currentScenario && (
        <HologramPanel position={[-2.8, 1.3, -1]} rotation={[0, 0.3, 0]}>
             <div className="h-full w-full flex flex-col pointer-events-auto">
                <DigitalGuardian scenario={props.currentScenario} />
             </div>
        </HologramPanel>
      )}

      {/* Floating Particles/Decor */}
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[3, 2, -3]}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color="#bc13fe" wireframe />
        </mesh>
      </Float>

    </>
  );
};