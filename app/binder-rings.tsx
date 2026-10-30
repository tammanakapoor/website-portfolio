import { useId } from "react";
import type { CSSProperties } from "react";
import "./binder-rings.css";

/** Where the rings sit along the spine, in %: two sets of three, like a real six-ring mechanism. */
const places = [9, 20, 31, 69, 80, 91];

// One ring drawn running left to right across the spine: the punched holes, the far side of the loop
// down in the gutter, its shadow on the paper, then the near side as a shaded antique-brass tube.
const front = "M11 19C30 26.5 70 26.5 89 19";

/** Brass binder rings on a brass bar over a strip of suede. `spine` is the direction the spine runs on screen. */
export default function BinderRings({ spine, className = "" }: { spine: "vertical" | "horizontal"; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const across = spine === "vertical";
  return <div className={`dy-rings dy-rings-${spine} ${className}`} aria-hidden="true">
    <span className="dy-rings-suede"/>
    <span className="dy-rings-bar"/>
    {places.map((at, i) => <svg key={at} className="dy-ring" style={{ "--at": `${at}%` } as CSSProperties} viewBox={across ? "0 0 100 34" : "0 0 34 100"}>
      {i === 0 && <defs>
        <radialGradient id={`${id}h`} cx=".5" cy=".4" r=".62"><stop offset="0" stopColor="#0d0a07"/><stop offset=".55" stopColor="#2a2219"/><stop offset="1" stopColor="#6b5e4a"/></radialGradient>
        <linearGradient id={`${id}m`} gradientUnits="userSpaceOnUse" x1="11" y1="0" x2="89" y2="0"><stop offset="0" stopColor="#6b5326"/><stop offset=".2" stopColor="#b8964f"/><stop offset=".5" stopColor="#ecd696"/><stop offset=".8" stopColor="#b8964f"/><stop offset="1" stopColor="#6b5326"/></linearGradient>
        <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1="11" y1="0" x2="89" y2="0"><stop offset="0" stopColor="#2e230e"/><stop offset=".5" stopColor="#80693a"/><stop offset="1" stopColor="#2e230e"/></linearGradient>
        <filter id={`${id}s`} x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.5"/></filter>
      </defs>}
      {/* Flipped across the diagonal for a horizontal spine, so the light still falls from the top left. */}
      <g transform={across ? undefined : "matrix(0 1 1 0 0 0)"}>
        {[11, 89].map(x => <g key={x} className={x === 11 ? "dy-ring-hole-start" : undefined}>
          <ellipse cx={x} cy="18.2" rx="5" ry="6.1" fill="#fffaf0" opacity=".65"/>
          <ellipse cx={x} cy="17.2" rx="4.6" ry="5.7" fill={`url(#${id}h)`}/>
        </g>)}
        <path className="dy-ring-far" d="M11 16C30 9 70 9 89 16" fill="none" stroke={`url(#${id}b)`} strokeWidth="4.2" strokeLinecap="round"/>
        <path d={front} transform="translate(3 4.6)" fill="none" stroke="#24170e" strokeOpacity=".45" strokeWidth="6" strokeLinecap="round" filter={`url(#${id}s)`}/>
        <path d={front} fill="none" stroke="#4a3a17" strokeWidth="6.4" strokeLinecap="round"/>
        <path d={front} transform="translate(0 -.6)" fill="none" stroke={`url(#${id}m)`} strokeWidth="4.4" strokeLinecap="round"/>
        <path d={front} transform="translate(0 -1.7)" fill="none" stroke="#fff4cf" strokeOpacity=".85" strokeWidth="1.1" strokeLinecap="round" pathLength={100} strokeDasharray="0 16 68 16"/>
      </g>
    </svg>)}
  </div>;
}

/** Saddle stitching in waxed thread, following the rounded edge of whatever leather it sits in. */
export function Stitching({ className = "" }: { className?: string }) {
  return <svg className={`dy-stitching ${className}`} aria-hidden="true">
    <rect className="dy-stitching-holes" width="100%" height="100%" rx="11"/>
    <rect className="dy-stitching-thread" width="100%" height="100%" rx="11"/>
  </svg>;
}

/** The snap strap that closes the binder, reaching out from the cover's edge with a brass press-stud. */
export function SnapStrap() {
  return <span className="dy-strap" aria-hidden="true"><Stitching/><i/></span>;
}
