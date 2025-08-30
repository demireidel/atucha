"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAssetExists } from "@/lib/useAssetExists";
import { useStore } from "@/lib/store";
export default function AudioCaption() {
  const { lang, tour, narrationOn, voice, rate } = useStore();
  const step = tour.steps[tour.index];
  const localUrl = useMemo(()=> step ? `/audio/${lang}/step-${step.id}.mp3` : "", [lang, step]);
  const vttUrl = useMemo(()=> step ? `/captions/${lang}/step-${step.id}.vtt` : "", [lang, step]);
  const localExists = useAssetExists(localUrl);
  const vttExists = useAssetExists(vttUrl);
  const ref = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    (async () => {
      if (!step) return;
      if (!narrationOn) { setSrc(""); return; }
      if (localExists) setSrc(localUrl);
      else setSrc(`/api/tts?lang=${lang}&id=${encodeURIComponent(step.id)}&voice=${voice}&rate=${rate}&ssml=1`);
      if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
      setTimeout(()=>ref.current?.play().catch(()=>{}), 50);
    })();
  }, [lang, step?.id, localExists, localUrl, narrationOn, voice, rate]);
  if (!step) return null;
  if (!src && vttExists === false) return null;
  return (
    <div className="absolute left-3 bottom-3 z-10 rounded-xl bg-neutral-950/80 p-3 text-xs ring-1 ring-neutral-800 backdrop-blur max-w-[60ch]">
      {src && (<audio ref={ref} controls className="w-full"><source src={src} type="audio/mpeg" />{vttExists && <track kind="captions" srcLang={lang} src={vttUrl} default />}</audio>)}
      {!src && vttExists && (<div className="mt-1 text-neutral-300">Captions available for this step.</div>)}
    </div>
  );
}
