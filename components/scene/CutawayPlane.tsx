"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
export default function CutawayPlane() {
  const { gl } = useThree();
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), -1.0));
  const { y } = useSpring({ y: 1.0, config: { tension: 120, friction: 22 } });
  useEffect(() => { gl.localClippingEnabled = true; gl.clippingPlanes = [planeRef.current]; return () => { gl.clippingPlanes = []; gl.localClippingEnabled = false; }; }, [gl]);
  useFrame(() => { planeRef.current.constant = -y.get(); });
  return null;
}
