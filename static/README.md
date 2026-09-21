# Static version of the site

Plain HTML, CSS and JavaScript. No build step, no framework, no database.
Upload this folder as-is to any static host (GitHub Pages, Cloudflare Pages, Netlify), or open `index.html` in a browser.

## Files

| File | Page |
| --- | --- |
| `index.html` | Home (the desk with the About / Projects / Hobbies / Say hello window) |
| `projects.html` | Project archive |
| `daily-cafe.html`, `floraquest.html`, `energy-changes.html` | One page per project |
| `outside.html` | Visual diary |
| `lab.html` | Motion and 3D experiment (not linked from the other pages, and has no styles yet, same as the original) |

| Folder | Contents |
| --- | --- |
| `css/reset.css` | Browser reset (the base layer the original build got from Tailwind). Leave as is. |
| `css/site.css` | All the site's styles. This is the file to edit for look and layout. |
| `js/home.js` | Panel switching and keyboard shortcuts on the home page |
| `js/reveal.js` | Fade-up effect for the project tiles |
| `js/lab.js`, `js/lab-scene.js` | Animations and the 3D scene on the lab page |
| `images/` | Every picture, the favicon and the social preview image |
| `vendor/` | Third-party libraries used only by the lab page (Motion, three.js) |

## Editing

- Text and links: edit the HTML file for that page directly.
- The header, footer and contact band are repeated in each page. A change to them needs making in every file.
- The four home-page panels live at the bottom of `index.html` inside `<template>` tags.
- Fonts load from Google Fonts via the `<link>` in each page's `<head>`.

## Notes

- Links between pages are relative (`projects.html`, `images/…`), so the folder works at a domain root or in a sub-folder.
- The lab page's 3D scene uses a JavaScript module, which browsers block when a page is opened from disk. It works once the folder is served by any web server or host.
- This folder is published to GitHub Pages at https://tammanakapoor.github.io from the `main` branch of the tammanakapoor.github.io repo. GitHub rebuilds it on every push. If a build fails under the repo's Actions tab with "in progress deployment", GitHub has a stuck deployment: wait ten minutes and push again.
