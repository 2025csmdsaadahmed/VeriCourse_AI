import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural animated students moving towards dual pathways
const AnimatedStudents = () => {
  const studentsCount = 28;
  const leftStudentsRef = useRef<THREE.InstancedMesh>(null);
  const rightStudentsRef = useRef<THREE.InstancedMesh>(null);

  // Initial student positions & velocities
  const [leftData, rightData] = useMemo(() => {
    const l = [];
    const r = [];
    for (let i = 0; i < studentsCount / 2; i++) {
      l.push({
        x: 0,
        z: -2 + Math.random() * 4,
        speed: 0.015 + Math.random() * 0.015,
        targetAngle: -0.85, // Heading left towards 'Expectations Not Met'
        progress: Math.random(),
        yBob: Math.random() * Math.PI
      });
      r.push({
        x: 0,
        z: -2 + Math.random() * 4,
        speed: 0.015 + Math.random() * 0.015,
        targetAngle: 0.85, // Heading right towards 'Expectations Achieved'
        progress: Math.random(),
        yBob: Math.random() * Math.PI
      });
    }
    return [l, r];
  }, [studentsCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    // Animate Left Students (Expectations Not Met)
    if (leftStudentsRef.current) {
      leftData.forEach((st, i) => {
        st.progress += st.speed;
        if (st.progress > 1) st.progress = 0;

        // Path: enters building at (0,0, -4), walks forward to (0,0, 0), then diverges left to (-6, 0, 6)
        const t = st.progress;
        let x = 0;
        let z = -4 + t * 4;
        if (t > 0.4) {
          const diverge = (t - 0.4) / 0.6;
          x = -diverge * 7;
          z = 0 + diverge * 7;
        }

        const y = 0.5 + Math.sin(state.clock.elapsedTime * 6 + st.yBob) * 0.08;
        dummy.position.set(x, y, z);
        dummy.scale.set(0.28, 0.55, 0.28);
        dummy.rotation.y = t > 0.4 ? -1.1 : 0;
        dummy.updateMatrix();
        leftStudentsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      leftStudentsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate Right Students (Expectations Achieved)
    if (rightStudentsRef.current) {
      rightData.forEach((st, i) => {
        st.progress += st.speed;
        if (st.progress > 1) st.progress = 0;

        const t = st.progress;
        let x = 0;
        let z = -4 + t * 4;
        if (t > 0.4) {
          const diverge = (t - 0.4) / 0.6;
          x = diverge * 7;
          z = 0 + diverge * 7;
        }

        const y = 0.5 + Math.sin(state.clock.elapsedTime * 6 + st.yBob) * 0.08;
        dummy.position.set(x, y, z);
        dummy.scale.set(0.28, 0.55, 0.28);
        dummy.rotation.y = t > 0.4 ? 1.1 : 0;
        dummy.updateMatrix();
        rightStudentsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      rightStudentsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Left stream: orange/rose colored avatars representing unmet promises */}
      <instancedMesh ref={leftStudentsRef} args={[undefined, undefined, studentsCount / 2]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.6} roughness={0.3} />
      </instancedMesh>

      {/* Right stream: emerald/cyan glowing avatars representing verified outcomes */}
      <instancedMesh ref={rightStudentsRef} args={[undefined, undefined, studentsCount / 2]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} roughness={0.3} />
      </instancedMesh>
    </>
  );
};

// The 3D Educational Building & Entrance
const EducationalBuilding = () => {
  return (
    <group position={[0, 0, -5]}>
      {/* Main Classical / High-tech Academy Building Body */}
      <mesh position={[0, 4, -4]} castShadow receiveShadow>
        <boxGeometry args={[14, 8, 5]} />
        <meshStandardMaterial
          color="#0c1735"
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Modern Glass Entrance Atrium */}
      <mesh position={[0, 2.5, -1.2]}>
        <boxGeometry args={[6.5, 5, 2]} />
        <meshPhysicalMaterial
          color="#1e3a8a"
          transmission={0.85}
          opacity={0.9}
          transparent
          roughness={0.1}
          ior={1.4}
        />
      </mesh>

      {/* Front Architectural Grand Pillars */}
      {[-3, -1, 1, 3].map((px, idx) => (
        <mesh key={idx} position={[px, 2.8, -0.1]} castShadow>
          <cylinderGeometry args={[0.24, 0.28, 5.6, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Pediment / Triangular Roof Arch */}
      <mesh position={[0, 8.8, -3.8]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[8.5, 2.2, 4]} />
        <meshStandardMaterial color="#172554" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Top Building 3D Signage: VERICOURSE AI */}
      <group position={[0, 7.2, -1.4]}>
        <Text
          fontSize={0.65}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          VERICOURSE AI
        </Text>
      </group>

      {/* Subtitle 3D Signage: THE COURSE CREDIBILITY GATEWAY */}
      <group position={[0, 6.4, -1.4]}>
        <Text
          fontSize={0.24}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.22}
        >
          THE COURSE CREDIBILITY GATEWAY
        </Text>
      </group>

      {/* Golden Glowing Atrium Light */}
      <pointLight position={[0, 3, -1]} intensity={2.5} distance={10} color="#38bdf8" />
    </group>
  );
};

// Floor and Diverging Glowing Pathways
const Pathways = () => {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Base Grid Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[35, 30]} />
        <meshStandardMaterial color="#030712" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Central Entry Runway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]}>
        <planeGeometry args={[2.5, 7]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#38bdf8"
          emissiveIntensity={0.25}
          roughness={0.4}
        />
      </mesh>

      {/* Left Diverging Pathway (Expectations Not Met) */}
      <mesh rotation={[-Math.PI / 2, 0, -0.65]} position={[-4, 0.02, 3.5]}>
        <planeGeometry args={[2.2, 9]} />
        <meshStandardMaterial
          color="#3f1422"
          emissive="#f43f5e"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Right Diverging Pathway (Expectations Achieved) */}
      <mesh rotation={[-Math.PI / 2, 0, 0.65]} position={[4, 0.02, 3.5]}>
        <planeGeometry args={[2.2, 9]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Left Pathway 3D Signboard */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-5.8, 1.8, 4]}>
          <mesh>
            <boxGeometry args={[4, 1.4, 0.15]} />
            <meshStandardMaterial color="#1e101a" emissive="#881337" emissiveIntensity={0.6} />
          </mesh>
          <Text
            position={[0, 0.25, 0.1]}
            fontSize={0.28}
            color="#fb7185"
            anchorX="center"
            anchorY="middle"
          >
            EXPECTATIONS NOT MET
          </Text>
          <Text
            position={[0, -0.2, 0.1]}
            fontSize={0.16}
            color="#fda4af"
            anchorX="center"
            anchorY="middle"
          >
            Unmet Internships • Misleading Claims
          </Text>
        </group>
      </Float>

      {/* Right Pathway 3D Signboard */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[5.8, 1.8, 4]}>
          <mesh>
            <boxGeometry args={[4, 1.4, 0.15]} />
            <meshStandardMaterial color="#062d22" emissive="#065f46" emissiveIntensity={0.7} />
          </mesh>
          <Text
            position={[0, 0.25, 0.1]}
            fontSize={0.28}
            color="#34d399"
            anchorX="center"
            anchorY="middle"
          >
            EXPECTATIONS ACHIEVED
          </Text>
          <Text
            position={[0, -0.2, 0.1]}
            fontSize={0.16}
            color="#a7f3d0"
            anchorX="center"
            anchorY="middle"
          >
            Verified Outcomes • Acquired Skills
          </Text>
        </group>
      </Float>
    </group>
  );
};

export const Building3DExperience: React.FC = () => {
  return (
    <div className="w-full h-[580px] lg:h-[680px] relative rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-gradient-to-b from-[#050814] via-[#080d24] to-[#040612]">
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5.5, 12], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-8, 6, 2]} intensity={1.5} color="#f43f5e" />
        <pointLight position={[8, 6, 2]} intensity={2.0} color="#10b981" />

        <EducationalBuilding />
        <Pathways />
        <AnimatedStudents />

        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Overlay Notice & Interactive Hint */}
      <div className="absolute top-4 left-6 z-10 glass-panel px-4 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-2 border border-cyan-500/20">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Interactive 3D Gateway: Drag to rotate view</span>
      </div>

      <div className="absolute bottom-4 right-6 z-10 glass-panel px-4 py-2 rounded-xl text-[11px] text-slate-400 max-w-sm text-right border border-slate-800">
        *Characters are illustrative simulations representing aggregated student feedback & independent evidence.
      </div>

    </div>
  );
};
