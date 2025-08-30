"use client";
import { useEffect, useState } from "react";
export function useAssetExists(url: string) {
  const [exists, setExists] = useState<boolean | null>(null);
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const head = await fetch(url, { method: "HEAD" });
        if (mounted && head.ok) { setExists(true); return; }
        const bite = await fetch(url, { headers: { Range: "bytes=0-0" } });
        if (mounted && (bite.ok || bite.status === 206)) { setExists(true); return; }
        if (mounted) setExists(false);
      } catch { if (mounted) setExists(false); }
    };
    check(); return () => { mounted = false; };
  }, [url]);
  return exists;
}
