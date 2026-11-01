import saved from "./cover-charms.json";

// Gold charms that can hang from the cover's elastic, each cut from one sheet (public/journal-3d/charms.webp)
// as a pixel rect: [x, y, width, height]. Which ones hang, and in what order, is saved in cover-charms.json,
// chosen with the charm picker on localhost (app/cover-charm-picker.tsx).
export const charmSheet = { src: "/journal-3d/charms.webp", width: 512, height: 642 };

export const charmCuts: Record<string, [number, number, number, number]> = {
  bow: [6, 319, 108, 119], key: [82, 6, 129, 155], ace: [217, 6, 85, 146], "sun-coin": [308, 6, 102, 135],
  padlock: [198, 319, 83, 113], "heart-clasp": [6, 6, 70, 167], "dog-tag": [117, 179, 106, 131], coin: [350, 179, 82, 125],
  "sparkle-tag": [372, 319, 79, 106], emerald: [6, 444, 90, 105], medallion: [102, 444, 156, 96], handbag: [333, 444, 102, 93],
  wing: [229, 179, 115, 128], heel: [120, 319, 72, 116], "cross-coin": [287, 319, 79, 110], "ornate-cross": [6, 179, 105, 134],
  "little-cross": [264, 444, 63, 96], cross: [6, 555, 109, 81],
};

export const charmNames = Object.keys(charmCuts);

/** The charms on the cover, left to right. */
export const keptCharms: string[] = saved.keep.filter(name => name in charmCuts);

/** The picker sends this event with the names it wants, so the cover can show them before they are saved. */
export const charmPreviewEvent = "diary-cover-charms";
