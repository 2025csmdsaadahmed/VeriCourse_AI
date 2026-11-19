import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Human limb and body material presets with natural organic skin and fabric colors
const SKIN_TONES = ['#F5D0B5', '#E8B996', '#D49A73', '#9E6948', '#633B26'];
const SHIRT_COLORS = [
  '#2C4A2E', // Forest green
  '#B85D43', // Terracotta
  '#C67D26', // Amber gold
  '#4A5568', // Slate grey
  '#8A9A74', // Sage green
  '#EFEAE1', // Off-white cream
  '#31475E', // Muted navy
];
const PANT_COLORS = ['#1F2937', '#374151', '#4B5563', '#78716C', '#1E293B'];

interface PersonConfig {
  x: number;
  z: number;
  progress: number;
  speed: number;
  direction: 'left' | 'right';
  skinColor: string;
  shirtColor: string;
  pantColor: string;
  hairColor: string;
  scale: number;
}

// Single articulated human character with moving head, torso, swinging arms and stepping legs
const RealisticCharacter: React.FC<{ config: PersonConfig; scrollYProgress: number }> = ({
  config,
  scrollYProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const localState = useRef({ progress: config.progress });

  useFrame((state) => {
    // Progress calculation based on continuous time + subtle scroll factor
    const dt = 0.0035 * (config.speed / 0.015);
    localState.current.progress = (localState.current.progress + dt) % 1;
    const t = localState.current.progress;

    // PATH COMPUTATION:
    // Stage 1 (0.0 -> 0.35): Approaching university entrance from plaza (z: 18 -> 4, x: -1 to 1)
    // Stage 2 (0.35 -> 0.52): Walking through grand entrance atrium (z: 4 -> -1, x: 0)
    // Stage 3 (0.52 -> 1.0): Branching into Left (Expectations Not Met) or Right (Expectations Achieved)
    let currentX = 0;
    let currentZ = 0;
    let rotY = Math.PI; // default facing towards the building (-Z)

    if (t < 0.35) {
      const p = t / 0.35;
      currentZ = 16 - p * 12; // 16 down to 4
      currentX = config.x * (1 - p * 0.7);
      rotY = Math.PI + (config.x * 0.05);
    } else if (t < 0.52) {
      const p = (t - 0.35) / 0.17;
      currentZ = 4 - p * 5; // 4 down to -1
      currentX = 0;
      rotY = Math.PI;
    } else {
      // Diverge into left or right wings
      const p = (t - 0.52) / 0.48;
      if (config.direction === 'left') {
        // Diverge Left: Terracotta wing (Expectations Not Met)
        currentX = -p * 11;
        currentZ = -1 + (p * 4);
        rotY = Math.PI * 0.65; // facing towards left-forward
      } else {
        // Diverge Right: Sage/Forest wing (Expectations Achieved)
        currentX = p * 11;
        currentZ = -1 + (p * 4);
        rotY = -Math.PI * 0.65; // facing towards right-forward
      }
    }

    if (groupRef.current) {
      groupRef.current.position.set(currentX, 0, currentZ);
      groupRef.current.rotation.y = rotY;

      // Natural Human Walk Cycle Oscillation
      const walkCycle = state.clock.elapsedTime * 8 * (config.speed / 0.015);
      const legAngle = Math.sin(walkCycle) * 0.55;
      const armAngle = -legAngle * 0.6; // arms swing counter to opposite legs

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle;

      // Natural pelvic/torso bobbing up and down while stepping
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.95 + Math.abs(Math.sin(walkCycle)) * 0.04;
        torsoRef.current.rotation.y = Math.sin(walkCycle) * 0.08;
      }
    }
  });

  return (
    <group ref={groupRef} scale={[config.scale, config.scale, config.scale]}>
      {/* Torso, Head, and Arms Parent Group */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        {/* Torso / Jacket / Shirt */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.38, 0.48, 0.22]} />
          <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.1, 10]} />
          <meshStandardMaterial color={config.skinColor} roughness={0.6} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color={config.skinColor} roughness={0.6} />
        </mesh>

        {/* Hair / Cap */}
        <mesh position={[0, 0.77, -0.02]} castShadow>
          <sphereGeometry args={[0.135, 12, 12]} />
          <meshStandardMaterial color={config.hairColor} roughness={0.9} />
        </mesh>

        {/* Left Arm Group (Swings from shoulder) */}
        <group ref={leftArmRef} position={[-0.24, 0.42, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.42, 8]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color={config.skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* Right Arm Group (Swings from shoulder) */}
        <group ref={rightArmRef} position={[0.24, 0.42, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.42, 8]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color={config.skinColor} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Left Leg Group (Articulated at hip) */}
      <group ref={leftLegRef} position={[-0.11, 0.95, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.055, 0.85, 8]} />
          <meshStandardMaterial color={config.pantColor} roughness={0.8} />
        </mesh>
        {/* Foot / Shoe */}
        <mesh position={[0, -0.86, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.22]} />
          <meshStandardMaterial color="#2B2621" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg Group (Articulated at hip) */}
      <group ref={rightLegRef} position={[0.11, 0.95, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.055, 0.85, 8]} />
          <meshStandardMaterial color={config.pantColor} roughness={0.8} />
        </mesh>
        {/* Foot / Shoe */}
        <mesh position={[0, -0.86, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.22]} />
          <meshStandardMaterial color="#2B2621" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

export const CrowdSimulation: React.FC<{ scrollYProgress: number }> = ({ scrollYProgress }) => {
  // Generate a roster of diverse students with distinct appearances, walking speeds, and diverging outcomes
  const characters = useMemo<PersonConfig[]>(() => {
    const list: PersonConfig[] = [];
    const totalCount = 14;

    for (let i = 0; i < totalCount; i++) {
      // Skew distribution: only 1 in 4 (25%) reach expectations achieved (right side),
      // while 75% divert left towards expectations not met, reflecting unverified claims.
      const isLeft = (i % 4 !== 0);
      list.push({
        x: (Math.random() - 0.5) * 4.5,
        z: 0,
        progress: (i / totalCount) + Math.random() * 0.08,
        speed: 0.013 + Math.random() * 0.005,
        direction: isLeft ? 'left' : 'right',
        skinColor: SKIN_TONES[i % SKIN_TONES.length],
        shirtColor: SHIRT_COLORS[i % SHIRT_COLORS.length],
        pantColor: PANT_COLORS[i % PANT_COLORS.length],
        hairColor: i % 3 === 0 ? '#1C1917' : i % 3 === 1 ? '#4A3728' : '#8B5A2B',
        scale: 0.92 + Math.random() * 0.12,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {characters.map((cfg, index) => (
        <RealisticCharacter key={index} config={cfg} scrollYProgress={scrollYProgress} />
      ))}
    </group>
  );
};
