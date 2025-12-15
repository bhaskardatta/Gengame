"use client";

import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import * as THREE from "three";

export default function Player() {
    const { camera, gl } = useThree();
    const isSitting = useGameStore((state) => state.isSitting);
    const gameStarted = useGameStore((state) => state.gameStarted);
    const setIsSitting = useGameStore((state) => state.setIsSitting);

    // Movement State
    const [move, setMove] = useState({ forward: false, backward: false, left: false, right: false });
    const [isEntering, setIsEntering] = useState(false);
    const hasEnteredRef = useRef(false);

    // Configuration
    const SPEED = 5.0;
    const SITTING_POS = new THREE.Vector3(0, 1.25, -2.2);
    const SITTING_LOOK = new THREE.Vector3(0, 1.25, -4);
    const ENTRY_START_POS = new THREE.Vector3(0, 1.7, 8); // Outside the room
    const ENTRY_END_POS = new THREE.Vector3(0, 1.7, 2); // Inside the room

    // Initialize Camera Position
    useEffect(() => {
        if (!gameStarted) {
            camera.position.copy(ENTRY_START_POS);
            camera.lookAt(0, 1.5, -5); // Look at the desk
        } else if (!hasEnteredRef.current) {
            setIsEntering(true);
        }
    }, [gameStarted, camera]);

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

    // Entry Animation
    useFrame((state, delta) => {
        if (isEntering) {
            const dist = camera.position.distanceTo(ENTRY_END_POS);
            if (dist > 0.1) {
                camera.position.lerp(ENTRY_END_POS, delta * 1.5);
            } else {
                setIsEntering(false);
                hasEnteredRef.current = true;
            }
            return; // Skip other movement updates
        }

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

            // --- Bounds Clamping (Room is roughly 15x15 centered at 0,0) ---
            // Walls are at +/- 7.5. We limit player to +/- 6.5 to avoid clipping.
            const BOUNDS = 6.5;
            camera.position.x = Math.max(-BOUNDS, Math.min(BOUNDS, camera.position.x));
            // Z bounds: Back wall is at -5, Front wall at +5.
            // Limit Z between -4 (desk/chair area) and 4 (entry area).
            camera.position.z = Math.max(-4, Math.min(4, camera.position.z));
        }
    });

    // Only render PointerLockControls when NOT sitting AND NOT entering logic
    return (
        <>
            {!isSitting && !isEntering && gameStarted && (
                <PointerLockControls
                    makeDefault
                />
            )}
        </>
    );

}
