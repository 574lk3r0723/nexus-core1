'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, Point } from '@react-three/drei';
import { useRef } from 'react';

function LatticeNode({ position, color, pulse }: any) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (pulse && ref.current) {
      const dist = Math.hypot(ref.current.position.x - pulse.x, ref.current.position.y - pulse.y);
      ref.current85.scale.x = ref.current.scale.y = ref.current.scale.z = 1 + Math.sin(dist * 0.1 - state.clock.elapsedTime * 10) * 0.5;
    }
  });

  return <Point ref={ref} position={position} color={color} size={15} sizeAttenuation />;
}

export default function NexusLattice({ nodes, pulse }: any) {
  const points = nodes.flatMap((n: any) => n.position);
  return (
    <Canvas camera={{ position: [0, 0, 600], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 500]} intensity={2} color="#ffffff" />
      <Points positions={new Float32Array(points)} stride={3}>
        {nodes.map((node: any) => (
          <LatticeNode key={node.id} position={node.position} color={node.color} pulse={pulse} />
        ))}
      </Points>
    </Canvas>
  );
}
