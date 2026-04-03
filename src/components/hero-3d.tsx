"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export function Hero3D() {
    return (
        <div className="absolute inset-0 -z-10 w-full h-[150vh] pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 1.2] }}>
                <ambientLight intensity={0.5} />
                <ParticleSystem />
            </Canvas>
            {/* Heavy gradient to fade out the 3D element at the bottom into the dark void */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>
    );
}

function ParticleSystem() {
    const ref = useRef<THREE.Points>(null!);

    const [positions] = useState(() => {
        // Generate an elegant, sparse starfield/data-node effect inside a sphere
        const count = 2500;
        const array = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Random spherical distribution
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = Math.cbrt(Math.random()) * 2.5; // spread out to radius 2.5

            array[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
            array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
            array[i * 3 + 2] = r * Math.cos(phi); // z
        }
        return array;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            // Slow cinematic rotation
            ref.current.rotation.x -= delta * 0.02;
            ref.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#D4AF37"
                    size={0.004}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}
