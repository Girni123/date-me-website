# Fuck Dating Apps — One-Pager

Statische Landingpage für den QR-Code auf dem Shirt. Läuft auf **GitHub Pages** (kein Build, kein Backend).

## Schnellstart

1. **Content anpassen** in [`js/config.js`](js/config.js):
   - Name, About-Text
   - LinkedIn- & Strava-URLs
   - Foto-Pfade

2. **Fotos ablegen** in `assets/photos/`:
   - `hero.jpg` — Hauptportrait (Mitte)
   - `01.jpg`, `02.jpg`, `03.jpg` — Galerie
   - Danach in `config.js` die Endungen von `.svg` auf `.jpg` (oder `.webp`) ändern

3. Lokal testen: Ordner öffnen oder z.B.
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

Kein langes Scrollen: ein Viewport, zentrales Foto, vier Labels drumherum (**About / Photos / LinkedIn / Strava**). Tippen öffnet ein Bottom-Sheet.
