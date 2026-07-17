/**
 * ──────────────────────────────────────────────
 *  EDIT THESE — dein Content für die Website
 * ──────────────────────────────────────────────
 *
 * FOTOS: einfach in den Ordner /photos legen:
 *   hero.jpg, hero2.jpg, hero3.jpg …  → Bilder-Stapel in der Mitte
 *                                        (2–4 Stück empfohlen, unten in der
 *                                        Liste ergänzen — sie wechseln sich
 *                                        automatisch wie ein Kartenstapel ab)
 *   01.jpg       → erstes Foto in PHOTOS
 *   02.jpg       → zweites Foto
 *   03.jpg       → drittes Foto
 *   04.jpg …     → beliebig weiter (in der Liste unten ergänzen)
 *
 * Formate: .jpg / .jpeg / .png / .webp — Dateiname muss
 * zum Eintrag unten passen.
 */
window.SITE = {
  name: "David Girnstein",
  headline: "FUCK DATING APPS",
  subline: "LETS MEET IN REAL LIFE",

  links: {
    instagram: "https://www.instagram.com/david_girnstein/",
    linkedin: "https://www.linkedin.com/in/davidgirnstein/",
    strava: "https://www.strava.com/athletes/79860561",
  },

  // Text hier anpassen, wenn du soweit bist
  about:
    "Kein Swipe. Kein Algorithmus. Einfach real life — Kaffee, Laufen, oder was auch immer sich ergibt.",

  friends: [
    {
      quote: "Hier kommt später, was deine Freunde über dich sagen.",
      from: "Freund:in",
    },
    {
      quote: "Zweiter Spruch — einfach in js/config.js austauschen.",
      from: "Noch jemand",
    },
  ],

  // Hauptbild-Stapel in der Mitte — 2 bis 4 Bilder, wechseln automatisch
  hero: ["photos/hero.jpg", "photos/01.jpg", "photos/02.jpg"],

  // Galerie (PHOTOS-Tab) — Dateinamen = Dateien im Ordner photos/
  photos: [
    { src: "photos/01.jpg", alt: "Foto 1" },
    { src: "photos/02.jpg", alt: "Foto 2" },
    { src: "photos/03.jpg", alt: "Foto 3" },
  ],
};
