// Baut index.html als eine Datei: Schrift, Bilder, Logo, Karte und Favicon werden eingebettet.
//   node _quelle/bauen.mjs
// Die Karte kommt aus dem Nachbar-Repo ../yabis (karte.mjs + karte-daten.json aus OpenStreetMap).
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { karte, KARTE_NACHWEIS } from "../../yabis/_quelle/karte.mjs";
import { Y_STUECKE, SCHEMA_BETRIEB } from "../../yabis/_quelle/helfer.mjs";
import * as VB from "./verlegebilder.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = join(HIER, "..");
const datenUri = (pfad, typ) => `data:${typ};base64,${readFileSync(pfad).toString("base64")}`;

const logo = (fuge, breite = "") => `<svg class="logo" viewBox="0 0 240 128" ${breite} aria-hidden="true" focusable="false">
<g stroke="${fuge}" stroke-width="1.8" stroke-linejoin="round">${Y_STUECKE}</g>
<text x="70" y="97" font-weight="700" font-size="62" letter-spacing="-1">abi’s</text>
<text x="1" y="123" font-weight="600" font-size="15" textLength="232" lengthAdjust="spacing">FLIESENWELT</text>
</svg>`;
const HOERER = `<svg class="hoerer" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5l2.6-.4 1.6 4.3-1.9 1.3a11 11 0 0 0 5.4 5.4l1.3-1.9 4.3 1.6-.4 2.6c-.2 1.3-1.3 2.2-2.6 2.1C10.7 18 6 13.3 5.5 6.1c-.1-1.3.8-2.4 2.1-2.6Z"/></svg>`;

// Strukturierte Daten: Einsatzgebiet ist unbestätigt, deshalb nur Duisburg
const schema = { ...SCHEMA_BETRIEB, areaServed: { "@type": "City", name: "Duisburg" }, image: undefined, logo: undefined };

let html = readFileSync(join(HIER, "vorlage.html"), "utf8");
const bilder = new Set();
// Ersetzungen immer per Funktion, damit „$“ in base64 oder SVG nichts auslöst
html = html
  .replace(/\{\{bild:([\w.-]+)\}\}/g, (_, name) => { bilder.add(name); return datenUri(join(HIER, "bilder", name), "image/webp"); })
  .replace(/\{\{defs\}\}/g, () => VB.defs((name) => { bilder.add(name); return datenUri(join(HIER, "bilder", name), "image/webp"); }))
  .replace(/\{\{vb:(\w+)\}\}/g, (_, name) => { if (!VB[name]) throw new Error("Verlegebild fehlt: " + name); return VB[name](); })
  .replace(/\{\{schrift\}\}/g, () => datenUri(join(HIER, "schrift", "archivo-latin-wdth-wght.woff2"), "font/woff2"))
  .replace(/\{\{favicon\}\}/g, () => datenUri(join(HIER, "favicon.svg"), "image/svg+xml"))
  .replace(/\{\{logo\}\}/g, () => logo("#ECEAE5"))
  .replace(/\{\{logo-klein\}\}/g, () => logo("#E1DED7"))
  .replace(/\{\{hoerer\}\}/g, () => HOERER)
  .replace(/\{\{karte\}\}/g, () => karte())
  .replace(/\{\{karte-nachweis\}\}/g, () => KARTE_NACHWEIS)
  .replace(/\{\{jsonld\}\}/g, () => JSON.stringify(schema).replace(/</g, "\\u003c"));

const rest = html.match(/\{\{[^}]+\}\}/g);
if (rest) throw new Error("Nicht ersetzt: " + rest.join(", "));
if ((html.match(/<h1[\s>]/g) || []).length !== 1) throw new Error("Genau eine h1 erwartet");
const titel = html.match(/<title>([^<]+)/)[1], beschr = html.match(/name="description" content="([^"]+)/)[1];
if (titel.length > 60) console.warn(`Titel zu lang: ${titel.length}`);
if (beschr.length > 160) console.warn(`Beschreibung zu lang: ${beschr.length}`);

writeFileSync(join(ZIEL, "index.html"), html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
const tel = (html.match(/href="tel:/g) || []).length;
console.log(`index.html: ${kb} KB, ${bilder.size} Bilder, ${tel} Telefon-Links, Titel ${titel.length} / Beschreibung ${beschr.length} Zeichen`);
