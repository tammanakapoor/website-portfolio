import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import type { IncomingMessage } from "node:http";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { emptyTweaks, tweaksCss } from "../app/diary-tweaks-css";
import type { Addition, Tweaks } from "../app/diary-tweaks-css";

type TextEdit = { from: string; to: string };

// Where the journal's words live, so a retyped line can be written back to its source.
const textSources = ["app/diary-home.tsx", "app/journal-notes.ts", "app/projects/data.ts", "app/project-folder.tsx", "app/diary-cover-copy.ts"];
const header = "/* Placements saved from the localhost edit mode (app/diary-editor.tsx). Generated from diary-tweaks.json: edit there, or drag on localhost. */\n";

async function body(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/** Curly quotes and no braces or angle brackets, so the new words are safe in a string or in JSX. */
function tidy(text: string) {
  return text.replace(/(^|[\s(])"/g, "$1“").replace(/"/g, "”").replace(/(^|[\s(])'/g, "$1‘").replace(/'/g, "’").replace(/[{}<>]/g, "");
}

/** Pictures the tray offers, as site paths. */
async function pictures(root: string, folder: string, pattern: RegExp) {
  const names = await readdir(resolve(root, "public", folder)).catch(() => [] as string[]);
  return names.filter(name => pattern.test(name)).sort().map(name => `/${folder}/${name}`);
}

// Saves what the dev-only journal edit mode changes: placements to app/diary-tweaks.*, added things to
// app/diary-additions.json, uploaded photos to public/added, and retyped words into the source.
export function diaryEdit(): Plugin {
  let root = process.cwd();

  return {
    name: "diary-edit",
    apply: "serve",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      const json = resolve(root, "app/diary-tweaks.json");
      const additionsJson = resolve(root, "app/diary-additions.json");
      server.middlewares.use("/__diary-edit", async (request, response) => {
        const reply = (status: number, value: unknown) => {
          response.statusCode = status;
          response.setHeader("content-type", "application/json");
          response.end(JSON.stringify(value));
        };
        try {
          if (request.method === "GET") {
            return reply(200, {
              tweaks: JSON.parse(await readFile(json, "utf8")),
              additions: JSON.parse(await readFile(additionsJson, "utf8").catch(() => "[]")),
              library: { cutouts: await pictures(root, "cutouts", /\.(webp|png)$/), photos: await pictures(root, "visual-diary", /\.(jpe?g|webp|png)$/), added: await pictures(root, "added", /\.(webp|png|jpe?g)$/) },
            });
          }
          if (request.method !== "POST") return reply(405, { error: "GET or POST only" });
          if (request.url?.startsWith("/upload")) {
            const { name, data, cutout } = (await body(request)) as { name: string; data: string; cutout: boolean };
            const match = /^data:image\/webp;base64,(.+)$/.exec(data);
            if (!match) return reply(400, { error: "Expected a WebP picture" });
            const slug = name.replace(/\.\w+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "photo";
            const file = `${slug}${cutout ? "-cutout" : ""}-${Date.now().toString(36)}.webp`;
            await mkdir(resolve(root, "public/added"), { recursive: true });
            await writeFile(resolve(root, "public/added", file), Buffer.from(match[1], "base64"));
            return reply(200, { src: `/added/${file}` });
          }
          const { tweaks, texts, additions } = (await body(request)) as { tweaks: Tweaks; texts: TextEdit[]; additions?: Addition[] };
          if (additions) await writeFile(additionsJson, `${JSON.stringify(additions, null, 2)}\n`);
          const clean: Tweaks = { ...emptyTweaks(), desktop: tweaks.desktop ?? {}, phone: tweaks.phone ?? {} };
          await writeFile(json, `${JSON.stringify(clean, null, 2)}\n`);
          await writeFile(resolve(root, "app/diary-tweaks.css"), `${header}${tweaksCss(clean, ":not([data-editing])")}\n`);

          const missed: TextEdit[] = [];
          const files = new Map<string, string>();
          for (const path of textSources) files.set(path, await readFile(resolve(root, path), "utf8").catch(() => ""));
          for (const edit of texts ?? []) {
            const variants = [edit.from, edit.from.replace(/'/g, "&apos;"), edit.from.replace(/'/g, "’"), edit.from.replace(/’/g, "'")];
            const hits = [...files].flatMap(([path, source]) => variants.filter((v, i) => variants.indexOf(v) === i).flatMap(v => source.split(v).length - 1 ? [{ path, v, count: source.split(v).length - 1 }] : []));
            if (hits.length !== 1 || hits[0].count !== 1) { missed.push(edit); continue; }
            const { path, v } = hits[0];
            files.set(path, files.get(path)!.replace(v, () => tidy(edit.to)));
            await writeFile(resolve(root, path), files.get(path)!);
          }
          reply(200, { missed });
        } catch (error) {
          reply(500, { error: String(error) });
        }
      });
    },
  };
}
