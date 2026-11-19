import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ArchitecturalInstitution, CampusLandscaping } from './ArchitecturalCampus';
import { CrowdSimulation } from './RealisticHumanCharacter';

interface SceneProps {
  interactive?: boolean;
}

// Camera controller that smoothly transitions elevation, depth, and viewing angle as user scrolls
const ScrollCameraController: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  useFrame(({ camera }) => {
    // Base camera at top: [0, 6.2, 19], target [0, 2.5, 0]
    // As user scrolls past: elevate slightly and tilt towards diverging left/right wings
    const targetY = 6.2 + scrollProgress * 3.5;
    const targetZ = 19 - scrollProgress * 4.0;
    const targetX = Math.sin(scrollProgress * Math.PI) * -1.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
  });

  return null;
};

export const FullBleedCanvasExperience: React.FC<SceneProps> = ({ interactive = true }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const gatewayEl = document.getElementById('credibility-gateway');
      if (gatewayEl) {
        const rect = gatewayEl.getBoundingClientRect();
        const winH = window.innerHeight;
        // Calculate progress from 0 (when entering viewport) to 1 (when exiting)
        const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
        setScrollProgress(progress);
      } else {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (maxScroll > 0) setScrollProgress(Math.min(1, scrollY / maxScroll));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-full relative min-h-[580px] bg-[#EFECE1]/40">
      <Canvas
        camera={{ position: [0, 6.2, 19], fov: 44 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Soft, warm architectural daylight */}
        <ambientLight intensity={1.3} color="#FFFBF5" />
        <directionalLight
          position={[25, 35, 18]}
          intensity={1.8}
          color="#FFF8E7" // Golden natural sun warmth
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={70}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0003}
        />
        {/* Sky fill bounce light */}
        <directionalLight position={[-15, 20, -10]} intensity={0.5} color="#DDE9E2" />

        <ScrollCameraController scrollProgress={scrollProgress} />

        <Suspense fallback={null}>
          {/* 3D Campus Scene */}
          <ArchitecturalInstitution />
          <CampusLandscaping />
          <CrowdSimulation scrollYProgress={scrollProgress} />
        </Suspense>

        {/* User can look around and explore the campus and diverging student pathways */}
        {interactive && (
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={Math.PI / 4.2}
            maxAzimuthAngle={Math.PI / 5}
            minAzimuthAngle={-Math.PI / 5}
            rotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  );
};
