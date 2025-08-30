"use client";
import { EffectComposer as Composer, SMAA, FXAA, SSAO, Bloom, Outline } from "@react-three/postprocessing";
export function EffectComposer() {
  const enabled = false;
  if (!enabled) return null;
  return (
    <Composer multisampling={0}>
      <SMAA />
      <FXAA />
      <SSAO samples={16} intensity={20} radius={0.1} />
      <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.9} />
      <Outline edgeStrength={2.0} />
    </Composer>
  );
}
