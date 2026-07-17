# Fuck Dating Apps — One-Pager

Statische Landingpage für den QR-Code auf dem Shirt. Läuft auf **GitHub Pages** (kein Build, kein Backend).

## Schnellstart

1. **Fotos** in den Ordner [`photos/`](photos/) legen:
   - `hero.jpg` — Portrait in der Mitte
   - `01.jpg`, `02.jpg`, `03.jpg` … — Galerie unter PHOTOS
   - Danach in [`js/config.js`](js/config.js) die Endung von `.svg` auf `.jpg` ändern

2. **Texte** in [`js/config.js`](js/config.js):
   - `about` — About-Text
   - `friends` — Zitate unter FRIENDS
   - Links (Instagram / LinkedIn / Strava) sind schon hinterlegt

3. Lokal testen:
   ```bash
   npx serve .
   ```

## GitHub Pages

1. Repo auf GitHub anlegen und pushen
2. **Settings → Pages → Source:** Deploy from branch `main` / folder `/ (root)`
3. URL z.B. `https://DEIN-USER.github.io/DEIN-REPO/`
4. Diese URL als QR-Code aufs Shirt

> Wenn das Repo nicht root deployed wird, relative Pfade (`css/…`, `assets/…`) bleiben korrekt.

## Interaktion

Ein Viewport, zentrales Foto, vier Labels: **About · Photos · Contact · Friends**. Tippen öffnet ein Bottom-Sheet. Contact bündelt Instagram, LinkedIn und Strava.
