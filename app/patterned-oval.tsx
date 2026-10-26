// The border is drawn along the oval so its scallops keep an even rhythm.
function scallopedOval(rx: number, ry: number, depth: number) {
  const count = 88;
  const samples = 2000;
  const points = [{ angle: -Math.PI / 2, distance: 0 }];
  let distance = 0;
  for (let i = 1; i <= samples; i++) {
    const angle = -Math.PI / 2 + (i / samples) * Math.PI * 2;
    const previous = points[i - 1].angle;
    distance += Math.hypot(rx * (Math.cos(angle) - Math.cos(previous)), ry * (Math.sin(angle) - Math.sin(previous)));
    points.push({ angle, distance });
  }
  const angleAt = (fraction: number) => {
    const target = distance * fraction;
    const index = points.findIndex(point => point.distance >= target);
    if (index <= 0) return points[0].angle;
    const before = points[index - 1];
    const after = points[index];
    return before.angle + (after.angle - before.angle) * (target - before.distance) / (after.distance - before.distance);
  };
  const point = (angle: number, inset = 0) => {
    const nx = Math.cos(angle) / rx;
    const ny = Math.sin(angle) / ry;
    const length = Math.hypot(nx, ny);
    return `${(400 + rx * Math.cos(angle) - inset * nx / length).toFixed(2)} ${(460 + ry * Math.sin(angle) - inset * ny / length).toFixed(2)}`;
  };
  let path = `M ${point(angleAt(0))}`;
  for (let i = 0; i < count; i++) {
    path += ` Q ${point(angleAt((i + .5) / count), depth)} ${point(angleAt((i + 1) / count))}`;
  }
  return `${path} Z`;
}

export default function PatternedOval() {
  return (
    <svg className="oval-frame" viewBox="0 0 800 920" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <pattern id="oval-linen" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#fff" />
          <path d="M0 .5H5M.5 0V5" stroke="#e8e4de" strokeOpacity=".42" strokeWidth=".45" />
        </pattern>
        <filter id="oval-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope=".13" /></feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light" />
        </filter>
        <clipPath id="oval-clip"><ellipse cx="400" cy="460" rx="378" ry="440" /></clipPath>
        <g id="oval-sprig" stroke="#bca977" strokeWidth="1.8" strokeLinecap="round">
          <path d="M0 0 Q-7 -38 3 -91" />
          <path d="M-2 -18 Q-30 -22 -25 -43 Q-4 -42 -2 -18Z" fill="#8b956c" />
          <path d="M-3 -39 Q21 -42 20 -63 Q0 -61 -3 -39Z" fill="#a6a173" />
          <path d="M0 -61 Q-19 -69 -13 -84 Q3 -79 0 -61Z" fill="#8b956c" />
          <path d="M3 -86 Q-10 -97 3 -110 Q15 -98 3 -86Z" fill="#c68c8c" />
        </g>
      </defs>
      <g clipPath="url(#oval-clip)" filter="url(#oval-grain)">
        <ellipse cx="400" cy="460" rx="378" ry="440" fill="#bd8286" stroke="#70434b" strokeWidth="3" />
        <ellipse cx="400" cy="460" rx="367" ry="429" stroke="#ecd49d" strokeWidth="1" />
        <path d={scallopedOval(357, 419, 20)} fill="#efd49a" />
        <path d={scallopedOval(347, 409, 20)} fill="#ac7279" />
        <path d={scallopedOval(337, 399, 20)} fill="#e6c98e" />
        <path d={scallopedOval(328, 390, 20)} fill="url(#oval-linen)" filter="none" />
        <g opacity=".85">
          <use href="#oval-sprig" transform="translate(155 648) rotate(-20) scale(1.25)" />
          <use href="#oval-sprig" transform="translate(645 648) rotate(20) scale(-1.25 1.25)" />
          <use href="#oval-sprig" transform="translate(230 758) rotate(-43) scale(.7)" />
          <use href="#oval-sprig" transform="translate(570 758) rotate(43) scale(-.7 .7)" />
        </g>
        <g fill="#e6c98e">
          <path d="M400 104 Q403 117 412 120 Q403 123 400 136 Q397 123 388 120 Q397 117 400 104Z" />
          <path d="M400 800 Q403 813 412 816 Q403 819 400 832 Q397 819 388 816 Q397 813 400 800Z" />
          <circle cx="377" cy="120" r="2" /><circle cx="423" cy="120" r="2" />
          <circle cx="377" cy="816" r="2" /><circle cx="423" cy="816" r="2" />
        </g>
      </g>
    </svg>
  );
}
