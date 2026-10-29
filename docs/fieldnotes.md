# Fieldnotes portfolio addition

Prepared from the owner's 28 October 2026 brief. Published to the main GitHub Pages website on 28 October 2026 in commit `19249bc1f228d82c3106d6a35cc6ea677d00ff72`. GitHub Pages deployment succeeded, and the archive card and public page were verified at https://tammanakapoor.github.io/fieldnotes.html. The journal version remains local. The deployed pages retain the existing live site's `.html` links and homepage.

- GitHub Pages: `static/projects.html` includes project No. 04, linking to `static/fieldnotes.html`. The Energy Changes next-project link now leads to Fieldnotes; Fieldnotes continues to Daily Café.
- Journal version: `app/projects/fieldnotes-data.ts` adds the project to the shared archive; `app/journal-notes.ts` supplies the condensed working notes. The full design-process copy remains in the expandable making-of notes. Four entries fit on the contents leaf.
- `static/css/fieldnotes.css` extends the existing paper, typography, chapter rows and findings table. The header, footer and contact section reuse the existing markup.
- The owner supplied the actual Explore screenshot on 28 October 2026. `public/fieldnotes-explore.png` and `static/images/fieldnotes-explore.png` retain the full original image, with accurate alt text. The static project page links to the full-resolution screenshot. The former placeholders have been removed. Screenshot publication commit: `d13068cbe499dec553ed35ed5023262e817f4480`.
- Fieldnotes stays labelled in development / private prototype. There is no public app link or App Store button. Inventory counts describe source records and species keys, not verified living trees or adoption. Outdoor collection, native photo upload/retrieval and retention after an update remain unverified.

## Validation

The production build passes. TypeScript reports only the existing missing Cloudflare runtime declarations in `db/index.ts` and `worker/index.ts`. Browser checks cover static desktop and phone layouts, archive navigation, image loading, section targets, keyboard activation, and the journal project route and contents. Local static previews need `.html` fallback for extensionless links, matching the existing GitHub Pages URLs.

## Journal finishing pass

Reviewed the public Fieldnotes case study and owner-supplied Explore screenshot. The journal includes a map detail clipped from that same original screenshot, a pressed botanical with a snail field label, an opening-page link, and a green accent. The existing continuous story, development status, exact-tree collection notes and verification boundaries are preserved. Four contents cards and the introduction were checked for separation from their footers on mobile. These changes are local to the journal and do not alter the published GitHub Pages portfolio.
