import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Architectural Classical + Contemporary University Campus
export const ArchitecturalInstitution: React.FC = () => {
  return (
    <group position={[0, 0, -4]}>
      {/* 1. Main Institution Grand Facade & Body */}
      <mesh position={[0, 7.5, -6]} castShadow receiveShadow>
        <boxGeometry args={[36, 15, 12]} />
        <meshStandardMaterial
          color="#EFEAE1" // Warm limestone / sandstone
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Second Story Cornice & Trim */}
      <mesh position={[0, 11, -5.8]} castShadow>
        <boxGeometry args={[36.8, 0.6, 12.6]} />
        <meshStandardMaterial color="#DDD3C4" roughness={0.6} />
      </mesh>

      {/* Main Roof Arch / Classical Pediment */}
      <mesh position={[0, 16.5, -4.5]} castShadow>
        <coneGeometry args={[14, 3.8, 4]} />
        <meshStandardMaterial
          color="#1C2E1F" // Deep forest green roof copper/slate
          roughness={0.5}
        />
      </mesh>

      {/* Building Identification Signage (Engraved in stone) */}
      <group position={[0, 13.8, 0.1]}>
        <Text
          fontSize={0.85}
          color="#132A13"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          VERICOURSE ACADEMY OF VERIFICATION
        </Text>
      </group>

      <group position={[0, 12.7, 0.1]}>
        <Text
          fontSize={0.34}
          color="#6E6259"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
        >
          THE TRUST INTELLIGENCE GATEWAY
        </Text>
      </group>

      {/* 2. Glass Architectural Grand Atrium / Portico */}
      <mesh position={[0, 5, 0.2]}>
        <boxGeometry args={[16, 9.8, 4.2]} />
        <meshPhysicalMaterial
          color="#8BA888" // Sage green tinted structural glass
          transmission={0.88}
          opacity={0.92}
          transparent
          roughness={0.08}
          ior={1.45}
        />
      </mesh>

      {/* Classical Grand Limestone Entrance Pillars */}
      {[-6.5, -4.2, -2.1, 2.1, 4.2, 6.5].map((colX, idx) => (
        <group key={idx} position={[colX, 5, 2.2]}>
          {/* Pillar Base */}
          <mesh position={[0, -4.7, 0]} castShadow>
            <boxGeometry args={[0.9, 0.6, 0.9]} />
            <meshStandardMaterial color="#DDD3C4" roughness={0.7} />
          </mesh>
          {/* Column Fluted Shaft */}
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.36, 9.2, 20]} />
            <meshStandardMaterial color="#F7F3EB" roughness={0.5} />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 4.7, 0]} castShadow>
            <boxGeometry args={[0.85, 0.5, 0.85]} />
            <meshStandardMaterial color="#DDD3C4" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Grand Entrance Double Doorway */}
      <mesh position={[0, 2.8, 2.25]}>
        <boxGeometry args={[3.2, 5.2, 0.2]} />
        <meshStandardMaterial color="#3A2A1D" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Warm Golden Interior Chandelier Glow */}
      <pointLight position={[0, 4.5, -1]} intensity={2.8} distance={14} color="#FDE68A" />

      {/* 3. Multi-tier Wide Entrance Stone Steps */}
      {[0, 1, 2, 3, 4].map((stepIdx) => (
        <mesh
          key={stepIdx}
          position={[0, 0.15 * (4 - stepIdx), 2.8 + stepIdx * 0.9]}
          receiveShadow
        >
          <boxGeometry args={[18 + stepIdx * 1.5, 0.25, 1.2]} />
          <meshStandardMaterial color="#E6DFD5" roughness={0.8} />
        </mesh>
      ))}

      {/* Left Wing (Expectations Not Met Pavilion - Terracotta Accent) */}
      <group position={[-16, 4.5, -2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, 9, 7]} />
          <meshStandardMaterial color="#F3EDE4" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.8, 0]}>
          <boxGeometry args={[9.4, 0.6, 7.4]} />
          <meshStandardMaterial color="#C86D51" roughness={0.6} /> {/* Terracotta roof border */}
        </mesh>
        {/* Left Wing Signage */}
        <group position={[0, 2.5, 3.6]}>
          <Text
            fontSize={0.32}
            color="#A6533A"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            WEST WING
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.2}
            color="#C86D51"
            anchorX="center"
            anchorY="middle"
          >
            Unmet Promises Audit
          </Text>
        </group>
      </group>

      {/* Right Wing (Expectations Achieved Pavilion - Forest Green Accent) */}
      <group position={[16, 4.5, -2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, 9, 7]} />
          <meshStandardMaterial color="#F3EDE4" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.8, 0]}>
          <boxGeometry args={[9.4, 0.6, 7.4]} />
          <meshStandardMaterial color="#285228" roughness={0.6} /> {/* Forest green roof border */}
        </mesh>
        {/* Right Wing Signage */}
        <group position={[0, 2.5, 3.6]}>
          <Text
            fontSize={0.32}
            color="#1B3B1B"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            EAST WING
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.2}
            color="#31572C"
            anchorX="center"
            anchorY="middle"
          >
            Verified Outcomes Research
          </Text>
        </group>
      </group>
    </group>
  );
};

// Lush Campus Landscaping: Trees, Shrubs, Lawns, and Stone Pathways
export const CampusLandscaping: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Large Ground Plane: Warm Ivory/Stone Pavement */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 5]} receiveShadow>
        <planeGeometry args={[90, 80]} />
        <meshStandardMaterial color="#F4EFE6" roughness={0.9} />
      </mesh>

      {/* Central Grand Stone Walkway leading from plaza to entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]} receiveShadow>
        <planeGeometry args={[6.5, 20]} />
        <meshStandardMaterial color="#EAE2D5" roughness={0.75} />
      </mesh>

      {/* Left Diverging Pathway: Terracotta Tinted Stone (Expectations Not Met) */}
      <mesh
        rotation={[-Math.PI / 2, 0, -0.6]}
        position={[-7.5, 0.02, 5]}
        receiveShadow
      >
        <planeGeometry args={[4.2, 16]} />
        <meshStandardMaterial
          color="#E8C7BD" // Soft terracotta wash
          roughness={0.7}
        />
      </mesh>

      {/* Right Diverging Pathway: Sage/Forest Tinted Stone (Expectations Achieved) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.6]}
        position={[7.5, 0.02, 5]}
        receiveShadow
      >
        <planeGeometry args={[4.2, 16]} />
        <meshStandardMaterial
          color="#D2DDD0" // Soft sage green wash
          roughness={0.7}
        />
      </mesh>

      {/* Left Pathway Carved Monument: EXPECTATIONS NOT MET */}
      <group position={[-10.5, 1.3, 6]} rotation={[0, 0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.8, 1.8, 0.35]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <boxGeometry args={[4.9, 0.12, 0.4]} />
          <meshStandardMaterial color="#C86D51" roughness={0.5} />
        </mesh>
        <Text
          position={[0, 0.28, 0.2]}
          fontSize={0.24}
          color="#A6533A"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          EXPECTATIONS NOT MET
        </Text>
        <Text
          position={[0, -0.22, 0.2]}
          fontSize={0.14}
          color="#78716C"
          anchorX="center"
          anchorY="middle"
        >
          Unfulfilled Internships • Conflicting Claims
        </Text>
      </group>

      {/* Right Pathway Carved Monument: EXPECTATIONS ACHIEVED */}
      <group position={[10.5, 1.3, 6]} rotation={[0, -0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.8, 1.8, 0.35]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <boxGeometry args={[4.9, 0.12, 0.4]} />
          <meshStandardMaterial color="#285228" roughness={0.5} />
        </mesh>
        <Text
          position={[0, 0.28, 0.2]}
          fontSize={0.24}
          color="#132A13"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          EXPECTATIONS ACHIEVED
        </Text>
        <Text
          position={[0, -0.22, 0.2]}
          fontSize={0.14}
          color="#586842"
          anchorX="center"
          anchorY="middle"
        >
          Verified Placements • Evidence-Corroborated
        </Text>
      </group>

      {/* Manicured Lawn Grass Squares */}
      {[-14, 14].map((lx, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[lx, 0.01, 8]}
          receiveShadow
        >
          <planeGeometry args={[12, 16]} />
          <meshStandardMaterial color="#6B8E55" roughness={0.9} />
        </mesh>
      ))}

      {/* Campus Architectural Trees (Realistic stylized crowns + wooden trunks) */}
      {[
        [-10, 8], [-12, 12], [-14, 4], [-8, 14],
        [13, 3], [15, 8], [13, 14],
        [-6, 17], [6, 17]
      ].map(([tx, tz], idx) => (
        <group key={idx} position={[tx, 0, tz]}>
          {/* Trunk */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.24, 2.8, 8]} />
            <meshStandardMaterial color="#4A3B32" roughness={0.9} />
          </mesh>
          {/* Layered Foliage Foliar Canopy */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <sphereGeometry args={[1.35, 12, 10]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#3B6032' : '#2D4E26'}
              roughness={0.75}
            />
          </mesh>
          <mesh position={[0, 4.3, 0]} castShadow>
            <sphereGeometry args={[1.0, 10, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#4F772D' : '#31572C'}
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Modern Low Architectural Bollard Lanterns along central plaza */}
      {[-3.8, 3.8].map((sideX, sIdx) =>
        [3, 7, 11, 15].map((zPos, pIdx) => (
          <group key={`${sIdx}-${pIdx}`} position={[sideX, 0, zPos]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 1.0, 8]} />
              <meshStandardMaterial color="#2B2621" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.2, 8]} />
              <meshStandardMaterial
                color="#FDE68A"
                emissive="#F59E0B"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
};
