(() => {
  const SITE = window.SITE || {};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const scrim = $("#scrim");
  const panels = {
    about: $("#panel-about"),
    photos: $("#panel-photos"),
    contact: $("#panel-contact"),
    friends: $("#panel-friends"),
  };

  let openPanel = null;
  let galleryIndex = 0;

  /* ── Content binding ─────────────────────────── */
  function bindContent() {
    const aboutText = $("#about-text");
    const aboutName = $("#about-name");
    const subline = $(".subline");
    const heroImg = $("#hero-img");
    const heroFallback = $("#hero-fallback");
    const links = SITE.links || {};

    if (aboutText) aboutText.textContent = SITE.about || "";
    if (aboutName) aboutName.textContent = (SITE.name || "").toUpperCase();
    if (subline && SITE.subline) subline.textContent = SITE.subline;

    const linkMap = {
      "link-instagram": links.instagram,
      "link-linkedin": links.linkedin,
      "link-strava": links.strava,
    };

    Object.entries(linkMap).forEach(([id, href]) => {
      const el = $(`#${id}`);
      if (!el || !href) return;
      el.href = href;
    });

    buildFriends();

    if (heroImg && SITE.hero) {
      heroImg.alt = SITE.name ? `Portrait von ${SITE.name}` : "Portrait";

      const showHero = () => {
        heroImg.classList.add("is-loaded");
        heroFallback?.classList.add("is-hidden");
      };
      const hideHero = () => {
        heroImg.classList.remove("is-loaded");
        heroFallback?.classList.remove("is-hidden");
      };

      heroImg.addEventListener("load", showHero);
      heroImg.addEventListener("error", hideHero);
      heroImg.src = SITE.hero;
      // Cached images often skip the load event
      if (heroImg.complete && heroImg.naturalWidth > 0) showHero();
    }

    buildGallery();
  }

  function buildFriends() {
    const root = $("#friends-quotes");
    if (!root) return;

    const items = Array.isArray(SITE.friends) ? SITE.friends : [];
    root.innerHTML = "";

    if (!items.length) {
      root.innerHTML = `<p class="panel__body">Noch keine Zitate — in js/config.js unter <code>friends</code> eintragen.</p>`;
      return;
    }

    items.forEach((item) => {
      const figure = document.createElement("figure");
      figure.className = "quote";
      figure.innerHTML = `
        <blockquote class="quote__text">“${escapeHtml(item.quote || "")}”</blockquote>
        <figcaption class="quote__from">— ${escapeHtml(item.from || "")}</figcaption>
      `;
      root.appendChild(figure);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildGallery() {
    const gallery = $("#gallery");
    if (!gallery) return;

    gallery.innerHTML = "";
    const items = Array.isArray(SITE.photos) ? SITE.photos : [];

    if (!items.length) {
      gallery.innerHTML = `<div class="gallery__placeholder">Fotos in<br/>photos/</div>`;
      updateGalleryCount();
      return;
    }

    items.forEach((photo, i) => {
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || `Foto ${i + 1}`;
      img.loading = "lazy";
      if (i === 0) img.classList.add("is-active");
      img.addEventListener("error", () => {
        img.replaceWith(
          Object.assign(document.createElement("div"), {
            className: "gallery__placeholder",
            innerHTML: `Foto ${i + 1}<br/>fehlt`,
          })
        );
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
    void panel.offsetWidth;
    panel.classList.add("is-open");
    scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";

    const hint = $("#hint");
    if (hint) hint.style.visibility = "hidden";

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

    if (animate) setTimeout(finish, 400);
    else finish();
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
      if (openPanel === "photos") {
        if (e.key === "ArrowRight") showGallery(galleryIndex + 1);
        if (e.key === "ArrowLeft") showGallery(galleryIndex - 1);
      }
    });

    $("#gallery-prev")?.addEventListener("click", () => showGallery(galleryIndex - 1));
    $("#gallery-next")?.addEventListener("click", () => showGallery(galleryIndex + 1));

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
