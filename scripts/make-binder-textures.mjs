// Draws the journal's binder textures as SVG tiles in public/textures:
//   tooled-leather.svg  hand-tooled floral leather, the motifs raised and lit from the top left
//   suede.svg           the rough suede that lines the spine under the ring bar
// Run with: node scripts/make-binder-textures.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const size = 260;
const n = v => Number(v.toFixed(1));

// A fixed seed, so the pattern is the same every time the script runs.
let seed = 7;
function random() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Flowers: x, y, radius, petals, turn.
const flowers = [[66, 72, 30, 6, 0], [190, 178, 25, 5, 18], [205, 40, 15, 5, 8], [38, 205, 18, 6, 30], [130, 126, 13, 5, 0], [112, 222, 15, 6, 12], [242, 108, 13, 5, 0], [150, 26, 11, 5, 20]];
// Stems: cubic curves joining the flowers, some running off the tile so the pattern flows across tiles.
const stems = [
  [[66, 72], [100, 38], [146, 58], [130, 126]],
  [[130, 126], [124, 166], [160, 196], [190, 178]],
  [[66, 72], [38, 110], [16, 152], [38, 205]],
  [[190, 178], [232, 152], [238, 92], [205, 40]],
  [[38, 205], [62, 238], [92, 250], [104, 275]],
  [[205, 40], [222, 12], [250, 4], [275, 18]],
  [[130, 126], [92, 150], [70, 180], [38, 205]],
  [[66, 72], [70, 34], [104, 18], [150, 26]],
  [[190, 178], [178, 210], [140, 230], [112, 222]],
  [[242, 108], [222, 128], [196, 132], [190, 178]],
];

function bezier([a, b, c, d], t) {
  const u = 1 - t;
  const p = i => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i];
  const q = i => 3 * u * u * (b[i] - a[i]) + 6 * u * t * (c[i] - b[i]) + 3 * t * t * (d[i] - c[i]);
  return { x: p(0), y: p(1), angle: Math.atan2(q(1), q(0)) };
}

const raised = [];
const cuts = [];

for (const [x, y, r, count, turn] of flowers) {
  for (let i = 0; i < count; i++) {
    const a = (turn + (360 / count) * i) * Math.PI / 180;
    const px = x + Math.cos(a) * r * .55, py = y + Math.sin(a) * r * .55;
    const deg = n(a * 180 / Math.PI + 90);
    raised.push(`<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(r * .34)}" ry="${n(r * .56)}" transform="rotate(${deg} ${n(px)} ${n(py)})"/>`);
    cuts.push(`<path d="M${n(x + Math.cos(a) * r * .32)} ${n(y + Math.sin(a) * r * .32)}L${n(x + Math.cos(a) * r * .86)} ${n(y + Math.sin(a) * r * .86)}"/>`);
  }
  raised.push(`<circle cx="${x}" cy="${y}" r="${n(r * .3)}"/>`);
  for (let i = 0; i < 9; i++) {
    const a = random() * Math.PI * 2, d = random() * r * .2;
    cuts.push(`<circle cx="${n(x + Math.cos(a) * d)}" cy="${n(y + Math.sin(a) * d)}" r=".9" class="dot"/>`);
  }
}

for (const stem of stems) {
  const [a, b, c, d] = stem;
  raised.push(`<path d="M${a}C${b} ${c} ${d}" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"/>`);
  for (const [t, side] of [[.2, 1], [.36, -1], [.52, 1], [.68, -1], [.84, 1]]) {
    const at = bezier(stem, t);
    const angle = at.angle + side * (.75 + random() * .35);
    const length = 22 + random() * 14, width = 8 + random() * 4;
    const deg = n(angle * 180 / Math.PI);
    raised.push(`<path transform="translate(${n(at.x)} ${n(at.y)}) rotate(${deg})" d="M0 0C${n(length * .3)} ${n(-width)} ${n(length * .72)} ${n(-width * .8)} ${n(length)} ${n(side * 2)}C${n(length * .7)} ${n(width * .55)} ${n(length * .3)} ${n(width * .9)} 0 0Z"/>`);
    cuts.push(`<path transform="translate(${n(at.x)} ${n(at.y)}) rotate(${deg})" d="M2 0Q${n(length * .5)} ${n(-width * .25)} ${n(length * .9)} ${n(side * 1.5)}"/>`);
  }
  // A little curl where the stem leaves its flower.
  const at = bezier(stem, .12);
  const dir = random() > .5 ? 1 : -1;
  let curl = "";
  for (let i = 0; i <= 26; i++) {
    const th = i / 26 * Math.PI * 2.4, rr = 9 * (1 - i / 34);
    curl += `${i ? "L" : "M"}${n(at.x + Math.cos(at.angle + dir * (Math.PI / 2 + th)) * rr + Math.cos(at.angle + dir * Math.PI / 2) * 9)} ${n(at.y + Math.sin(at.angle + dir * (Math.PI / 2 + th)) * rr + Math.sin(at.angle + dir * Math.PI / 2) * 9)}`;
  }
  raised.push(`<path d="${curl}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`);
}

// The matting tool's stipple in the sunken background.
const stipple = Array.from({ length: 420 }, () => `<circle cx="${n(random() * size)}" cy="${n(random() * size)}" r="${n(.5 + random() * .6)}"/>`).join("");

// Every shape is drawn at nine offsets, so anything crossing an edge reappears on the far side and the tile repeats seamlessly.
const wrap = (id, body) => `<g id="${id}">${body}</g>` + [-size, 0, size].flatMap(dx => [-size, 0, size].filter(dy => dx || dy).map(dy => `<use href="#${id}" x="${dx}" y="${dy}"/>`)).join("");

const tooled = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs>
<filter id="relief" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="1.3" result="soft"/>
<feDiffuseLighting in="soft" surfaceScale="4" diffuseConstant="1.15" lighting-color="#fff" result="light"><feDistantLight azimuth="225" elevation="38"/></feDiffuseLighting>
<feComposite in="light" in2="SourceAlpha" operator="in" result="lit"/>
<feBlend in="SourceGraphic" in2="lit" mode="multiply" result="shaded"/>
<feMorphology in="SourceAlpha" operator="dilate" radius="1" result="grown"/>
<feComposite in="grown" in2="SourceAlpha" operator="out" result="edge"/>
<feFlood flood-color="#1c0d06" flood-opacity=".85"/><feComposite in2="edge" operator="in" result="outline"/>
<feMerge><feMergeNode in="outline"/><feMergeNode in="shaded"/></feMerge>
</filter>
</defs>
<rect width="${size}" height="${size}" fill="#42210f"/>
<g fill="#2a1409" opacity=".45">${wrap("stipple", stipple)}</g>
<g filter="url(#relief)"><g fill="#b4773f" color="#b4773f">${wrap("raised", raised.join(""))}</g></g>
<g fill="none" stroke="#2a1409" stroke-width=".9" stroke-linecap="round" opacity=".75">${wrap("cuts", cuts.join("").replace(/class="dot"/g, 'fill="#2a1409" stroke="none"'))}</g>
</svg>
`;

const suede = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<filter id="nap" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="11" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .1  0 0 0 0 .04  0 0 0 .9 -.22"/></filter>
<filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="3" seed="5" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .32  0 0 0 0 .16  0 0 0 0 .06  0 0 0 3 -1.2"/></filter>
<rect width="${size}" height="${size}" fill="#a4683b"/>
<rect width="${size}" height="${size}" filter="url(#mottle)"/>
<rect width="${size}" height="${size}" filter="url(#nap)"/>
</svg>
`;

mkdirSync("public/textures", { recursive: true });
writeFileSync("public/textures/tooled-leather.svg", tooled);
writeFileSync("public/textures/suede.svg", suede);
console.log("Wrote public/textures/tooled-leather.svg and public/textures/suede.svg");
