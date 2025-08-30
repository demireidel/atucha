"use client";
import * as THREE from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useStore } from "@/lib/store";
import { loadSteps } from "@/lib/steps";
import { CoreAuto, ControlRoomAuto } from "@/components/atucha/GLBAuto";
import Hotspots from "@/components/atucha/Hotspots";
import CutawayPlane from "@/components/scene/CutawayPlane";
import { EffectComposer } from "@/components/scene/PostFX";
function TourScene() {
  const controls = useRef<any>(null!);
  const { cinematic, perfHud, setCameraState, lang, tour, setTourSteps, show } = useStore();
  useEffect(() => { (async () => setTourSteps(await loadSteps(lang)))(); }, [lang, setTourSteps]);
  useEffect(() => {
    if (!tour.active || !controls.current || tour.steps.length === 0) return;
    const step = tour.steps[tour.index];
    controls.current.setLookAt(...step.from, ...step.to, true);
  }, [tour.active, tour.index, tour.steps]);
  return (
    <>
      <Suspense fallback={<Html center className="text-sm text-neutral-300">Loading…</Html>}>
        <directionalLight position={[12, 14, 8]} intensity={cinematic ? 2.2 : 1.6} castShadow />
        <hemisphereLight intensity={cinematic ? 0.5 : 0.35} />
        {show.core && <CoreAuto />}
        {show.control && <ControlRoomAuto />}
        <Hotspots />
        <CutawayPlane />
        <EffectComposer />
      </Suspense>
      <OrbitControls ref={controls} makeDefault enableDamping onEnd={()=>{
        const c = controls.current, cam=c.object, tgt=c.target;
        setCameraState(cam.position.toArray(), [tgt.x,tgt.y,tgt.z]);
      }} />
      {perfHud && <Perf minimal position="top-left" />}
    </>
  );
}
export default function TourPage() {
  const s = useStore();
  const t = s.lang === "en" ? {
    title: "Visit Atucha — Guided Tour",
    next: "Next", prev: "Previous", start: "Start", stop: "Stop",
    hotspots: "Hotspots", cinematic: "Cinematic", perf: "Perf HUD",
    detail: "Detail", core: "Core", control: "Control Room"
  } : {
    title: "Visitar Atucha — Recorrido Guiado",
    next: "Siguiente", prev: "Anterior", start: "Iniciar", stop: "Detener",
    hotspots: "Puntos", cinematic: "Cinemático", perf: "Perf HUD",
    detail: "Detalle", core: "Núcleo", control: "Sala de Control"
  };
  return (
    <main className="h-dvh w-dvw">
      <Canvas
        shadows
        camera={{ position: [12,8,14], fov: 50 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <TourScene />
      </Canvas>
      <div className="absolute right-3 top-3 z-10 w-80 rounded-xl bg-neutral-950/80 p-3 text-sm ring-1 ring-neutral-800 backdrop-blur">
        <div className="mb-2 font-semibold">{t.title}</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button className="rounded bg-neutral-800 px-3 py-1.5 ring-1 ring-neutral-700 hover:bg-neutral-700" onClick={() => s.prev()}>{t.prev}</button>
          <button className="rounded bg-neutral-800 px-3 py-1.5 ring-1 ring-neutral-700 hover:bg-neutral-700" onClick={() => s.next()}>{t.next}</button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button className="rounded bg-cyan-600 px-3 py-1.5 hover:bg-cyan-500" onClick={() => useStore.setState({ tour: { ...s.tour, active: !s.tour.active } })}>
            {s.tour.active ? t.stop : t.start}
          </button>
          <select value={s.lang} onChange={(e)=> useStore.setState({ lang: e.currentTarget.value as any })}
            className="rounded bg-neutral-800 px-2 py-1 ring-1 ring-neutral-700"><option value="en">EN</option><option value="es">ES</option></select>
        </div>
        <div className="space-y-1">
          <label className="flex items-center justify-between text-xs"><span>{t.hotspots}</span>
            <input type="checkbox" checked={s.showHotspots} onChange={()=>useStore.setState({showHotspots:!s.showHotspots})} /></label>
          <label className="flex items-center justify-between text-xs"><span>{t.cinematic}</span>
            <input type="checkbox" checked={s.cinematic} onChange={()=>useStore.setState({cinematic:!s.cinematic})} /></label>
          <label className="flex items-center justify-between text-xs"><span>{t.perf}</span>
            <input type="checkbox" checked={s.perfHud} onChange={()=>useStore.setState({perfHud:!s.perfHud})} /></label>
          <div className="flex items-center justify-between text-xs">
            <span>{t.detail}</span>
            <select value={s.detail} onChange={(e)=> useStore.setState({ detail: e.currentTarget.value as any })} className="rounded bg-neutral-800 px-2 py-1 ring-1 ring-neutral-700">
              <option value="low">Low</option><option value="med">Med</option><option value="high">High</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center justify-between"><span>{t.core}</span>
              <input type="checkbox" checked={s.show.core} onChange={()=>useStore.setState({ show: { ...s.show, core: !s.show.core } })} /></label>
            <label className="flex items-center justify-between"><span>{t.control}</span>
              <input type="checkbox" checked={s.show.control} onChange={()=>useStore.setState({ show: { ...s.show, control: !s.show.control } })} /></label>
          </div>
        </div>
        <div className="mt-2 text-xs text-neutral-400">
          <a href="/plan-your-visit" className="underline">Plan your real visit →</a>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-2 left-3 text-xs text-neutral-400">
        Drag = orbit · Shift+drag = pan · Wheel = zoom
      </div>
    </main>
  );
}
