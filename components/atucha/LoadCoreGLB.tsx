"use client";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect } from "react";
export default function CoreGLB() {
  const gltf = useLoader(GLTFLoader, "/assets/atucha2/core.glb");
  useEffect(()=>{ gltf.scene.traverse((o:any)=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } }); },[gltf]);
  return <primitive object={gltf.scene} />;
}
