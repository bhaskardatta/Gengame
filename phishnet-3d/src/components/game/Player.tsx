"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import * as THREE from "three";

export default function Player() {
    const { camera } = useThree();
    const isSitting = useGameStore((state) => state.isSitting);

    // Transition targets
    const sittingPosition = new THREE.Vector3(0, 1.3, -1.8); // Pulled back from -2.2 to -1.8 to avoid clipping into chair/desk
    const sittingTarget = new THREE.Vector3(0, 1.0, -3.5); // Look slightly down at the screen center

    const standingPosition = new THREE.Vector3(0, 1.7, 0);

    // Smooth transition logic
    useFrame((state, delta) => {
        if (isSitting) {
            camera.position.lerp(sittingPosition, delta * 3);
            // Simple lookAt interpolation is tricky with controls, 
            // but for MVP we just let position lerp. 
            // ideally we lock rotation too.
            camera.lookAt(sittingTarget);
        }
        // If standing, controls handle it. 
    });

    // Reset camera when standing up
    useEffect(() => {
        if (!isSitting) {
            camera.position.copy(standingPosition);
        }
    }, [isSitting]);

    return (
        <>
            {!isSitting && <PointerLockControls makeDefault />}
        </>
    );
}
