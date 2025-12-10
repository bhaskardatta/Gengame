"use client";

import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import * as THREE from "three";

export default function Player() {
    const { camera, gl } = useThree();
    const isSitting = useGameStore((state) => state.isSitting);

    // Movement State
    const [move, setMove] = useState({ forward: false, backward: false, left: false, right: false });

    // Configuration
    const SPEED = 5.0;
    const SITTING_POS = new THREE.Vector3(0, 1.25, -2.2);
    const SITTING_LOOK = new THREE.Vector3(0, 1.25, -4);

    // Safety: Ensure we don't start with NaN or bad values
    const velocity = useRef(new THREE.Vector3());

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': setMove(m => ({ ...m, forward: true })); break;
                case 'KeyS': setMove(m => ({ ...m, backward: true })); break;
                case 'KeyA': setMove(m => ({ ...m, left: true })); break;
                case 'KeyD': setMove(m => ({ ...m, right: true })); break;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': setMove(m => ({ ...m, forward: false })); break;
                case 'KeyS': setMove(m => ({ ...m, backward: false })); break;
                case 'KeyA': setMove(m => ({ ...m, left: false })); break;
                case 'KeyD': setMove(m => ({ ...m, right: false })); break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Unlock pointer when sitting
    useEffect(() => {
        if (isSitting) {
            document.exitPointerLock();
        }
    }, [isSitting]);

    // Game Loop
    useFrame((state, delta) => {
        if (isSitting) {
            // Smoothly move camera to chair
            camera.position.lerp(SITTING_POS, delta * 2);
            camera.lookAt(SITTING_LOOK);
        } else {
            // WASD Movement
            const frontVector = new THREE.Vector3(0, 0, 0);
            const sideVector = new THREE.Vector3(0, 0, 0);
            const direction = new THREE.Vector3();

            frontVector.set(0, 0, Number(move.backward) - Number(move.forward));
            sideVector.set(Number(move.left) - Number(move.right), 0, 0);

            direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED * delta);

            const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
            direction.applyEuler(euler);

            camera.position.add(direction);
            camera.position.y = 1.7; // Fixed height
        }
    });

    // Only render PointerLockControls when NOT sitting
    // We add a selector so it only engages when clicked
    return (
        <>
            {!isSitting && (
                <PointerLockControls
                    makeDefault
                    selector="#canvas-container" // Prevents auto-lock on mount if desired, but default is usually good.
                // We rely on default behavior but ensure it unmounts when sitting
                />
            )}
        </>
    );
}
