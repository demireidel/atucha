import { create } from "zustand";
export type TourStep = { id: string; title: string; from: [number,number,number]; to: [number,number,number]; cut?: boolean; copy?: string; };
type Store = {
  lang: "en" | "es";
  perfHud: boolean;
  cinematic: boolean;
  showHotspots: boolean;
  detail: "low" | "med" | "high";
  show: { core: boolean; control: boolean; exterior: boolean };
  tour: { active: boolean; index: number; steps: TourStep[] };
  camera: { pos: number[]; target: number[] };
  narrationOn: boolean; voice: string; rate: "slow"|"medium"|"fast";
  endTourModal: boolean;
  setCameraState: (pos: number[], target: number[]) => void;
  setTourSteps: (steps: TourStep[]) => void;
  next: () => void; prev: () => void;
};
export const useStore = create<Store>((set, get) => ({
  lang: "en",
  perfHud: false,
  cinematic: true,
  showHotspots: true,
  detail: "high",
  show: { core: true, control: true, exterior: true },
  tour: { active: false, index: 0, steps: [] },
  camera: { pos: [12,8,14], target: [0,0,0] },
  narrationOn: true, voice: "alloy", rate: "medium",
  endTourModal: false,
  setCameraState: (pos, target) => set({ camera: { pos, target } }),
  setTourSteps: (steps) => set(s => ({ tour: { ...s.tour, steps } })),
  next: () => set(s => { const last = s.tour.steps.length - 1; const i = Math.min(last, s.tour.index + 1); return { tour: { ...s.tour, index: i }, endTourModal: i === last }; }),
  prev: () => set(s => ({ tour: { ...s.tour, index: Math.max(0, s.tour.index - 1) } }))
}));
