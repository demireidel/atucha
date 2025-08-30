"use client";
import { useAssetExists } from "@/lib/useAssetExists";
import ParametricCore from "./ParametricCore";
import ParametricControlRoom from "./ParametricControlRoom";
import CoreGLB from "./LoadCoreGLB";
import ControlRoomGLB from "./LoadControlRoomGLB";
export function CoreAuto() {
  const exists = useAssetExists("/assets/atucha2/core.glb");
  if (exists === null) return <ParametricCore />;
  return exists ? <CoreGLB /> : <ParametricCore />;
}
export function ControlRoomAuto() {
  const exists = useAssetExists("/assets/atucha2/control_room.glb");
  if (exists === null) return <ParametricControlRoom />;
  return exists ? <ControlRoomGLB /> : <ParametricControlRoom />;
}
