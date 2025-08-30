"use client";
import { Html } from "@react-three/drei";
import { useStore } from "@/lib/store";
export default function Hotspots() {
  const { showHotspots, lang } = useStore();
  if (!showHotspots) return null;
  const spots = lang === "en" ? [
    { id: "rpv", pos: [0, 2.8, 2.2], text: "Reactor Vessel (vertical PHWR design)" },
    { id: "channels", pos: [1.5, 0.8, 0], text: "≈451 channels; on-power refueling" },
    { id: "control", pos: [12, 2.6, -6], text: "Control room consoles & mimic wall" }
  ] : [
    { id: "rpv", pos: [0, 2.8, 2.2], text: "Vasija del reactor (PHWR vertical)" },
    { id: "channels", pos: [1.5, 0.8, 0], text: "≈451 canales; recarga en línea" },
    { id: "control", pos: [12, 2.6, -6], text: "Consolas y pared de mímica" }
  ];
  return (
    <group>
      {spots.map(s => (
        <Html key={s.id} position={s.pos as any} className="rounded bg-neutral-900/80 p-2 text-xs shadow-lg ring-1 ring-neutral-700">
          {s.text}
        </Html>
      ))}
    </group>
  );
}
