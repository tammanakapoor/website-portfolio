import { useEffect, useRef } from "react";
import "./flying-friends.css";

// A butterfly and a dragonfly that wander over the whole page, whatever the journal is doing.
// Both are drawn facing up; each frame turns them toward where they are heading.
// They rest where they are while the little movements are paused.

type Flyer = { x: number; y: number; heading: number; speed: number; turn: number; until: number; target?: { x: number; y: number }; hoverUntil?: number };

const margin = 30;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function Butterfly() {
  const wing = <>
    <path className="ff-wing-fore" d="M-1 -3C-6 -15 -18 -18 -20 -11C-22 -4 -14 1 -1 1Z"/>
    <path className="ff-wing-hind" d="M-1 1C-11 2 -17 9 -12 15C-8 19 -3 12 -1 5Z"/>
    <circle cx="-15" cy="-11" r="1.4" fill="#fff6e2"/><circle cx="-11.5" cy="-14.5" r="1" fill="#fff6e2"/><circle cx="-10" cy="12" r="1.1" fill="#fff6e2"/>
  </>;
  return <svg viewBox="-24 -22 48 44" width="62" height="57">
    <defs>
      <linearGradient id="ff-butterfly" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c45a2b"/><stop offset=".55" stopColor="#e39a4f"/><stop offset="1" stopColor="#f1c27a"/></linearGradient>
    </defs>
    <g className="ff-wings" fill="url(#ff-butterfly)" stroke="#3a2416" strokeWidth="1.3" strokeLinejoin="round">{wing}</g>
    <g transform="scale(-1 1)"><g className="ff-wings" fill="url(#ff-butterfly)" stroke="#3a2416" strokeWidth="1.3" strokeLinejoin="round">{wing}</g></g>
    <ellipse cx="0" cy="1" rx="1.6" ry="8.5" fill="#2e1c12"/>
    <circle cx="0" cy="-8.6" r="2.1" fill="#2e1c12"/>
    <path d="M-.6 -10C-2 -15 -4 -18 -5.5 -19M.6 -10C2 -15 4 -18 5.5 -19" fill="none" stroke="#2e1c12" strokeWidth=".8" strokeLinecap="round"/>
  </svg>;
}

function Dragonfly() {
  const wing = (y: number, tilt: number, length: number) => <g transform={`translate(1.5 ${y}) rotate(${tilt})`}>
    <ellipse cx={length / 2} cy="0" rx={length / 2} ry="3.3" fill="#e4f1f2" fillOpacity=".55" stroke="#5d7f86" strokeOpacity=".7" strokeWidth=".6"/>
    <path d={`M1 0H${length - 2}M${length * .3} -1.8L${length * .5} 1.6M${length * .55} -2L${length * .75} 1.4`} stroke="#5d7f86" strokeOpacity=".45" strokeWidth=".4"/>
    <circle cx={length - 4} cy="-1" r=".9" fill="#3b4f52"/>
  </g>;
  return <svg viewBox="-30 -14 60 50" width="84" height="70">
    <g className="ff-dragon-wings">
      <g>{wing(-4, -8, 27)}{wing(.5, 6, 25)}</g>
      <g transform="scale(-1 1)">{wing(-4, -8, 27)}{wing(.5, 6, 25)}</g>
    </g>
    <path d="M-1.3 3L-.8 33Q0 35 .8 33L1.3 3Z" fill="#2f6f73"/>
    <path d="M-1.2 9H1.2M-1.1 14H1.1M-1 19H1M-.9 24H.9M-.8 29H.8" stroke="#163c3f" strokeWidth=".7"/>
    <ellipse cx="0" cy="-1.5" rx="2.8" ry="4.8" fill="#2a6468"/>
    <circle cx="-2.1" cy="-7.4" r="2.3" fill="#1f4a4d"/><circle cx="2.1" cy="-7.4" r="2.3" fill="#1f4a4d"/>
    <circle cx="-2.6" cy="-8" r=".7" fill="#d9f0ee"/><circle cx="1.6" cy="-8" r=".7" fill="#d9f0ee"/>
  </svg>;
}

export default function FlyingFriends({ moving }: { moving: boolean }) {
  const butterflyRef = useRef<HTMLDivElement>(null);
  const dragonflyRef = useRef<HTMLDivElement>(null);
  const flyers = useRef<{ butterfly: Flyer; dragonfly: Flyer } | null>(null);

  useEffect(() => {
    const w = () => innerWidth, h = () => innerHeight;
    if (!flyers.current) flyers.current = {
      butterfly: { x: w() * .15, y: h() * .3, heading: -.4, speed: 60, turn: 0, until: 0 },
      dragonfly: { x: w() * .85, y: h() * .7, heading: Math.PI, speed: 0, turn: 0, until: 0, hoverUntil: 0 },
    };
    const place = () => {
      // Each is placed by its body's centre, which is also the point it turns around (see flying-friends.css).
      for (const [ref, f, ox, oy] of [[butterflyRef, flyers.current!.butterfly, 31, 28.5], [dragonflyRef, flyers.current!.dragonfly, 42, 19.6]] as const) {
        const bob = ref === butterflyRef ? Math.sin(performance.now() / 160) * 3 : 0;
        if (ref.current) ref.current.style.transform = `translate(${f.x - ox}px,${f.y - oy + bob}px) rotate(${f.heading + Math.PI / 2}rad)`;
      }
    };
    place();
    if (!moving) return;

    let frame = 0, last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      const { butterfly: b, dragonfly: d } = flyers.current!;

      // The butterfly meanders: a new lazy turn every so often, steering home when it nears an edge.
      if (now > b.until) { b.turn = rand(-2.2, 2.2); b.speed = rand(45, 85); b.until = now + rand(400, 1400); }
      const toCentre = Math.atan2(h() / 2 - b.y, w() / 2 - b.x);
      const nearEdge = b.x < margin * 3 || b.x > w() - margin * 3 || b.y < margin * 3 || b.y > h() - margin * 3;
      b.heading = wrapAngle(b.heading + (nearEdge ? wrapAngle(toCentre - b.heading) * 2.5 : b.turn) * dt);
      b.x = Math.min(w() - margin, Math.max(margin, b.x + Math.cos(b.heading) * b.speed * dt));
      b.y = Math.min(h() - margin, Math.max(margin, b.y + Math.sin(b.heading) * b.speed * dt));

      // The dragonfly hovers, then darts somewhere new and stops dead.
      if (d.target) {
        const dx = d.target.x - d.x, dy = d.target.y - d.y, dist = Math.hypot(dx, dy);
        d.heading = wrapAngle(d.heading + wrapAngle(Math.atan2(dy, dx) - d.heading) * Math.min(1, dt * 14));
        const move = Math.min(dist, Math.max(60, dist * 3.2) * dt);
        if (dist < 2) { d.target = undefined; d.hoverUntil = now + rand(700, 2600); }
        else { d.x += dx / dist * move; d.y += dy / dist * move; }
      } else if (now > (d.hoverUntil ?? 0)) {
        const angle = rand(0, Math.PI * 2), reach = rand(140, Math.min(480, Math.max(w(), h()) * .5));
        d.target = { x: Math.min(w() - margin * 2, Math.max(margin * 2, d.x + Math.cos(angle) * reach)), y: Math.min(h() - margin * 2, Math.max(margin * 2, d.y + Math.sin(angle) * reach)) };
      } else {
        d.x += Math.sin(now / 90) * .15; d.y += Math.cos(now / 110) * .15;
      }
      place();
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [moving]);

  return <div className={`ff-sky ${moving ? "" : "ff-resting"}`} aria-hidden="true">
    <div className="ff-flyer ff-butterfly" ref={butterflyRef}><Butterfly/></div>
    <div className="ff-flyer ff-dragonfly" ref={dragonflyRef}><Dragonfly/></div>
  </div>;
}
