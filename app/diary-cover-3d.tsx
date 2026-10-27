"use client";

import { useEffect, useRef } from "react";

export default function DiaryCover3D({ open, motion, onOpen, onReady }: {
  open: boolean; motion: boolean; onOpen: () => void; onReady: (ready: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ open, motion });
  useEffect(() => { state.current = { open, motion }; }, [open, motion]);
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("./diary-cover-scene").then(async ({ mountDiaryCover }) => {
      if (cancelled || !host.current) return;
      const cleanup = await mountDiaryCover(host.current, () => state.current, () => { if (!cancelled) onReady(true); }, () => { if (!cancelled) onReady(false); });
      if (cancelled) cleanup(); else dispose = cleanup;
    }).catch(() => { if (!cancelled) onReady(false); });
    return () => { cancelled = true; dispose?.(); };
  }, [onReady]);
  return <div className="dy-3d-layer" aria-hidden={open} inert={open}>
    <div className="dy-3d-canvas" ref={host} aria-hidden="true"/>
    <button className="dy-3d-open" onClick={onOpen} aria-label="Open Tammana’s journal"/>
    <div className="dy-3d-invitation" aria-hidden="true"><span className="dy-hand">a little curiosity goes a long way</span><span>CLICK THE JOURNAL TO OPEN <i>↗</i></span></div>
  </div>;
}
