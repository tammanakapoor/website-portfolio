import "./hello-journal.css";

function PaperStars({ className = "" }: { className?: string }) {
  return <span className={`hl-stars ${className}`} aria-hidden="true"><i/><i/><i/></span>;
}

function Postmark({ className = "" }: { className?: string }) {
  return <span className={`hl-postmark ${className}`} aria-hidden="true"><span>LONDON &<br/><b>♡</b><br/>A LITTLE CURIOSITY</span><i/><i/><i/></span>;
}

export function HelloArtwork({ onRead }: { onRead: () => void }) {
  return <div className="hl-art">
    <div className="hl-art-decor" aria-hidden="true">
      <span className="hl-stripe-cutting hl-stripe-blue"/>
      <span className="hl-gingham-cutting"/>
      <img className="hl-art-doily" src="/journal-pages/ivory-paper-doily.png" alt=""/>
      <div className="hl-poem-scrap"><span>ON THE ART OF SMALL THINGS</span><p>a note, a thought,<br/>a hello.<br/>sometimes that’s<br/>how it begins.</p><i>collected with curiosity</i></div>
      <div className="hl-photo-strip"><img src="/visual-diary/regents-canal.jpg" alt=""/><img src="/visual-diary/barbican-pond.jpg" alt=""/><span>little moments, kept.</span></div>
      <img className="hl-botanical-tall" src="/sketchbook/botany-right.png" alt=""/>
      <img className="hl-art-bloom" src="/sketchbook/bloom.png" alt=""/>
      <img className="hl-lace-bow" src="/journal-3d/ivory-lace-bow.png" alt=""/>
      <span className="hl-tape hl-tape-pink"/>
      <span className="hl-cutout-label"><span>good things</span><span>start here.</span></span>
      <span className="hl-admit-ticket">ADMIT ONE<br/><b>A LITTLE HELLO</b><br/>NO OCCASION NEEDED</span>
      <PaperStars/>
      <span className="hl-paperclip"/>
    </div>
    <p className="hl-art-heading">a little post from my corner of the world</p>
    <button className="hl-envelope" onClick={onRead} aria-label="Read my hello note">
      <span className="hl-letter"><span>Dear fellow<br/>curious person,</span><span>Good things start<br/>with a little hello.</span><span>with a little wonder,<br/>Tammana ♡</span></span>
      <span className="hl-envelope-back"/>
      <span className="hl-envelope-front"/>
      <span className="hl-envelope-seal" aria-hidden="true">♡</span>
      <span className="hl-stamp" aria-hidden="true"><img src="/sketchbook/bloom.png" alt=""/><span>A LITTLE JOY</span></span>
      <Postmark/>
    </button>
    <button className="hl-open-note" onClick={onRead}>open a little hello ↗</button>
  </div>;
}

export function HelloNote({ onCopy }: { onCopy: () => void }) {
  return <div className="hl-note-page">
    <div className="hl-note-decor" aria-hidden="true">
      <span className="hl-stripe-cutting hl-stripe-rose"/>
      <img className="hl-note-doily" src="/journal-pages/ivory-paper-doily.png" alt=""/>
      <img className="hl-note-lace" src="/journal-3d/ivory-lace-bow.png" alt=""/>
      <span className="hl-floral-paper"/>
      <img className="hl-note-flowers" src="/sketchbook/botany-left.png" alt=""/>
      <PaperStars className="hl-note-stars"/>
      <span className="hl-tiny-label">a small note,<br/>a lovely beginning.</span>
      <Postmark className="hl-note-postmark"/>
    </div>
    <section className="hl-contact-card" aria-labelledby="hl-contact-title">
      <span className="hl-tape hl-tape-sage" aria-hidden="true"/>
      <p className="hl-card-kicker">LEAVE A LITTLE HELLO</p>
      <h2 id="hl-contact-title">So lovely<br/><em>to find you here.</em></h2>
      <p>Have an idea, a question, or a little something you’d like to share?</p>
      <p>I’d love to hear from you.</p>
      <div className="hl-address-slip"><span>send a little note to</span><a id="hello-email" href="mailto:tammana4513@gmail.com">tammana4513@gmail.com <span aria-hidden="true">↗</span></a><button onClick={onCopy}>Copy email address</button></div>
      <p className="hl-card-signoff">Until the next little adventure,<br/><span>Tammana ♡</span></p>
    </section>
    <span className="hl-bottom-cutouts" aria-hidden="true"><span>ideas.</span><span>questions.</span><span>little hellos.</span></span>
  </div>;
}
