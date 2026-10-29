"use client";

import { useEffect, useRef, useState } from "react";

export default function CafeIpod({ motion }: { motion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const playing = useRef(motion);
  const [ready, setReady] = useState(false);
  useEffect(() => { playing.current = motion; }, [motion]);
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("./project-ipod-scene").then(({mountCafeIpod}) => {
      if (cancelled || !host.current) return;
      const cleanup = mountCafeIpod(host.current, () => playing.current, () => setReady(true));
      if (cancelled) cleanup(); else dispose = cleanup;
    }).catch(() => { /* The paper-and-CSS version remains visible without WebGL. */ });
    return () => { cancelled = true; dispose?.(); };
  }, []);
  return <div className={`pj-ipod ${ready ? "pj-ipod-ready" : ""}`} role="img" aria-label="A gently turning three-dimensional white iPod with wired earphones, its little screen showing Daily Café">
    <div className="pj-ipod-fallback" aria-hidden="true"><svg className="pj-earphone-cord" viewBox="0 0 250 360"><path d="M121 210c-78 122 88 112 59 13S148 40 205 62m-25 161C80 200 201 90 145 31" fill="none" stroke="#777365" strokeWidth="5"/><path d="M121 210c-78 122 88 112 59 13S148 40 205 62m-25 161C80 200 201 90 145 31" fill="none" stroke="#fffdf3" strokeWidth="3.5"/><g fill="#fffdf3" stroke="#a7a394"><ellipse cx="204" cy="55" rx="13" ry="18"/><rect x="196" y="64" width="7" height="30" rx="3"/><ellipse cx="144" cy="26" rx="14" ry="18"/><rect x="139" y="35" width="7" height="30" rx="3"/></g></svg><div className="pj-css-ipod"><div className="pj-ipod-screen"><span>Daily Café</span><b>a room for quiet days</b><i>▰ ▰ ▰ ▰ ▰</i><small>01 / 96</small></div><div className="pj-ipod-wheel"><span>MENU</span><i>◁</i><b/><em>▷</em><small>▸Ⅱ</small></div></div></div>
    <div ref={host} className="pj-ipod-canvas" aria-hidden="true"/>
  </div>;
}
