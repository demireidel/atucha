"use client";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Detailed, Instances, Instance } from "@react-three/drei";
import { useStore } from "@/lib/store";
export default function ParametricCore() {
  const group = useRef<THREE.Group>(null!);
  const { detail } = useStore();
  const RPV_RADIUS=4.0, RPV_HEIGHT=9.0;
  const channels = useMemo(()=>{
    const pts: THREE.Vector3[] = []; const spacing=0.18, maxR=3.2;
    for (let q=-22;q<=22;q++){ for (let r=-22;r<=22;r++){ const x=(q+r/2)*spacing; const z=r*(Math.sqrt(3)/2)*spacing; if (Math.hypot(x,z)<maxR) pts.push(new THREE.Vector3(x,0,z)); } }
    return pts.slice(0,451);
  },[]);
  const distances = detail==="high"?[6,12,18]:detail==="med"?[5,9,14]:[4,7,10];
  const chanRadius = detail==="high"?0.035:detail==="med"?0.045:0.06;
  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[RPV_RADIUS,RPV_RADIUS,RPV_HEIGHT,96,1,true]} />
        <meshStandardMaterial metalness={0.6} roughness={0.35} color="#98a6b5" side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={RPV_HEIGHT/2}>
        <sphereGeometry args={[RPV_RADIUS,64,48,0,Math.PI*2,0,Math.PI/2]} />
        <meshStandardMaterial metalness={0.6} roughness={0.35} color="#9aa6b2" />
      </mesh>
      <mesh position-y={-RPV_HEIGHT/2}>
        <sphereGeometry args={[RPV_RADIUS,64,48,0,Math.PI*2,Math.PI/2,Math.PI/2]} />
        <meshStandardMaterial metalness={0.6} roughness={0.35} color="#8a949f" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[3.4,3.4,RPV_HEIGHT*0.78,64,1,true]} />
        <meshPhysicalMaterial transparent opacity={0.15} roughness={0.1} transmission={0.85} color="#6ec1ff" />
      </mesh>
      <Detailed distances={distances}>
        <Instances limit={channels.length} range={channels.length}>
          <cylinderGeometry args={[chanRadius,chanRadius,RPV_HEIGHT*0.72]} />
          <meshStandardMaterial color="#cfd6dc" metalness={0.1} roughness={0.5} />
          {channels.map((p,i)=>(<Instance key={i} position={[p.x,0,p.z]} />))}
        </Instances>
        <Instances limit={channels.length} range={channels.length}>
          <cylinderGeometry args={[chanRadius*1.15,chanRadius*1.15,RPV_HEIGHT*0.72]} />
          <meshStandardMaterial color="#c3cbd2" />
          {channels.map((p,i)=>(<Instance key={i} position={[p.x,0,p.z]} />))}
        </Instances>
        <mesh>
          <cylinderGeometry args={[3.25,3.25,RPV_HEIGHT*0.72,32]} />
          <meshStandardMaterial transparent opacity={0.25} color="#aeb7bf" />
        </mesh>
      </Detailed>
      <group position-y={1.0}>
        <mesh position={[RPV_RADIUS,0,0]} rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.35,0.35,1.2,24]} />
          <meshStandardMaterial color="#9aa6b2" />
        </mesh>
        <mesh position={[-RPV_RADIUS,0,0]} rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.35,0.35,1.2,24]} />
          <meshStandardMaterial color="#9aa6b2" />
        </mesh>
      </group>
      <mesh position-y={RPV_HEIGHT/2+0.05} rotation={[-Math.PI/2,0,0]}>
        <cylinderGeometry args={[3.5,3.5,0.08,64]} />
        <meshStandardMaterial color="#6b7784" />
      </mesh>
    </group>
  );
}
