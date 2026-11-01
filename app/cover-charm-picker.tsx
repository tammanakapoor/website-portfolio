import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { charmCuts, charmNames, charmPreviewEvent, charmSheet, keptCharms } from "./cover-charms";
import "./cover-charm-picker.css";

// Localhost-only picker for the charms on the cover's elastic. Tapping a charm hangs it or takes it off, and the
// cover shows the change straight away; Save writes the choice to app/cover-charms.json through the edit plugin.

const thumb = 54;

function Thumb({ name }: { name: string }) {
  const [x, y, w, h] = charmCuts[name], scale = thumb / Math.max(w, h);
  return <span className="cp-thumb" aria-hidden="true" style={{
    width: w * scale, height: h * scale, backgroundImage: `url(${charmSheet.src})`,
    backgroundSize: `${charmSheet.width * scale}px ${charmSheet.height * scale}px`, backgroundPosition: `${-x * scale}px ${-y * scale}px`,
  } as CSSProperties}/>;
}

export default function CoverCharmPicker() {
  const [on, setOn] = useState(false);
  const [keep, setKeep] = useState(keptCharms);
  const [saved, setSaved] = useState(keptCharms);
  const [note, setNote] = useState("");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    dispatchEvent(new CustomEvent(charmPreviewEvent, { detail: keep }));
  }, [keep]);

  const changed = keep.join() !== saved.join();
  const toggle = (name: string) => { setNote(""); setKeep(list => list.includes(name) ? list.filter(n => n !== name) : [...list, name]); };

  async function save() {
    setNote("Saving…");
    try {
      const response = await fetch("/__diary-edit/charms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ keep }) });
      if (!response.ok) throw new Error(String(response.status));
      setSaved(keep); setNote("Saved. Deploy when you’re happy.");
    } catch {
      setNote("Couldn’t save. Is the dev server running?");
    }
  }

  if (!on) return <button type="button" className="cp-toggle" onClick={() => setOn(true)}>✎ charms</button>;
  return <div className="cp-panel" role="region" aria-label="Cover charms">
    <p className="cp-title">Charms on the elastic</p>
    <p className="cp-hint">Tap to hang or take off. They hang left to right in the order you pick them.</p>
    <div className="cp-grid">
      {charmNames.map(name => {
        const at = keep.indexOf(name);
        return <button key={name} type="button" className="cp-charm" aria-pressed={at >= 0} onClick={() => toggle(name)} title={name}>
          <Thumb name={name}/>{at >= 0 && <span className="cp-order">{at + 1}</span>}<span className="cp-name">{name.replace(/-/g, " ")}</span>
        </button>;
      })}
    </div>
    {note && <p className="cp-note" role="status">{note}</p>}
    <div className="cp-actions">
      <button type="button" onClick={() => setKeep([])} disabled={!keep.length}>Clear</button>
      <button type="button" onClick={() => { setKeep(saved); setNote(""); }} disabled={!changed}>Undo</button>
      <button type="button" className="cp-save" onClick={save} disabled={!changed}>{changed ? "Save" : "Saved"}</button>
      <button type="button" onClick={() => setOn(false)}>Close</button>
    </div>
  </div>;
}
