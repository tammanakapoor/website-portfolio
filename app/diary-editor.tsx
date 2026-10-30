"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { emptyTweaks, layouts, tweaksCss } from "./diary-tweaks-css";
import type { Addition, Tweak, Tweaks } from "./diary-tweaks-css";
import "./diary-editor.css";

/**
 * Localhost-only edit mode for the journal: drag scraps around, resize and turn them, double-click
 * words to retype them, and add or remove things. Saving writes the placements to app/diary-tweaks.json/.css,
 * added things to app/diary-additions.json and the words straight into the source, through the dev
 * server's /__diary-edit endpoint.
 */
type TextEdit = { from: string; to: string };
type Picked = { el: HTMLElement; key: string; name: string };
type Gesture = { kind: "move" | "size" | "turn"; p: Picked; x: number; y: number; start: Tweak; frame: { w: number; h: number }; centre: { x: number; y: number }; angle: number; distance: number };

type Art = Pick<Addition, "type" | "variant" | "src" | "text">;
type Template = Art & { w: number };
type Library = { cutouts: string[]; photos: string[]; added: string[] };

const ENDPOINT = "/__diary-edit";
const stickers: Template[] = [
  ...["diamond", "heart", "round"].flatMap(shape => ["ice", "rose", "emerald", "amethyst", "amber"].map(tone => ({ type: "gem" as const, variant: `${shape}-${tone}`, w: 8 }))),
  { type: "star", w: 9 }, { type: "butterfly", w: 12 }, { type: "daisy", w: 10 },
];
const stains: Template[] = [{ type: "ring", variant: "1", w: 26 }, { type: "ring", variant: "2", w: 26 }, { type: "ring", variant: "3", w: 26 }, { type: "splash", variant: "1", w: 30 }, { type: "splash", variant: "2", w: 30 }];
const nameOf = (src: string) => src.split("/").pop()!.replace(/\.\w+$/, "").replace(/(-cutout)?-[a-z0-9]{6,}$/, "").replace(/-/g, " ");
const STORE = "dy-editing";

function layoutNow(): keyof Tweaks { return matchMedia(layouts.phone).matches ? "phone" : "desktop"; }
function inner(el: Element | null) { return el?.closest<HTMLElement>(".dy-spread .dy-leaf-inner") ?? null; }

function uniqueClass(el: Element, scope: HTMLElement) {
  return [...el.classList].reverse().find(c => scope.getElementsByClassName(c).length === 1);
}
/** A selector that finds this element again on its kind of page, even after the page re-renders. */
function selectorFor(el: Element, scope: HTMLElement): string | null {
  const cls = uniqueClass(el, scope);
  if (cls) return `.${CSS.escape(cls)}`;
  const parent = el.parentElement;
  if (!parent || parent === scope) return null;
  const up = selectorFor(parent, scope);
  if (!up) return null;
  const index = [...parent.children].filter(s => s.tagName === el.tagName).indexOf(el) + 1;
  return `${up} > ${el.tagName.toLowerCase()}:nth-of-type(${index})`;
}
function describe(el: HTMLElement) {
  const added = [...el.classList].find(c => /^dy-added-/.test(c))?.slice(9);
  if (added) return added === "note" ? `note: ${el.textContent?.trim().slice(0, 40)}` : `added ${({ gem: "gem sticker", ring: "coffee ring", splash: "tea stain" } as Record<string, string>)[added] ?? added}`;
  const sticker = [...el.classList].find(c => /^dy-sticker-/.test(c))?.slice(11);
  if (sticker) return `sticker: ${sticker.replace(/-/g, " ")}`;
  const img = el.querySelector("img");
  const label = el.getAttribute("aria-label") || img?.alt || el.textContent?.trim();
  return (label || [...el.classList].pop() || el.tagName.toLowerCase()).slice(0, 48);
}
/** The piece a press should move: the outermost absolutely placed scrap, else the top-level block. */
function movable(target: EventTarget | null): Picked | null {
  if (!(target instanceof Element)) return null;
  const scope = inner(target);
  if (!scope) return null;
  const root = scope.firstElementChild;
  let absolute: HTMLElement | null = null, block: HTMLElement | null = null;
  for (let el: Element | null = target; el && el !== scope; el = el.parentElement) {
    if (!(el instanceof HTMLElement || el instanceof SVGElement) || el.classList.contains("dy-additions")) continue;
    const html = el as HTMLElement;
    if (getComputedStyle(html).position === "absolute") absolute = html;
    if (el.parentElement === root) block = html;
  }
  const el = absolute ?? block;
  if (!el) return null;
  const kind = [...(scope.closest(".dy-leaf")?.classList ?? [])].find(c => c.startsWith("dy-kind-"));
  const selector = selectorFor(el, scope);
  if (!kind || !selector) return null;
  return { el, key: `.${kind} ${selector}`, name: describe(el) };
}

/** Every piece under a point, top first, so Option-click can reach one tucked behind another. */
function piecesAt(x: number, y: number): Picked[] {
  const seen = new Set<Element>();
  return document.elementsFromPoint(x, y).flatMap(el => {
    const found = movable(el);
    if (!found || seen.has(found.el)) return [];
    seen.add(found.el);
    return [found];
  });
}

/** Where the element sits now, in the units the saved rule will use. */
function measure(el: HTMLElement): { tweak: Tweak; frame: { w: number; h: number } } {
  const cs = getComputedStyle(el);
  const book = el.closest<HTMLElement>(".dy-open-book");
  const unit = (book?.offsetHeight ?? 600) / 100;
  if (cs.position !== "absolute") {
    const left = cs.position === "relative" ? parseFloat(cs.left) || 0 : 0;
    const top = cs.position === "relative" ? parseFloat(cs.top) || 0 : 0;
    const parentW = el.parentElement?.clientWidth || 1;
    return { tweak: { mode: "rel", left: left / unit, top: top / unit, width: parseFloat(cs.width) / parentW * 100, base: cs.transform, rotate: 0 }, frame: { w: unit, h: unit } };
  }
  // A 100% inset reads back as the frame's size in px.
  const saved = [el.style.left, el.style.top, el.style.height];
  el.style.left = "100%"; el.style.top = "100%";
  const w = parseFloat(getComputedStyle(el).left), h = parseFloat(getComputedStyle(el).top);
  el.style.left = saved[0]; el.style.top = saved[1];
  const left = parseFloat(cs.left) + parseFloat(cs.marginLeft), top = parseFloat(cs.top) + parseFloat(cs.marginTop);
  const width = parseFloat(cs.width), height = parseFloat(cs.height);
  el.style.height = "auto";
  const fixedHeight = Math.abs(parseFloat(getComputedStyle(el).height) - height) > 1;
  el.style.height = saved[2];
  return { tweak: { mode: "abs", left: left / w * 100, top: top / h * 100, width: width / w * 100, height: fixedHeight ? height / h * 100 : undefined, base: cs.transform, rotate: 0 }, frame: { w: w / 100, h: h / 100 } };
}

/** Shrinks a picture to at most 1400px and returns it as WebP, noting whether it has see-through parts (a cut-out). */
async function prepare(file: File): Promise<{ data: string; cutout: boolean }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const alpha = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let cutout = false;
  for (let i = 3; i < alpha.length; i += 16) if (alpha[i] < 250) { cutout = true; break; }
  return { data: canvas.toDataURL("image/webp", 0.86), cutout };
}

export default function DiaryEditor({ art }: { art: (item: Art) => ReactNode }) {
  const [on, setOn] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [texts, setTexts] = useState<TextEdit[]>([]);
  const [moved, setMoved] = useState(0);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const tweaks = useRef<Tweaks>(emptyTweaks());
  const touched = useRef(new Set<string>());
  const pickedRef = useRef<Picked | null>(null);
  const style = useRef<HTMLStyleElement | null>(null);
  const hoverBox = useRef<HTMLDivElement>(null);
  const pickBox = useRef<HTMLDivElement>(null);
  const hovered = useRef<HTMLElement | null>(null);
  const added = useRef<Addition[]>([]);
  const [library, setLibrary] = useState<Library>({ cutouts: [], photos: [], added: [] });
  const [tray, setTray] = useState(false);
  const [placing, setPlacing] = useState<Template | null>(null);
  const placingRef = useRef<Template | null>(null);
  const saveRef = useRef<(reload: boolean) => Promise<void>>(async () => {});
  const upload = useRef<HTMLInputElement>(null);

  useEffect(() => { try { if (sessionStorage.getItem(STORE)) setOn(true); } catch {} }, []);
  useEffect(() => { pickedRef.current = picked; }, [picked]);
  useEffect(() => { placingRef.current = placing; document.documentElement.classList.toggle("dy-placing", !!placing); }, [placing]);

  useEffect(() => {
    if (!on) return;
    const app = document.querySelector<HTMLElement>(".diary-app");
    if (!app) return;
    try { sessionStorage.setItem(STORE, "1"); } catch {}
    app.setAttribute("data-editing", "");
    const sheet = document.createElement("style");
    document.head.append(sheet);
    style.current = sheet;
    const paint = () => { sheet.textContent = tweaksCss(tweaks.current, "[data-editing]"); };
    fetch(ENDPOINT).then(r => r.json()).then((saved: { tweaks: Tweaks; additions: Addition[]; library: Library }) => {
      tweaks.current = { ...emptyTweaks(), ...saved.tweaks };
      added.current = saved.additions;
      setLibrary(saved.library);
      paint();
    }).catch(() => setNote("Couldn't load saved placements. Is this the dev server?"));

    let gesture: Gesture | null = null;
    let frameId = 0;

    const tweakFor = (p: Picked) => {
      const layout = layoutNow();
      const measured = measure(p.el);
      const existing = tweaks.current[layout][p.key];
      return { tweak: existing ? { ...existing } : measured.tweak, frame: measured.frame, layout };
    };
    const commit = (p: Picked, t: Tweak, layout: keyof Tweaks) => {
      tweaks.current[layout][p.key] = t;
      touched.current.add(`${layout} ${p.key}`);
      setMoved(touched.current.size);
      paint();
    };
    const begin = (kind: Gesture["kind"], p: Picked, event: PointerEvent) => {
      const { tweak, frame } = tweakFor(p);
      const box = p.el.getBoundingClientRect();
      const centre = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
      const book = p.el.closest<HTMLElement>(".dy-open-book");
      const scale = book ? book.getBoundingClientRect().width / book.offsetWidth : 1;
      gesture = { kind, p, x: event.clientX, y: event.clientY, start: tweak, frame: { w: frame.w * scale, h: frame.h * scale }, centre, angle: Math.atan2(event.clientY - centre.y, event.clientX - centre.x), distance: Math.hypot(event.clientX - centre.x, event.clientY - centre.y) || 1 };
    };

    const onPointerDown = (event: PointerEvent) => {
      const handle = (event.target as Element).closest?.("[data-edit-handle]")?.getAttribute("data-edit-handle");
      const current = pickedRef.current;
      if (handle && current) { event.preventDefault(); begin(handle as Gesture["kind"], current, event); return; }
      if (!inner(event.target as Element)) return;
      if ((event.target as HTMLElement).isContentEditable) { event.stopPropagation(); return; }
      const template = placingRef.current;
      if (template) {
        event.preventDefault();
        event.stopPropagation();
        place(template, event);
        return;
      }
      event.stopPropagation();
      if (event.button !== 0) return;
      // Option-click goes one layer down from what's selected at that spot, round to the top again after the bottom.
      let found = movable(event.target);
      if (event.altKey) {
        const stack = piecesAt(event.clientX, event.clientY);
        const at = stack.findIndex(item => item.el === current?.el);
        found = stack.length ? stack[(at + 1) % stack.length] : found;
      }
      pickedRef.current = found;
      setPicked(found);
      if (!found) return;
      event.preventDefault();
      begin("move", found, event);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!gesture) {
        const found = movable(event.target);
        hovered.current = found?.el ?? null;
        return;
      }
      const g = gesture, p = g.p, t = { ...g.start }, layout = layoutNow();
      if (g.kind === "move") {
        t.left = g.start.left + (event.clientX - g.x) / g.frame.w;
        t.top = g.start.top + (event.clientY - g.y) / g.frame.h;
      } else if (g.kind === "size") {
        const factor = Math.max(0.15, Math.hypot(event.clientX - g.centre.x, event.clientY - g.centre.y) / g.distance);
        if (g.start.width !== undefined) t.width = g.start.width * factor;
        if (g.start.height !== undefined) t.height = g.start.height * factor;
        // Grow from the middle, so the scrap stays where it was.
        if (t.mode === "abs" && g.start.width !== undefined) t.left = g.start.left - (t.width! - g.start.width) / 2;
        if (t.mode === "abs" && g.start.height !== undefined) t.top = g.start.top - (t.height! - g.start.height) / 2;
      } else {
        const angle = Math.atan2(event.clientY - g.centre.y, event.clientX - g.centre.x);
        let rotate = (g.start.rotate ?? 0) + (angle - g.angle) * 180 / Math.PI;
        if (event.shiftKey) rotate = Math.round(rotate / 15) * 15;
        t.rotate = rotate;
      }
      commit(p, t, layout);
    };
    const onPointerUp = () => { gesture = null; };
    const onClick = (event: MouseEvent) => {
      if (!inner(event.target as Element) || (event.target as HTMLElement).isContentEditable) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!inner(target)) return;
      event.preventDefault();
      event.stopPropagation();
      const words = target.closest<HTMLElement>("p, h1, h2, h3, h4, li, span, em, strong, small, figcaption, blockquote, a, button");
      if (!words || !inner(words)) return;
      if (words.children.length || !words.textContent?.trim()) { setNote("That bit has styling inside it, so it can't be retyped here. Tell Claude what it should say."); return; }
      const from = words.textContent;
      words.contentEditable = "plaintext-only";
      words.focus();
      getSelection()?.selectAllChildren(words);
      setNote("Type the new words, then press Enter or click away.");
      const finish = () => {
        words.contentEditable = "false";
        words.removeAttribute("contenteditable");
        const to = (words.textContent ?? "").replace(/\s+/g, " ").trim();
        setNote("");
        if (!to || to === from.trim()) { words.textContent = from; return; }
        const note = words.closest<HTMLElement>(".dy-added");
        if (note) {
          // An added note keeps its words in diary-additions.json, so save it straight away.
          const id = [...note.classList].find(c => c.startsWith("dy-add-"))?.slice(7);
          added.current = added.current.map(item => item.id === id ? { ...item, text: to } : item);
          void saveRef.current(false);
          return;
        }
        setTexts(list => {
          const earlier = list.find(item => item.to === from);
          return earlier ? list.map(item => item === earlier ? { ...item, to } : item) : [...list, { from, to }];
        });
      };
      words.addEventListener("blur", finish, { once: true });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.isContentEditable) {
        event.stopPropagation();
        if (event.key === "Enter") { event.preventDefault(); target.blur(); }
        if (event.key === "Escape") target.blur();
        return;
      }
      const p = pickedRef.current;
      if (target.closest?.(".dy-editor")) return;
      if (event.key === "Escape") { setPicked(null); setPlacing(null); event.stopPropagation(); return; }
      if (!p) return;
      const nudge = event.shiftKey ? 1 : 0.25;
      const moves: Record<string, [number, number]> = { ArrowLeft: [-nudge, 0], ArrowRight: [nudge, 0], ArrowUp: [0, -nudge], ArrowDown: [0, nudge] };
      if (!(event.key in moves)) return;
      event.preventDefault();
      event.stopPropagation();
      const { tweak, layout } = tweakFor(p);
      tweak.left += moves[event.key][0];
      tweak.top += moves[event.key][1];
      commit(p, tweak, layout);
    };

    /** Drops a new thing from the tray where the page was clicked, then saves so the page draws it. */
    const place = (template: Template, event: PointerEvent) => {
      const leaf = (event.target as Element).closest<HTMLElement>(".dy-leaf");
      const layer = leaf?.querySelector<HTMLElement>(".dy-additions");
      if (!leaf?.dataset.page || !layer) return;
      const r = layer.getBoundingClientRect();
      const tall = template.type === "note" ? 0.3 : 1;
      // Keep it on the page, even when dropped right by the edge.
      const x = Math.max(0, Math.min(100 - template.w, (event.clientX - r.left) / r.width * 100 - template.w / 2));
      const y = Math.max(0, Math.min(92, (event.clientY - r.top) / r.height * 100 - template.w * r.width / r.height / 2 * tall));
      const { w, ...rest } = template;
      const id = Date.now().toString(36);
      added.current = [...added.current, { id, page: leaf.dataset.page, ...rest, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, w }];
      setPlacing(null);
      setNote("Added. Drag it to fine-tune.");
      void saveRef.current(false);
    };

    // Keep the outlines glued to their scraps through page turns and resizes.
    const outline = (box: HTMLDivElement | null, el: HTMLElement | null) => {
      if (!box) return;
      if (!el || !el.isConnected) { box.style.display = "none"; return; }
      const r = el.getBoundingClientRect();
      Object.assign(box.style, { display: "block", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    };
    const tick = () => {
      const p = pickedRef.current;
      if (p && !p.el.isConnected) {
        // The page re-rendered: find the same piece again by its selector.
        const again = document.querySelector<HTMLElement>(`.dy-spread ${p.key}`);
        if (again) p.el = again; else setPicked(null);
      }
      outline(pickBox.current, p?.el ?? null);
      outline(hoverBox.current, hovered.current === p?.el ? null : hovered.current);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    const options = { capture: true };
    document.addEventListener("pointerdown", onPointerDown, options);
    document.addEventListener("pointermove", onPointerMove, options);
    document.addEventListener("pointerup", onPointerUp, options);
    document.addEventListener("click", onClick, options);
    document.addEventListener("dblclick", onDoubleClick, options);
    document.addEventListener("keydown", onKeyDown, options);
    document.addEventListener("touchstart", stopInBook, options);
    document.addEventListener("touchend", stopInBook, options);
    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("pointerdown", onPointerDown, options);
      document.removeEventListener("pointermove", onPointerMove, options);
      document.removeEventListener("pointerup", onPointerUp, options);
      document.removeEventListener("click", onClick, options);
      document.removeEventListener("dblclick", onDoubleClick, options);
      document.removeEventListener("keydown", onKeyDown, options);
      document.removeEventListener("touchstart", stopInBook, options);
      document.removeEventListener("touchend", stopInBook, options);
      app.removeAttribute("data-editing");
      sheet.remove();
      hovered.current = null;
      document.documentElement.classList.remove("dy-placing");
    };
  }, [on]);

  const repaint = () => { if (style.current) style.current.textContent = tweaksCss(tweaks.current, "[data-editing]"); };
  const addedId = (p: Picked) => [...p.el.classList].find(c => c.startsWith("dy-add-"))?.slice(7);

  function reset() {
    const p = picked;
    if (!p) return;
    const layout = layoutNow();
    delete tweaks.current[layout][p.key];
    touched.current.add(`${layout} ${p.key}`);
    setMoved(touched.current.size);
    repaint();
  }
  /** Added things are deleted for good; built-in ones are hidden, so Reset brings them back. */
  function remove() {
    const p = picked;
    if (!p) return;
    const id = addedId(p);
    setPicked(null);
    if (id) {
      added.current = added.current.filter(item => item.id !== id);
      for (const layout of Object.keys(layouts) as (keyof Tweaks)[]) delete tweaks.current[layout][p.key];
      void save(false);
      return;
    }
    const layout = layoutNow();
    tweaks.current[layout][p.key] = { ...(tweaks.current[layout][p.key] ?? measure(p.el).tweak), hidden: true };
    touched.current.add(`${layout} ${p.key}`);
    setMoved(touched.current.size);
    repaint();
    setNote("Hidden. Select it and press Reset this to bring it back.");
  }
  /** reload: after text edits, so the page is redrawn from the updated source; adding and removing just redraws. */
  async function save(reload = true) {
    setBusy(true);
    setNote(reload ? "Saving…" : "Adding…");
    try {
      const response = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tweaks: tweaks.current, texts, additions: added.current }) });
      const result: { missed: TextEdit[] } = await response.json();
      if (!response.ok) throw new Error();
      touched.current.clear();
      setMoved(0);
      setTexts(result.missed);
      setBusy(false);
      if (result.missed.length) { setNote(`Saved. ${result.missed.length} bit${result.missed.length > 1 ? "s" : ""} of text couldn't be found in the code. Tell Claude what to change.`); return; }
      if (!reload && !texts.length) { setNote("Saved. Drag it to fine-tune."); return; }
      setNote("Saved. Reloading…");
      setTimeout(() => location.reload(), 600);
    } catch {
      setNote("Couldn't save. Is the dev server still running?");
      setBusy(false);
    }
  }
  saveRef.current = save;
  async function uploadPhoto(file: File | undefined) {
    if (!file) return;
    setNote("Getting your photo ready…");
    try {
      const { data, cutout } = await prepare(file);
      const response = await fetch(`${ENDPOINT}/upload`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: file.name, data, cutout }) });
      const { src } = await response.json() as { src: string };
      setLibrary(lib => ({ ...lib, added: [...lib.added, src] }));
      setTray(false);
      setPlacing({ type: cutout ? "cutout" : "photo", src, text: nameOf(src), w: 24 });
      setNote("");
    } catch {
      setNote("Couldn't add that photo. Try a JPG, PNG or WebP.");
    }
  }
  function choose(template: Template) {
    setTray(false);
    setPicked(null);
    setPlacing(template);
  }
  function finish() {
    if ((moved || texts.length) && !confirm("You have unsaved changes. Leave edit mode and lose them?")) return;
    try { sessionStorage.removeItem(STORE); } catch {}
    if (moved || texts.length) { location.reload(); return; }
    setPicked(null);
    setPlacing(null);
    setOn(false);
  }

  if (!on) return <button type="button" className="dy-editor-toggle" onClick={() => setOn(true)}>✎ edit</button>;
  const changes = moved + texts.length;
  const pictures = (title: string, list: string[], type: "cutout" | "photo") => list.length > 0 && <section>
    <h3>{title}</h3>
    <div className="dy-tray-grid">{list.map(src => <button type="button" key={src} title={nameOf(src)} onClick={() => choose({ type: src.startsWith("/added/") ? src.includes("-cutout-") ? "cutout" : "photo" : type, src, text: nameOf(src), w: type === "cutout" ? 18 : 24 })}><img src={src} alt={nameOf(src)} loading="lazy"/></button>)}</div>
  </section>;
  return <>
    <div className="dy-edit-box dy-edit-hover" ref={hoverBox} aria-hidden="true"/>
    <div className="dy-edit-box dy-edit-picked" ref={pickBox} aria-hidden="true">
      {picked && <><span className="dy-edit-handle dy-edit-turn" data-edit-handle="turn" title="Drag to turn (hold Shift to snap)"/><span className="dy-edit-handle dy-edit-size" data-edit-handle="size" title="Drag to resize"/></>}
    </div>
    {tray && <div className="dy-tray" role="dialog" aria-label="Add something">
      <section>
        <h3>Words and your own photos</h3>
        <div className="dy-tray-actions">
          <button type="button" onClick={() => choose({ type: "note", text: "a little note", w: 30 })}>✎ Handwritten note</button>
          <button type="button" onClick={() => upload.current?.click()}>⇪ Photo from my computer</button>
          <input ref={upload} type="file" accept="image/*" hidden onChange={event => { void uploadPhoto(event.target.files?.[0]); event.target.value = ""; }}/>
        </div>
        <p className="dy-tray-hint">A PNG with a see-through background is placed as a cut-out. Want a background removed? Ask Claude.</p>
      </section>
      <section>
        <h3>Stickers</h3>
        <div className="dy-tray-grid dy-tray-small">{stickers.map(item => <button type="button" key={`${item.type}${item.variant ?? ""}`} title={item.variant ?? item.type} onClick={() => choose(item)}>{art(item)}</button>)}</div>
      </section>
      <section>
        <h3>Coffee and tea stains</h3>
        <div className="dy-tray-grid">{stains.map(item => <button type="button" key={`${item.type}${item.variant}`} title={`${item.type} ${item.variant}`} onClick={() => choose(item)}>{art(item)}</button>)}</div>
      </section>
      {pictures("Photos you added", library.added, "cutout")}
      {pictures("Cut-outs", library.cutouts, "cutout")}
      {pictures("Photos", library.photos, "photo")}
    </div>}
    <div className="dy-editor" role="region" aria-label="Edit mode">
      <p className="dy-editor-status">
        <strong>Editing the {layoutNow()} layout</strong>
        <span>{placing ? "Click on a page to put it there. Esc to cancel." : picked ? `Selected: ${picked.name}. Option-click again to go a layer deeper.` : "Drag anything on the page. Double-click words to retype them. Option-click to reach something tucked underneath."}</span>
        {note && <em>{note}</em>}
      </p>
      <button type="button" className={tray ? "dy-editor-on" : ""} onClick={() => { setTray(!tray); setPlacing(null); }} aria-expanded={tray}>+ Add</button>
      {picked && <button type="button" onClick={reset}>Reset this</button>}
      {picked && <button type="button" onClick={remove}>Remove</button>}
      <button type="button" className="dy-editor-save" onClick={() => save()} disabled={busy || !changes}>{changes ? `Save ${changes} change${changes > 1 ? "s" : ""}` : "Saved"}</button>
      <button type="button" onClick={finish}>Done</button>
    </div>
  </>;
}

/** Stops the book's own swipe-to-turn while a finger is dragging a scrap. */
function stopInBook(event: TouchEvent) {
  if (inner(event.target as Element)) event.stopPropagation();
}
