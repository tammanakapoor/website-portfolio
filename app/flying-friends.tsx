import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import "./flying-friends.css";

// A few butterflies that wander slowly over the whole page, whatever the journal is doing.
// They are drawn facing up; each frame turns them toward where they are heading.
// They rest where they are while the little movements are paused.

type Flyer = { x: number; y: number; heading: number; speed: number; turn: number; until: number };

/** Each butterfly's wing colours (inner to outer), size, wingbeat and where it starts, as a share of the window. */
const butterflies = [
  { colours: ["#c45a2b", "#e39a4f", "#f1c27a"], size: 1, flap: .42, start: [.15, .3] },
  { colours: ["#5f80ab", "#9db9da", "#dbe8f2"], size: .85, flap: .48, start: [.8, .7] },
];

const margin = 30;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function Butterfly({ id, colours, size }: { id: string; colours: string[]; size: number }) {
  const wing = <>
    <path d="M-1 -3C-6 -15 -18 -18 -20 -11C-22 -4 -14 1 -1 1Z"/>
    <path d="M-1 1C-11 2 -17 9 -12 15C-8 19 -3 12 -1 5Z"/>
    <circle cx="-15" cy="-11" r="1.4" fill="#fff6e2"/><circle cx="-11.5" cy="-14.5" r="1" fill="#fff6e2"/><circle cx="-10" cy="12" r="1.1" fill="#fff6e2"/>
  </>;
  return <svg viewBox="-24 -22 48 44" width={62 * size} height={57 * size}>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">{colours.map((c, i) => <stop key={c} offset={i / (colours.length - 1)} stopColor={c}/>)}</linearGradient>
    </defs>
    <g className="ff-wings" fill={`url(#${id})`} stroke="#3a2416" strokeWidth="1.3" strokeLinejoin="round">{wing}</g>
    <g transform="scale(-1 1)"><g className="ff-wings" fill={`url(#${id})`} stroke="#3a2416" strokeWidth="1.3" strokeLinejoin="round">{wing}</g></g>
    <ellipse cx="0" cy="1" rx="1.6" ry="8.5" fill="#2e1c12"/>
    <circle cx="0" cy="-8.6" r="2.1" fill="#2e1c12"/>
    <path d="M-.6 -10C-2 -15 -4 -18 -5.5 -19M.6 -10C2 -15 4 -18 5.5 -19" fill="none" stroke="#2e1c12" strokeWidth=".8" strokeLinecap="round"/>
  </svg>;
}

export default function FlyingFriends({ moving }: { moving: boolean }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const flyers = useRef<Flyer[] | null>(null);

  useEffect(() => {
    const w = () => innerWidth, h = () => innerHeight;
    if (flyers.current?.length !== butterflies.length) flyers.current =butterflies.map(({ start: [x, y] }) => ({ x: w() * x, y: h() * y, heading: rand(-Math.PI, Math.PI), speed: 30, turn: 0, until: 0 }));
    // Each is placed by its body's centre, which is also the point it turns around.
    const place = (now: number) => flyers.current!.forEach((f, i) => {
      const el = refs.current[i], s = butterflies[i].size;
      const bob = Math.sin(now / 240 + i * 1.7) * 3;
      if (el) el.style.transform = `translate(${f.x - 31 * s}px,${f.y - 28.5 * s + bob}px) rotate(${f.heading + Math.PI / 2}rad)`;
      if (el) el.style.opacity = "1";
    });
    place(performance.now());
    if (!moving) return;

    let frame = 0, last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      // Each meanders: a new lazy turn every so often, steering home when it nears an edge.
      for (const b of flyers.current!) {
        if (now > b.until) { b.turn = rand(-1.6, 1.6); b.speed = rand(20, 38); b.until = now + rand(700, 2000); }
        const toCentre = Math.atan2(h() / 2 - b.y, w() / 2 - b.x);
        const nearEdge = b.x < margin * 3 || b.x > w() - margin * 3 || b.y < margin * 3 || b.y > h() - margin * 3;
        b.heading = wrapAngle(b.heading + (nearEdge ? wrapAngle(toCentre - b.heading) * 2 : b.turn) * dt);
        b.x = Math.min(w() - margin, Math.max(margin, b.x + Math.cos(b.heading) * b.speed * dt));
        b.y = Math.min(h() - margin, Math.max(margin, b.y + Math.sin(b.heading) * b.speed * dt));
      }
      place(now);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [moving]);

  return <div className={`ff-sky ${moving ? "" : "ff-resting"}`} aria-hidden="true">
    {butterflies.map((b, i) => <div key={i} className="ff-flyer" ref={el => { refs.current[i] = el; }} style={{ transformOrigin: `${31 * b.size}px ${28.5 * b.size}px`, "--flap": `${b.flap}s` } as CSSProperties}>
      <Butterfly id={`ff-butterfly-${i}`} colours={b.colours} size={b.size}/>
    </div>)}
  </div>;
}
