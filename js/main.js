(() => {
  const SITE = window.SITE || {};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const scrim = $("#scrim");
  const panels = {
    about: $("#panel-about"),
    photos: $("#panel-photos"),
    linkedin: $("#panel-linkedin"),
    strava: $("#panel-strava"),
  };

  let openPanel = null;
  let galleryIndex = 0;
  let galleryItems = [];

  /* ── Content binding ─────────────────────────── */
  function bindContent() {
    const aboutText = $("#about-text");
    const aboutName = $("#about-name");
    const li = $("#linkedin-link");
    const st = $("#strava-link");
    const heroImg = $("#hero-img");
    const heroFallback = $("#hero-fallback");
    const subline = $(".subline");

    if (aboutText) aboutText.textContent = SITE.about || "";
    if (aboutName) aboutName.textContent = (SITE.name || "").toUpperCase();
    if (subline && SITE.subline) subline.textContent = SITE.subline;

    if (li) {
      li.href = SITE.linkedin || "#";
      if (!SITE.linkedin || SITE.linkedin.includes("DEIN-")) {
        li.addEventListener("click", (e) => {
          if (SITE.linkedin?.includes("DEIN-")) {
            e.preventDefault();
            alert("LinkedIn-URL in js/config.js eintragen.");
          }
        });
      }
    }

    if (st) {
      st.href = SITE.strava || "#";
      if (!SITE.strava || SITE.strava.includes("DEINE-")) {
        st.addEventListener("click", (e) => {
          if (SITE.strava?.includes("DEINE-")) {
            e.preventDefault();
            alert("Strava-URL in js/config.js eintragen.");
          }
        });
      }
    }

    // Hero image with graceful fallback
    if (heroImg && SITE.hero) {
      heroImg.alt = SITE.name ? `Portrait von ${SITE.name}` : "Portrait";
      heroImg.addEventListener("load", () => {
        heroImg.classList.add("is-loaded");
        heroFallback?.classList.add("is-hidden");
      });
      heroImg.addEventListener("error", () => {
        heroImg.classList.remove("is-loaded");
        heroFallback?.classList.remove("is-hidden");
      });
      heroImg.src = SITE.hero;
    }

    buildGallery();
  }

  function buildGallery() {
    const gallery = $("#gallery");
    if (!gallery) return;

    gallery.innerHTML = "";
    galleryItems = Array.isArray(SITE.photos) ? SITE.photos : [];

    if (!galleryItems.length) {
      gallery.innerHTML = `<div class="gallery__placeholder">Fotos in<br/>assets/photos/</div>`;
      updateGalleryCount();
      return;
    }

    galleryItems.forEach((photo, i) => {
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || `Foto ${i + 1}`;
      img.loading = "lazy";
      if (i === 0) img.classList.add("is-active");
      img.addEventListener("error", () => {
        img.replaceWith(Object.assign(document.createElement("div"), {
          className: "gallery__placeholder",
          innerHTML: `Foto ${i + 1}<br/>fehlt`,
        }));
      });
      gallery.appendChild(img);
    });

    galleryIndex = 0;
    updateGalleryCount();
  }

  function showGallery(index) {
    const imgs = $$("#gallery img");
    if (!imgs.length) return;
    galleryIndex = (index + imgs.length) % imgs.length;
    imgs.forEach((img, i) => img.classList.toggle("is-active", i === galleryIndex));
    updateGalleryCount();
  }

  function updateGalleryCount() {
    const el = $("#gallery-count");
    if (!el) return;
    const total = Math.max($$("#gallery img").length, 1);
    el.textContent = `${galleryIndex + 1} / ${total}`;
  }

  /* ── Panels ──────────────────────────────────── */
  function open(name) {
    const panel = panels[name];
    if (!panel) return;

    close(false);
    openPanel = name;

    panel.hidden = false;
    scrim.hidden = false;
    // force reflow for transition
    void panel.offsetWidth;
    panel.classList.add("is-open");
    scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";

    const hint = $("#hint");
    if (hint) hint.style.visibility = "hidden";

    // focus close for a11y
    panel.querySelector("[data-close]")?.focus();
  }

  function close(animate = true) {
    if (!openPanel) {
      scrim.hidden = true;
      return;
    }

    const panel = panels[openPanel];
    panel?.classList.remove("is-open");
    scrim.classList.remove("is-open");

    const finish = () => {
      if (panel) panel.hidden = true;
      scrim.hidden = true;
      openPanel = null;
      document.body.style.overflow = "";
      const hint = $("#hint");
      if (hint) hint.style.visibility = "";
    };

    if (animate) {
      setTimeout(finish, 400);
    } else {
      finish();
    }
  }

  /* ── Events ──────────────────────────────────── */
  function bindEvents() {
    $$("[data-panel]").forEach((btn) => {
      btn.addEventListener("click", () => open(btn.dataset.panel));
    });

    $$("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => close());
    });

    scrim?.addEventListener("click", () => close());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (!openPanel) return;
      if (openPanel === "photos") {
        if (e.key === "ArrowRight") showGallery(galleryIndex + 1);
        if (e.key === "ArrowLeft") showGallery(galleryIndex - 1);
      }
    });

    $("#gallery-prev")?.addEventListener("click", () => showGallery(galleryIndex - 1));
    $("#gallery-next")?.addEventListener("click", () => showGallery(galleryIndex + 1));

    // Swipe on gallery
    const gallery = $("#gallery");
    if (gallery) {
      let startX = 0;
      gallery.addEventListener(
        "touchstart",
        (e) => {
          startX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      gallery.addEventListener(
        "touchend",
        (e) => {
          const dx = e.changedTouches[0].screenX - startX;
          if (Math.abs(dx) < 40) return;
          showGallery(dx < 0 ? galleryIndex + 1 : galleryIndex - 1);
        },
        { passive: true }
      );
    }

    // Swipe-down to close panels
    Object.values(panels).forEach((panel) => {
      if (!panel) return;
      let startY = 0;
      panel.addEventListener(
        "touchstart",
        (e) => {
          if (panel.scrollTop > 0) return;
          startY = e.changedTouches[0].screenY;
        },
        { passive: true }
      );
      panel.addEventListener(
        "touchend",
        (e) => {
          if (!startY) return;
          const dy = e.changedTouches[0].screenY - startY;
          startY = 0;
          if (dy > 80) close();
        },
        { passive: true }
      );
    });
  }

  bindContent();
  bindEvents();
})();
