// Verlegebilder: eigene Zeichnungen, gefüllt mit Ausschnitten aus den Plattenfotos der Ausstellung.
// Jede Fliese ist ein eigenes Element (Klasse "st", Verzögerung --d), damit sie beim Einblenden „gelegt“ wird.
const r = (n) => Math.round(n * 10) / 10;
const FUGE = "#C7C3BB";
const TINTE = "#1E2125";
const KUPFER = "#B4532B";

let zaehler = 0;
const id = (name) => `${name}-${++zaehler}`;
const pts = (p) => p.map(([x, y]) => `${r(x)},${r(y)}`).join(" ");

// Musterdefinitionen: Texturen einmal einbetten, alle Zeichnungen verweisen darauf
export function defs(bild) {
  const tex = (name, datei, w, h) => `<pattern id="${name}" patternUnits="userSpaceOnUse" width="${w}" height="${h}"><image href="${bild(datei)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></pattern>`;
  return `<svg class="defs" aria-hidden="true" focusable="false"><defs>
${tex("t-marmor", "tex-marmor.webp", 400, 340)}
${tex("t-stein", "tex-stein.webp", 400, 340)}
${tex("t-terrasse", "tex-terrasse.webp", 400, 330)}
<filter id="f-rauschen" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .55"/></feComponentTransfer></filter>
<pattern id="t-beton" patternUnits="userSpaceOnUse" width="400" height="340"><rect width="400" height="340" fill="#86847F"/><rect width="400" height="340" filter="url(#f-rauschen)"/></pattern>
<pattern id="schraffur" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#9C988F" stroke-width="1"/></pattern>
</defs></svg>`;
}

// Wand im Verband: Fliesen kw x kh, jede Reihe um versatz * kw verschoben, auf den Bereich zugeschnitten
function wand({ x, y, w, h, kw, kh, versatz = 0.5, fill, fuge = 3, d0 = 0, von = "unten", reihen = Infinity }) {
  const gh = Math.min(h, reihen * kh);
  const teile = [`<rect x="${x}" y="${y + h - gh}" width="${w}" height="${gh}" fill="${FUGE}"/>`];
  const zeilen = Math.ceil(h / kh);
  let n = 0;
  for (let i = 0; i < zeilen && i < reihen; i++) {
    const zi = von === "unten" ? zeilen - 1 - i : i;
    const ty = y + h - (i + 1) * kh;
    const y0 = von === "unten" ? Math.max(y, ty) : y + zi * kh;
    const y1 = von === "unten" ? y + h - i * kh : Math.min(y + h, y + (zi + 1) * kh);
    const off = ((i * versatz) % 1) * kw;
    for (let tx = x - off; tx < x + w; tx += kw) {
      const x0 = Math.max(x, tx), x1 = Math.min(x + w, tx + kw);
      const bw = x1 - x0 - fuge, bh = y1 - y0 - fuge;
      if (bw <= 1 || bh <= 1) continue;
      teile.push(`<rect class="st" style="--d:${d0 + n++}" x="${r(x0 + fuge / 2)}" y="${r(y0 + fuge / 2)}" width="${r(bw)}" height="${r(bh)}" fill="${fill}"/>`);
    }
  }
  return teile.join("");
}

// Boden in Perspektive: Fluchtpunkt mittig, z = 1 hinten (Wandfuß) bis zv vorn (unterer Rand)
function boden({ yH = 120, yHinten, yVorn, cx = 200, breiteWelt = [-260, 660], tw, tz, versatz = 0, fill, fuge = 2.2, d0 = 0 }) {
  const zv = (yHinten - yH) / (yVorn - yH);
  const p = (xw, z) => [cx + (xw - cx) / z, yH + (yHinten - yH) / z];
  const teile = [`<polygon points="${pts([p(breiteWelt[0], 1), p(breiteWelt[1], 1), p(breiteWelt[1], zv), p(breiteWelt[0], zv)])}" fill="${FUGE}"/>`];
  let n = 0;
  for (let zi = 0, z0 = 1; z0 > zv + 0.001; zi++, z0 -= tz) {
    const z1 = Math.max(zv, z0 - tz);
    const off = ((zi * versatz) % 1) * tw;
    for (let xw = breiteWelt[0] - off; xw < breiteWelt[1]; xw += tw) {
      const g = fuge * (z0 + z1) / 2 / 2;
      const a = xw + g, b = xw + tw - g, zz0 = z0 - g / 400, zz1 = z1 + g / 400;
      const fl = typeof fill === "function" ? fill(zi, Math.round((xw - breiteWelt[0]) / tw)) : fill;
      teile.push(`<polygon class="st" style="--d:${d0 + n++}" points="${pts([p(a, zz0), p(b, zz0), p(b, zz1), p(a, zz1)])}" fill="${fl}"/>`);
    }
  }
  return teile.join("");
}

// Fischgrät 2:1, um 45° gedreht, auf ein Rechteck zugeschnitten
function fischgraet({ x, y, w, h, l = 9, fill = "#2A2C2F", d0 = 0 }) {
  const L = 2 * l, clip = id("fg");
  const steine = [];
  let n = 0;
  for (let m = -14; m <= 14; m++) for (let k = -16; k <= 16; k++) {
    const ox = k * l + m * L, oy = k * l - m * L;
    steine.push(`<rect class="st" style="--d:${d0 + (n++ % 60)}" x="${r(ox + 0.8)}" y="${r(oy + 0.8)}" width="${r(L - 1.6)}" height="${r(l - 1.6)}" fill="${fill}"/>`);
    steine.push(`<rect class="st" style="--d:${d0 + (n++ % 60)}" x="${r(ox + L + 0.8)}" y="${r(oy - (L - l) + 0.8)}" width="${r(l - 1.6)}" height="${r(L - 1.6)}" fill="${fill}"/>`);
  }
  return `<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
<g clip-path="url(#${clip})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#8F8B84"/><g transform="translate(${x + w / 2} ${y + h / 2}) rotate(45)">${steine.join("")}</g></g>`;
}

const beschriftung = (x, y, text, anker = "start") => `<text class="vb-text" x="${x}" y="${y}" text-anchor="${anker}">${text}</text>`;
const zeiger = (x1, y1, x2, y2) => `<path class="vb-zeiger" d="M${x1} ${y1}L${x2} ${y2}"/><circle cx="${x1}" cy="${y1}" r="2.2" fill="${TINTE}"/>`;
const svg = (label, inhalt, vb = "0 0 400 300") => `<svg class="vb" viewBox="${vb}" role="img" aria-label="${label}">${inhalt}</svg>`;

// 01 Marmor- und Steinoptik: Wand im Halbverband, Boden in Steinoptik
export const marmor = () => svg("Zeichnung: Wand mit großen Platten in Marmoroptik im Halbverband, Boden in Steinoptik",
  `<rect width="400" height="300" fill="#EFEDE9"/>` +
  wand({ x: 0, y: 0, w: 400, h: 212, kw: 150, kh: 75, fill: "url(#t-marmor)" }) +
  `<rect x="0" y="212" width="400" height="4" fill="#D8D4CC"/>` +
  boden({ yH: 120, yHinten: 216, yVorn: 300, tw: 140, tz: 0.2, versatz: 0.5, fill: "url(#t-stein)", d0: 10 }));

// 02 Betonoptik: Bad mit großen Quadraten, Waschtisch und Spiegel
export const beton = () => svg("Zeichnung: Badwand mit großen Platten in Betonoptik, Waschtisch und Spiegel",
  wand({ x: 0, y: 0, w: 400, h: 300, kw: 132, kh: 132, versatz: 0, fill: "url(#t-beton)", d0: 0 }) +
  `<rect x="128" y="40" width="144" height="104" rx="52" fill="none" stroke="#F4F2EE" stroke-width="3"/>` +
  `<rect x="112" y="182" width="176" height="34" fill="${TINTE}"/><rect x="150" y="174" width="100" height="10" rx="5" fill="#F4F2EE"/>` +
  `<path d="M200 174V158h14" fill="none" stroke="${KUPFER}" stroke-width="4" stroke-linecap="round"/>`);

// 03 Holzoptik: Dielen im wilden Verband
const holztoene = ["#CDB38F", "#C2A57F", "#D6BE9C", "#BC9D76", "#C9AE88"];
export const holz = () => svg("Zeichnung: Boden mit Dielen in Holzoptik, versetzt verlegt",
  `<rect width="400" height="300" fill="#EFEDE9"/><rect x="0" y="62" width="400" height="8" fill="#DAD6CE"/>` +
  boden({ yH: -10, yHinten: 70, yVorn: 300, tw: 46, tz: 0.1, versatz: 0.37, fill: (zi, xi) => holztoene[(zi * 3 + xi * 2) % 5] }) +
  `<g class="vb-maserung">` + Array.from({ length: 9 }, (_, i) => `<path d="M${-80 + i * 70} 300 L${170 + i * 7} 72"/>`).join("") + `</g>`);

// 04 Mosaik: Fischgrät in der Duschnische, Armatur in Kupfer
export const mosaik = () => svg("Zeichnung: Duschnische mit schwarzem Mosaik im Fischgrätmuster und Armatur",
  `<rect width="400" height="300" fill="url(#t-beton)"/>` +
  fischgraet({ x: 120, y: 0, w: 160, h: 300 }) +
  `<rect x="116" y="0" width="4" height="300" fill="#6F6C66"/><rect x="280" y="0" width="4" height="300" fill="#6F6C66"/>` +
  `<g fill="none" stroke="${KUPFER}" stroke-width="5" stroke-linecap="round"><path d="M200 248V64h-26"/><path d="M182 196h36"/></g>` +
  `<ellipse cx="160" cy="66" rx="24" ry="6" fill="${KUPFER}"/>`);

// 05 Terrassenplatten auf Stelzlagern, Schnitt
const stelzlager = (x) => `<g class="st" style="--d:${x / 20}">
<rect x="${x - 24}" y="246" width="48" height="8" rx="2" fill="${TINTE}"/>
<rect x="${x - 7}" y="196" width="14" height="50" fill="#3B3E43"/>
${[204, 212, 220, 228, 236].map((yy) => `<path d="M${x - 7} ${yy}h14" stroke="#6E7176" stroke-width="1.2"/>`).join("")}
<rect x="${x - 22}" y="190" width="44" height="6" fill="${TINTE}"/><rect x="${x - 1.5}" y="160" width="3" height="30" fill="${TINTE}"/></g>`;
export const terrasse = () => svg("Zeichnung: Terrassenplatten auf höhenverstellbaren Stelzlagern, im Schnitt",
  `<rect width="400" height="300" fill="#EFEDE9"/>` +
  `<rect x="0" y="214" width="400" height="86" fill="url(#schraffur)"/>` +
  `<g transform="translate(0 -40)"><path d="M0 254H400" stroke="${TINTE}" stroke-width="2"/>` +
  [50, 200, 350].map(stelzlager).join("") +
  [[-90, 48.5], [51.5, 198.5], [201.5, 348.5], [351.5, 490]].map(([a, b], i) =>
    `<g class="st" style="--d:${8 + i}"><rect x="${a}" y="162" width="${b - a}" height="28" fill="url(#t-terrasse)"/><rect x="${a}" y="162" width="${b - a}" height="28" fill="none" stroke="${TINTE}" stroke-width="1.5"/></g>`).join("") +
  `</g>` +
  zeiger(128, 136, 168, 66) + beschriftung(174, 70, "TERRASSENPLATTE") +
  zeiger(207, 182, 262, 262) + beschriftung(268, 266, "STELZLAGER"));

// 06 Abdichtung und Zubehör: Ecke Wand/Boden im Schnitt
export const zubehoer = () => svg("Zeichnung: Ecke zwischen Wand und Boden im Schnitt mit Abdichtung, Dichtband, Fliesen und Abschlussprofil",
  `<rect width="400" height="300" fill="#EFEDE9"/>` +
  `<rect x="20" y="0" width="56" height="300" fill="url(#schraffur)"/><rect x="20" y="244" width="380" height="56" fill="url(#schraffur)"/>` +
  `<path d="M76 0V244H400" fill="none" stroke="${TINTE}" stroke-width="1.5"/>` +
  `<path class="st" style="--d:1" d="M79 0V241H400" fill="none" stroke="#5B7482" stroke-width="5"/>` +
  `<path class="st" style="--d:3" d="M82 196V238H130" fill="none" stroke="${KUPFER}" stroke-width="7" stroke-linejoin="round"/>` +
  `<path class="st" style="--d:5" d="M88 0V232H400" fill="none" stroke="#A9A49B" stroke-width="3" stroke-dasharray="2 4"/>` +
  [0, 1, 2].map((i) => `<rect class="st" style="--d:${7 + i}" x="92" y="${2 + i * 76}" width="14" height="73" fill="url(#t-stein)"/>`).join("") +
  [0, 1, 2, 3].map((i) => `<rect class="st" style="--d:${10 + i}" x="${110 + i * 74}" y="218" width="71" height="14" fill="url(#t-stein)"/>`).join("") +
  `<path class="st" style="--d:14" d="M380 232V214h10" fill="none" stroke="#8C949A" stroke-width="4"/>` +
  zeiger(99, 60, 170, 46) + beschriftung(176, 50, "FLIESE") +
  zeiger(79, 120, 170, 104) + beschriftung(176, 108, "ABDICHTUNG") +
  zeiger(106, 236, 170, 162) + beschriftung(176, 166, "DICHTBAND") +
  zeiger(385, 214, 330, 168) + beschriftung(326, 172, "PROFIL", "end"));

// Ablauf: dieselbe Badwand in drei Zuständen
const WAND = { x: 0, y: 0, w: 400, h: 262 };
const bodenAblauf = (fill, d0 = 0) => boden({ yH: 150, yHinten: 262, yVorn: 340, tw: 130, tz: 0.18, versatz: 0.5, fill, d0 });
export const ablauf1 = () => svg("Zeichnung: leere Wand mit Maßketten für Breite und Höhe, davor eine Musterplatte in Originalgröße",
  `<rect x="0" y="0" width="400" height="262" fill="#F1EFEB"/><rect x="0" y="262" width="400" height="78" fill="#D6D2CA"/>` +
  `<g class="vb-mass"><path d="M40 34H360M40 26V42M360 26V42"/><path d="M26 56V250M18 56H34M18 250H34"/></g>` +
  `<text class="vb-text vb-text--kupfer" x="200" y="22" text-anchor="middle">BREITE</text>` +
  `<text class="vb-text vb-text--kupfer" transform="translate(14 153) rotate(-90)" text-anchor="middle">HÖHE</text>` +
  `<g class="st" style="--d:2"><polygon points="282,96 352,90 368,300 296,306" fill="url(#t-marmor)"/><polygon points="282,96 352,90 368,300 296,306" fill="none" stroke="${TINTE}" stroke-width="1.5"/></g>`,
  "0 0 400 340");
export const ablauf2 = () => svg("Zeichnung: Wand mit Abdichtung, Dichtband in der Ecke, Kleber und den ersten Fliesenreihen, davor Fliesenkartons",
  `<rect x="0" y="0" width="400" height="262" fill="#C9D0D3"/><rect x="0" y="262" width="400" height="78" fill="#D6D2CA"/>` +
  `<path class="vb-kleber" d="${[118, 140, 162].map((yy) => Array.from({ length: 40 }, (_, i) => `M${i * 10} ${yy}l5 -8 5 8`).join("")).join("")}"/>` +
  wand({ ...WAND, y: 104, h: 158, kw: 150, kh: 75, fill: "url(#t-marmor)", reihen: 1 }) +
  `<rect x="0" y="258" width="400" height="6" fill="${KUPFER}"/>` +
  [[230, 296, 82, 30], [240, 268, 70, 28], [250, 242, 56, 26]].map(([x, y, w, h], i) =>
    `<g class="st" style="--d:${4 + i}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C8B496"/><rect x="${x}" y="${y + h / 2 - 3}" width="${w}" height="6" fill="#A7926F"/></g>`).join(""),
  "0 0 400 340");
export const ablauf3 = () => svg("Zeichnung: fertig geflieste Wand im Halbverband mit Duschstange, Boden in Steinoptik",
  wand({ ...WAND, kw: 150, kh: 75, fill: "url(#t-marmor)" }) +
  bodenAblauf("url(#t-stein)", 12) +
  `<g fill="none" stroke="${KUPFER}" stroke-width="5" stroke-linecap="round"><path d="M300 238V58h-30"/><path d="M284 188h32"/></g><ellipse cx="256" cy="60" rx="22" ry="6" fill="${KUPFER}"/>`,
  "0 0 400 340");
