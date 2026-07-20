(() => {
  const SITE = window.SITE || {};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const scrim = $("#scrim");
  const panels = {
    about: $("#panel-about"),
    photos: $("#panel-photos"),
    contact: $("#panel-contact"),
    datemenu: $("#panel-datemenu"),
  };

  let openPanel = null;

  /* ── Content binding ─────────────────────────── */
  function bindContent() {
    const aboutText = $("#about-text");
    const aboutName = $("#about-name");
    const subline = $(".subline");
    const links = SITE.links || {};

    if (aboutText) aboutText.textContent = SITE.about || "";
    if (aboutName) aboutName.textContent = (SITE.name || "").toUpperCase();
    if (subline && SITE.subline) subline.textContent = SITE.subline;

    const cta = SITE.cta || {};
    const ctaRoot = $("#cta");
    const ctaText = $("#cta-text");
    if (ctaRoot && !cta.text) {
      ctaRoot.hidden = true;
    } else if (ctaText && cta.text) {
      ctaText.textContent = cta.text;
    }

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

    buildDateMenu();
    buildHeroStack();
    buildGallery();
  }

  /* ── Hero card stack ──────────────────────────── */
  function buildHeroStack() {
    const stack = $("#hero-stack");
    const fallback = $("#hero-fallback");
    if (!stack) return;

    const heroImages = (Array.isArray(SITE.hero) ? SITE.hero : SITE.hero ? [SITE.hero] : []).filter(Boolean);

    if (!heroImages.length) {
      fallback?.classList.add("is-visible");
      return;
    }

    let cards = heroImages.map((src, i) => {
      const card = document.createElement("div");
      card.className = "hero__card";

      const img = document.createElement("img");
      img.src = src;
      img.alt = SITE.name ? `Portrait von ${SITE.name}` : "Portrait";
      img.loading = i === 0 ? "eager" : "lazy";
      img.addEventListener("error", () => {
        card.remove();
        cards = cards.filter((c) => c !== card);
        if (!cards.length) fallback?.classList.add("is-visible");
      });

      card.appendChild(img);
      stack.appendChild(card);
      return card;
    });

    applyHeroSlots(cards);

    if (cards.length > 1) {
      setInterval(() => {
        if (cards.length < 2) return;
        // Move the back-most card to the front — like drawing the bottom
        // card off a stack and laying it on top, covering the current one.
        cards.unshift(cards.pop());
        applyHeroSlots(cards);
      }, 4200);
    }
  }

  function applyHeroSlots(cards) {
    const visibleDepth = 4;
    cards.forEach((card, i) => {
      card.dataset.slot = i < visibleDepth ? String(i) : "hidden";
    });
  }

  function buildDateMenu() {
    const root = $("#date-menu-content");
    if (!root) return;

    const dateMenu = SITE.dateMenu || {};
    const sections = [
      { heading: "Icebreaker", items: dateMenu.icebreakers },
      { heading: "Ideen fürs erste Date", items: dateMenu.firstDate },
    ].filter((section) => Array.isArray(section.items) && section.items.length);

    root.innerHTML = "";

    if (!sections.length) {
      root.innerHTML = `<p class="panel__body">Noch keine Ideen — in js/config.js unter <code>dateMenu</code> eintragen.</p>`;
      return;
    }

    sections.forEach((section) => {
      const wrap = document.createElement("div");
      wrap.className = "date-menu__section";
      wrap.innerHTML = `
        <h3 class="date-menu__heading">${escapeHtml(section.heading)}</h3>
        <ul class="date-menu__list">
          ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      `;
      root.appendChild(wrap);
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
    const dotsWrap = $("#gallery-dots");
    if (!gallery) return;

    gallery.innerHTML = "";
    if (dotsWrap) dotsWrap.innerHTML = "";
    const items = Array.isArray(SITE.photos) ? SITE.photos : [];

    if (!items.length) {
      gallery.innerHTML = `<div class="gallery__placeholder">Fotos in<br/>photos/</div>`;
      return;
    }

    items.forEach((photo, i) => {
      const img = document.createElement("img");
      img.className = "gallery__item";
      img.src = photo.src;
      img.alt = photo.alt || `Foto ${i + 1}`;
      img.loading = i === 0 ? "eager" : "lazy";
      img.addEventListener("error", () => {
        img.replaceWith(
          Object.assign(document.createElement("div"), {
            className: "gallery__placeholder",
            innerHTML: `Foto ${i + 1}<br/>fehlt`,
          })
        );
      });
      gallery.appendChild(img);

      if (dotsWrap) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery__dot";
        dot.setAttribute("aria-label", `Foto ${i + 1} anzeigen`);
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", () => {
          img.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        });
        dotsWrap.appendChild(dot);
      }
    });

    if (items.length > 1) watchGalleryScroll();
  }

  function watchGalleryScroll() {
    const gallery = $("#gallery");
    const dots = $$("#gallery-dots .gallery__dot");
    const imgs = $$(".gallery__item", gallery);
    if (!gallery || !dots.length || !imgs.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
          const idx = imgs.indexOf(entry.target);
          if (idx === -1) return;
          dots.forEach((dot, i) => dot.classList.toggle("is-active", i === idx));
        });
      },
      { root: gallery, threshold: [0.6] }
    );

    imgs.forEach((img) => observer.observe(img));
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
      if (openPanel === "photos" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const gallery = $("#gallery");
        const first = gallery?.querySelector(".gallery__item");
        if (!gallery || !first) return;
        const step = first.getBoundingClientRect().width + 10;
        gallery.scrollBy({ left: e.key === "ArrowRight" ? step : -step, behavior: "smooth" });
      }
    });

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
