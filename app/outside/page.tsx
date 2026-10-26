import CameraRoll from "../camera-roll";
import type { Metadata } from "next";
import { ContactBand, Footer, TopBar } from "../chrome";
import { ArrowRight } from "../marks";

export const metadata: Metadata = {
  title: "Outside the screen — Tammana Kapoor",
  description: "Photographs from away from the screen: embroidery, sketching, walking and London.",
};

export default function OutsidePage() {
  return (
    <main id="top" className="subpage desk-subpage">
      <TopBar current="outside" />

      <div className="subpage-window page-shell">
        <div className="subpage-titlebar">
          <span className="subpage-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>tammana / outside the screen</span>
          <a href="/" aria-label="Return home">×</a>
        </div>
        <div className="subpage-window-content">
          <header className="page-header page-header-short">
            <p className="section-kicker">Outside the screen · visual diary</p>
            <h1>A diary of <span className="subpage-script">small things.</span></h1>
            <p className="page-intro">A quiet collection of things I make, notice and pick up along the way—one frame at a time.</p>
        </header>

          <CameraRoll />

          <p className="back-link"><a className="text-link" href="/">Back to the desk <ArrowRight className="arrow-inline" /></a></p>
        </div>
      </div>

      <ContactBand />
      <Footer />
    </main>
  );
}
