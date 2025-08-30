"use client";
import { Html } from "@react-three/drei";
export default function ParametricControlRoom() {
  const CONSOLE_COUNT=12, ARC_RADIUS=6.0, angleStep=(Math.PI*0.9)/(CONSOLE_COUNT-1);
  return (
    <group position={[12,0,-6]}>
      <mesh receiveShadow position={[0,-0.05,0]} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[14,10,14,10]} />
        <meshStandardMaterial color="#22272e" />
      </mesh>
      <mesh position={[0,2.1,-3.2]}>
        <boxGeometry args={[12,3.2,0.2]} />
        <meshStandardMaterial color="#262a30" />
      </mesh>
      {Array.from({length:6}).map((_,i)=>(
        <mesh key={i} position={[-5+i*2,2.1,-3.1]}>
          <planeGeometry args={[1.6,1.0]} />
          <meshStandardMaterial emissive="#1ec8ff" emissiveIntensity={0.25} color="#0a1015" />
        </mesh>
      ))}
      {Array.from({length:CONSOLE_COUNT}).map((_,i)=>{
        const a=-Math.PI*0.45+i*angleStep, x=Math.cos(a)*ARC_RADIUS, z=Math.sin(a)*ARC_RADIUS, rotY=-a+Math.PI/2;
        return (
          <group key={i} position={[x,0.45,z]} rotation={[0,rotY,0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[1.2,0.9,0.7]} /><meshStandardMaterial color="#3f4750" /></mesh>
            <mesh position={[0,0.4,-0.35]} rotation={[0.02,0,0]}><boxGeometry args={[0.9,0.5,0.06]} /><meshStandardMaterial color="#10151b" emissive="#33a3ff" emissiveIntensity={0.15} /></mesh>
            <mesh position={[0,0.1,0.15]}><boxGeometry args={[0.8,0.05,0.25]} /><meshStandardMaterial color="#2f3640" /></mesh>
            <mesh position={[0.5,0.3,-0.25]}><sphereGeometry args={[0.04,16,16]} /><meshStandardMaterial emissive="#ffb347" emissiveIntensity={0.6} color="#222" /></mesh>
          </group>
        );
      })}
      <Html position={[0,3.4,-3.2]} center className="text-xs text-neutral-300">
        Control Room — consoles, mimic panels, and operator workstations
      </Html>
    </group>
  );
}
