# Project journal pages

The project contents open one continuous story per project at `/projects/[slug]`. The entries in `app/journal-notes.ts` condense the existing project archive in `app/projects/data.ts`, with the full chapter text available in an expandable section on the same page. No diary dates, testing numbers or outcomes are invented.

Navigation uses normal links and document scrolling. The sticky header has an “All projects” link and a project selector; the footer links to the next project and back to the contents. `/#projects` opens the journal directly to its project contents, and `/projects` redirects there. The projects no longer occupy numbered leaves in the book.

Decorative objects sit beyond the reading column on desktop and move into the page flow on narrow screens. The newspaper is an original, newspaper-style project note labelled “From my worktable”, not a claim of external coverage. The receipt, coffee ring, metal clip and botanical scraps are decorative.

The Daily Café iPod and wired earbuds are real Three.js geometry, with a rotating body, gently moving earbuds, pointer tilt and an animated canvas display. No audio plays. The scene honours the page motion toggle and reduced-motion preference, avoids rendering while off screen or hidden, and disposes its renderer and resources on unmount. A CSS illustration remains if WebGL is unavailable. No model files or new generated images were required for these objects.

The user's nine journal photographs informed the warm paper, handwritten hierarchy, taped image clippings, crossed-out working notes, graph paper, striped backing paper, metal clips, keepsake tickets and occasional lace-paper insert. The reference photographs themselves are not published as site content.

Project screenshots and artwork come from the existing project assets. `public/journal-pages/daily-cafe-clipping.jpg` is a browser screenshot of the user's public Daily Café project, captured on 28 October 2026 after its opening animation completed.

## Generated asset

Built-in image generation was used for `public/journal-pages/ivory-paper-doily.png`. Its transparency is preserved. It is decorative; all journal writing is selectable HTML text. The asset was copied into the site workspace from the generated output.

Final generation prompt:

> Use case: product-mockup. Asset type: decorative transparent cutout for a personal digital scrapbook. A single antique rectangular ivory paper lace doily, photographed exactly from directly above, portrait ratio roughly 3:4, all edges visible with small transparent margin. Fine intricate punched-paper floral lace with scalloped edges, tiny holes, cream fibrous paper, softly yellowed age and subtle irregularities. Broad plain warm ivory central writing area occupying 65 percent of width and 75 percent of height, delicate ornate lace border. Soft daylight and minute natural self shadows in the paper fibers. Actual transparent alpha background around the whole object and through lace holes. Photorealistic physical paper stationery, no text, no symbols, no other objects, no dark background, no watermark.

## Verification

The Sites production build passes. A repository-wide TypeScript check reports existing missing Cloudflare runtime types in `db/index.ts` and `worker/index.ts`; no journal component errors were reported. The starter tests still assert the initial loading skeleton rather than this portfolio and are not suitable for verifying these pages.

Browser checks cover desktop and mobile scrolling, home-to-project navigation, return to the project contents, project selection, next-project links, expandable notes, image loading and the 3D iPod.

## Project contents links

The local journal contents now have separate black paper labels for reading each project's story and opening its live experience. Daily Café links to the café, FloraQuest to the game, and Energy Changes to the first Lumi experience. Fieldnotes retains its story link and is marked “private prototype”, because no public app URL is available. Project titles and thumbnails also open the story. External links open a new tab and have descriptive accessible names.

The cutout labels use cream serif text, slight alternating rotations, paper shadows, hover and keyboard focus states, and a minimum 16px label size. Short labels keep both actions on one row on small phones. Spacing was checked at 320 × 667 and 390 × 844, including separation from the footer. Keyboard activation opens the project story, its “All projects” link returns to the contents, and the café action opens the live café in a separate tab. The production build passes. These changes remain in the local journal preview.

## Hello collage

`app/hello-journal.tsx` and its scoped CSS create the two hello leaves. Both use the existing lace doily and lace-bow assets, blue and rose striped cuttings, botanical cutouts, gingham, a personal photo strip, a postage stamp, a wax seal, foil stars and small paper labels. Decorative cuttings are hidden from assistive technology. The envelope is a keyboard-accessible button: it opens the contact note on mobile and focuses the email link on desktop. Copy email keeps the journal’s existing status feedback. Desktop and mobile rendering, envelope navigation and copy feedback were checked in the browser.
