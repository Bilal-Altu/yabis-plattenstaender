# Yabi’s Fliesenwelt – Entwurf „Plattenständer“

Startseite für die Yabis Fliesenwelt GmbH (Bergheimer Straße 115, Duisburg-Rheinhausen), gebaut nach dem
Skill `handwerker-webseite`, Modus Entwurf: eine HTML-Datei, Schrift, Bilder und Karte eingebettet, nichts
wird von fremden Servern geladen.

Vorschau: https://bilal-altu.github.io/yabis-plattenstaender/ (noindex, robots.txt gesperrt)

## Idee

Im Laden hängen die Großformate im Kupferregal, man zieht eine Platte heraus, um sie ganz zu sehen.
- **Held:** ein gezeichnetes Kupferregal mit sechs echten Plattenausschnitten (Ladenfotos). Das Regal blättert
  von selbst weiter, die Platte unter dem Zeiger fährt heraus, das Musteretikett darunter liest mit
  (Optik, Material, Einsatz, Ort im Laden).
- **Musterwand:** sechs eigene Verlegebilder (SVG), gefüllt mit Ausschnitten der echten Platten – Marmorwand im
  Halbverband, Bad in Betonoptik, Dielen, Fischgrät-Nische, Stelzlager im Schnitt, Eckdetail mit Dichtband.
  Die Fliesen werden beim Hereinscrollen „gelegt“.
- **Ablauf:** dieselbe Wand in drei Zuständen (Aufmaß → Abdichtung und erste Reihe → fertig verlegt).
- Farben: Grund `#ECEAE5`, Tinte `#1E2125`, Kupfer `#B4532B` (das Plattenregal). Schrift: Archivo, breit
  und eng gesetzt, zweifarbige Überschriften.

## Bauen

```bash
bash _quelle/bilder.sh      # Plattenstreifen und Texturen aus Desktop/Yabis/quelle schneiden
node _quelle/bauen.mjs      # index.html aus _quelle/vorlage.html
```

Die Anfahrtskarte und das Logo-„Y“ kommen aus dem Nachbar-Repo `../yabis` (`_quelle/karte.mjs`,
`_quelle/helfer.mjs`). `index.html` selbst ist eigenständig. Nie von Hand ändern.

## Fehlt vom Kunden (deshalb nicht auf der Seite)

- Fotos fertiger Kundenprojekte mit Ort → Abschnitt „Referenzen“ fehlt
- Belegbare Zahlen (Ausstellungsfläche, Zahl der Musterbäder, Partner-Verleger, Jahre Erfahrung),
  Google-Bewertungen → kein Vertrauensblock mit Zahlen
- Liefer- bzw. Verlegegebiet → Abschnitt „Einsatzgebiet“ fehlt, Schema nennt nur Duisburg
- Ein Foto mit Holzoptik-Platte in voller Höhe → im Ständer fehlt Holz (nur im Sortiment)
- Preisrahmen pro m² (optional), richtige USt-IdNr. fürs Impressum
