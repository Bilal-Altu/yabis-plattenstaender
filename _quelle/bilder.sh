#!/usr/bin/env bash
# Plattenbilder für den Ständer: senkrechte Streifen aus den eigenen Ladenfotos (Desktop/Yabis/quelle).
#   bash _quelle/bilder.sh
# Reihenfolge: beschneiden -> entrauschen -> abstimmen -> schärfen. Kein Hochrechnen.
set -euo pipefail
FF="/c/Users/bilal/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
Q="C:/Users/bilal/Desktop/Yabis/quelle"
Z="$(cd "$(dirname "$0")" && pwd)/bilder"
mkdir -p "$Z"
WA="hqdn3d=2:1.5:3:3,eq=contrast=1.05:saturation=0.95"
HANDY="hqdn3d=1.5:1:3:3,eq=contrast=1.04:saturation=0.95"
streifen() { # name vorlage filterkette
  "$FF" -v error -y -i "$Q/$2" -vf "$3,unsharp=5:5:0.6:5:5:0" -c:v libwebp -quality 84 "$Z/$1.webp"
  echo "$1: $("$FF" -hide_banner -i "$Z/$1.webp" 2>&1 | grep -oE '[0-9]{2,4}x[0-9]{2,4}' | head -1)"
}
# Marmoroptik: obere Großformatplatte im Kupferregal
streifen platte-marmor   WhatsApp-Image-2026-08-14-at-12.25.24-2-1.jpeg  "crop=240:720:760:110,$WA"
# Steinoptik: graue Platte mit Adern im zweiten Regal
streifen platte-stein    WhatsApp-Image-2026-08-14-at-12.25.25-5.jpeg    "crop=240:620:420:255,$WA"
# Betonoptik: große graue Platte am Fenster
streifen platte-beton    WhatsApp-Image-2026-08-18-at-14.14.26-2.jpeg    "crop=140:700:185:685,$WA"
# Mosaik: Fischgrät in der Musterdusche (Rundum-Aufnahme)
streifen platte-mosaik   WhatsApp-Image-2026-08-17-at-09.40.23-1.jpeg    "crop=200:400:95:132,$WA"
# Terrassenplatte: Steinoptik-Platte auf dem Kunstrasen vor dem Laden
streifen platte-terrasse 1000157989-scaled.jpg                            "crop=170:410:230:1540,$HANDY"
# Zubehör: Profile im Regal „Abdichtung & Zubehör“
streifen platte-zubehoer WhatsApp-Image-2026-08-18-at-14.14.27-2-1.jpeg  "crop=240:1000:100:420,$WA"
