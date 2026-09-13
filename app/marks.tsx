/** Small hand-drawn SVG marks used across the page. All are decorative. */

type MarkProps = { className?: string };

export function Underline({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M4 12c38-7 76-9 118-7s72 7 104 5 46-6 70-9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M10 17c48-4 96-5 148-3s78 3 132-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

export function Ring({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M33 5C18 3 6 10 6 20s12 16 27 16 26-6 26-16S45 6 28 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowDown({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 24 40" aria-hidden="true" focusable="false">
      <path d="M12 3c-4 9 3 17 0 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 28c3 3 5 6 7 9 2-3 4-6 7-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 40 20" aria-hidden="true" focusable="false">
      <path d="M3 11c9-3 18 2 34-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M29 3c3 2 6 4 8 6-3 2-6 5-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUp({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 24 40" aria-hidden="true" focusable="false">
      <path d="M12 37c4-9-3-17 0-32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 12c3-3 5-6 7-9 2 3 4 6 7 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Leaf({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M6 34C7 19 18 8 34 6c-1 16-11 27-28 28z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 32C15 24 22 17 31 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".65" />
      <path d="M13 26c3-1 5-2 8-4M18 20c2-1 4-1 6-3" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".45" />
    </svg>
  );
}

export function Squiggle({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 80 24" aria-hidden="true" focusable="false">
      <path d="M4 14c6-9 10-9 15 0s10 9 15 0 10-9 15 0 10 9 15 0 8-7 12-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Asterisk({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3v18M4 7l16 10M20 7L4 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Tape({ className }: MarkProps) {
  return <span className={`tape ${className ?? ""}`} aria-hidden="true" />;
}
