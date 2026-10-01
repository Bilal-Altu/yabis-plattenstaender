# Yabi’s Fliesenwelt – Entwurf „Plattenständer“

Startseite für die Yabis Fliesenwelt GmbH (Bergheimer Straße 115, Duisburg-Rheinhausen), gebaut nach dem
Skill `handwerker-webseite`, Modus Entwurf: eine HTML-Datei, Schrift, Bilder und Karte eingebettet, nichts
wird von fremden Servern geladen.

Vorschau: https://bilal-altu.github.io/yabis-plattenstaender/ (noindex, robots.txt gesperrt)

## Idee

Im Laden stehen die Großformate hochkant im Kupferregal, man zieht eine Platte heraus, um sie ganz zu sehen.
Die Startseite zeigt einen Ständer aus echten Plattenausschnitten (Ladenfotos), jede mit Kupferklammer und
Etikett; die Platte unter dem Zeiger fährt heraus. Farben: Ausstellungsgrau `#E6E4DF`, Anthrazit `#1F2227`,
Kupfer `#B4532B` (das Plattenregal). Schrift: Archivo, Extra-Condensed für Überschriften und Etiketten.

## Bauen

```bash
bash _quelle/bilder.sh      # Plattenstreifen aus Desktop/Yabis/quelle schneiden
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
