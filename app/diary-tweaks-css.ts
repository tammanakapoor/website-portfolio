/** Hand-placed positions from the localhost edit mode, keyed by a selector inside `.diary-app`. */
export type Tweak = {
  /** abs: an absolutely placed scrap (left/top/width in % of its frame); rel: an in-flow block nudged by `cqh`. */
  mode: "abs" | "rel";
  left: number;
  top: number;
  width?: number;
  height?: number;
  /** The element's own transform when first touched, so turning it keeps any existing tilt. */
  base?: string;
  rotate?: number;
  /** Taken off the page (built-in pieces only; added ones are simply deleted). */
  hidden?: boolean;
};
export type Tweaks = { desktop: Record<string, Tweak>; phone: Record<string, Tweak> };

/** Something added from the edit mode's tray, drawn on one page of the journal. */
export type Addition = {
  id: string;
  /** Which page it sits on: the page kind, plus the photo or gallery it belongs to (see pageKey in diary-home). */
  page: string;
  type: "gem" | "star" | "butterfly" | "daisy" | "ring" | "splash" | "cutout" | "photo" | "note";
  /** Starting place and width, in % of the page; later drags are kept as tweaks. */
  x: number;
  y: number;
  w: number;
  variant?: string;
  src?: string;
  /** A note's words, or a picture's description for screen readers. */
  text?: string;
};

export const emptyTweaks = (): Tweaks => ({ desktop: {}, phone: {} });
export const layouts = { desktop: "(min-width:701px)", phone: "(max-width:700px)" } as const;

const n = (value: number) => Number(value.toFixed(2));

function declarations(t: Tweak, editing: boolean) {
  if (t.hidden) return editing ? "opacity:.25!important;outline:1px dashed #74382d" : "display:none!important";
  const out = t.mode === "abs"
    ? [`left:${n(t.left)}%`, `top:${n(t.top)}%`, "right:auto", "bottom:auto", "margin:0"]
    : ["position:relative", `left:${n(t.left)}cqh`, `top:${n(t.top)}cqh`];
  if (t.width !== undefined) out.push(`width:${n(t.width)}%`, ...(t.mode === "rel" ? ["max-width:none"] : []));
  if (t.height !== undefined) out.push(`height:${n(t.height)}%`);
  if (t.rotate) out.push(`transform:${t.base && t.base !== "none" ? `${t.base} ` : ""}rotate(${n(t.rotate)}deg)`);
  return out.map(d => `${d}!important`).join(";");
}

/** scope picks which state the rules apply in: saved rules stand down while the editor shows its live copy. */
export function tweaksCss(tweaks: Tweaks, scope: string) {
  return (Object.keys(layouts) as (keyof Tweaks)[]).map(layout => {
    const rules = Object.entries(tweaks[layout]).map(([selector, t]) => `.diary-app${scope} ${selector}{${declarations(t, scope === "[data-editing]")}}`);
    return rules.length ? `@media${layouts[layout]}{\n${rules.join("\n")}\n}` : "";
  }).filter(Boolean).join("\n");
}
