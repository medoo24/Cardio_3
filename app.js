/* Application shell, routing, search, progress, bookmarks and theme. */
(() => {
  "use strict";

  const data = window.VHLabData;
  const study = window.VHLabStudy;
  const labs = window.VHLabLabs;
  if (!data) throw new Error("VHLabData must load before app.js");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* private mode */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (_) { /* private mode */ }
    }
  };

  const KEY = {
    visited: "vhlab.visited.v1",
    bookmarks: "vhlab.bookmarks.v1",
    theme: "vhlab.theme.v1"
  };

  const allItems = data.navGroups.flatMap(group => group.items);
  const allRoutes = allItems.map(item => item.id);
  const itemById = Object.fromEntries(allItems.map(item => [item.id, item]));
  const state = {
    route: "overview",
    visited: new Set(storage.get(KEY.visited, ["overview"]).filter(id => allRoutes.includes(id))),
    bookmarks: new Set(storage.get(KEY.bookmarks, []).filter(id => allRoutes.includes(id))),
    searchIndex: [],
    toastTimer: 0
  };

  const els = {
    nav: $("#course-nav"),
    app: $("#app-content"),
    main: $("#main-content"),
    sectionLabel: $("#current-section-label"),
    progressLabel: $("#progress-label"),
    progressBar: $("#progress-bar"),
    sidebar: $("#sidebar"),
    scrim: $("#sidebar-scrim"),
    menu: $("#menu-button"),
    sidebarClose: $("#sidebar-close"),
    search: $("#site-search"),
    searchResults: $("#search-results"),
    theme: $("#theme-toggle"),
    print: $("#print-button"),
    resetProgress: $("#reset-progress"),
    clearBookmarks: $("#clear-bookmarks"),
    bookmarksButton: $("#bookmarks-button"),
    bookmarkDialog: $("#bookmark-dialog"),
    bookmarkList: $("#bookmark-list"),
    closeBookmarks: $("#close-bookmarks"),
    toast: $("#toast")
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  function stripHtml(html) {
    const holder = document.createElement("div");
    holder.innerHTML = html;
    holder.querySelectorAll("script,style,svg,iframe,button,input,select,textarea").forEach(node => node.remove());
    return (holder.textContent || "").replace(/\s+/g, " ").trim();
  }

  function routeFromHash() {
    const requested = decodeURIComponent(location.hash.replace(/^#/, "").trim());
    return allRoutes.includes(requested) ? requested : "overview";
  }

  function findCluster(route) {
    return Object.values(data.clusters).find(routes => routes.includes(route)) || [route];
  }

  function buildNavigation() {
    let runningIndex = 0;
    els.nav.innerHTML = data.navGroups.map(group => `
      <section class="nav-group" aria-label="${escapeHtml(group.title)}">
        <h2 class="nav-group-title">${escapeHtml(group.title)}</h2>
        ${group.items.map(item => {
          runningIndex += 1;
          return `<button class="nav-link" type="button" data-route="${item.id}" data-nav-route="${item.id}">
            <span class="nav-index">${String(runningIndex).padStart(2, "0")}</span>
            <span>${escapeHtml(item.label)}</span>
            <span class="nav-mark" aria-hidden="true"></span>
          </button>`;
        }).join("")}
      </section>
    `).join("");
  }

  function updateNavigation() {
    $$('[data-nav-route]', els.nav).forEach(button => {
      const id = button.dataset.navRoute;
      const active = id === state.route;
      button.classList.toggle("active", active);
      button.classList.toggle("visited", state.visited.has(id));
      button.setAttribute("aria-current", active ? "page" : "false");
      if (active) requestAnimationFrame(() => button.scrollIntoView({block: "nearest"}));
    });
  }

  function saveProgress() {
    storage.set(KEY.visited, [...state.visited]);
    storage.set(KEY.bookmarks, [...state.bookmarks]);
  }

  function updateProgress() {
    const count = state.visited.size;
    els.progressLabel.textContent = `${count} / ${allRoutes.length}`;
    els.progressBar.style.width = `${Math.round((count / allRoutes.length) * 100)}%`;
  }

  function hero(module, route) {
    const saved = state.bookmarks.has(route);
    const chips = (module.meta || []).map(meta => `<span class="hero-chip">${escapeHtml(meta)}</span>`).join("");
    return `<header class="module-hero speech-unit">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">${escapeHtml(module.kicker || "Valvular Heart Disease Lab")}</p>
          <h1>${escapeHtml(module.title)}</h1>
          <p class="lead">${escapeHtml(module.summary || "")}</p>
          ${chips ? `<div class="hero-meta">${chips}</div>` : ""}
        </div>
        <div class="hero-actions">
          <button class="icon-button hero-bookmark ${saved ? "is-saved" : ""}" type="button" data-bookmark-route="${route}" aria-pressed="${saved}" aria-label="${saved ? "Remove bookmark" : "Bookmark this module"}" title="${saved ? "Remove bookmark" : "Bookmark this module"}">★</button>
        </div>
      </div>
    </header>`;
  }

  function routeTabs(route) {
    const routes = findCluster(route);
    return `<nav class="route-tabs" aria-label="Related modules">
      ${routes.map(id => `<button class="route-tab ${id === route ? "active" : ""}" type="button" data-route="${id}" aria-current="${id === route ? "page" : "false"}">${escapeHtml(data.labels[id] || id)}</button>`).join("")}
    </nav>`;
  }

  function modulePager(route) {
    const index = allRoutes.indexOf(route);
    const previous = index > 0 ? allRoutes[index - 1] : null;
    const next = index < allRoutes.length - 1 ? allRoutes[index + 1] : null;
    return `<nav class="module-nav" aria-label="Previous and next modules">
      ${previous ? `<button type="button" class="secondary-button" data-route="${previous}"><span class="muted small">← Previous</span><br>${escapeHtml(data.labels[previous])}</button>` : "<span></span>"}
      ${next ? `<button type="button" class="secondary-button" data-route="${next}"><span class="muted small">Next →</span><br>${escapeHtml(data.labels[next])}</button>` : ""}
    </nav>`;
  }

  function render(route, options = {}) {
    const safeRoute = allRoutes.includes(route) ? route : "overview";
    const module = data.modules[safeRoute];
    if (!module) return;

    study?.resetSpeech?.();
    state.route = safeRoute;
    state.visited.add(safeRoute);
    saveProgress();

    els.app.innerHTML = `<article class="page" data-page-route="${safeRoute}">
      ${hero(module, safeRoute)}
      ${routeTabs(safeRoute)}
      <div class="module-body">${module.body()}</div>
      ${modulePager(safeRoute)}
    </article>`;

    els.sectionLabel.textContent = data.labels[safeRoute] || module.title;
    document.title = `${module.title} | Valvular Heart Disease Lab`;
    updateNavigation();
    updateProgress();
    labs?.initRoute?.(safeRoute);
    study?.initRoute?.(safeRoute);

    if (!options.preserveScroll) window.scrollTo({top: 0, behavior: options.instant ? "auto" : "smooth"});
    requestAnimationFrame(() => els.main.focus({preventScroll: true}));
    closeSidebar();
  }

  function navigate(route, options = {}) {
    const safeRoute = allRoutes.includes(route) ? route : "overview";
    if (location.hash === `#${safeRoute}`) render(safeRoute, options);
    else location.hash = safeRoute;
  }

  function closeSidebar() {
    els.sidebar.classList.remove("open");
    els.scrim.hidden = true;
    els.menu.setAttribute("aria-expanded", "false");
  }

  function openSidebar() {
    els.sidebar.classList.add("open");
    els.scrim.hidden = false;
    els.menu.setAttribute("aria-expanded", "true");
    const active = $('[data-nav-route].active', els.nav);
    requestAnimationFrame(() => active?.focus());
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    els.toast.textContent = message;
    els.toast.hidden = false;
    state.toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2400);
  }

  function toggleBookmark(route) {
    if (!allRoutes.includes(route)) return;
    if (state.bookmarks.has(route)) {
      state.bookmarks.delete(route);
      showToast("Bookmark removed");
    } else {
      state.bookmarks.add(route);
      showToast("Module bookmarked");
    }
    saveProgress();
    const heroButton = $(`[data-bookmark-route="${CSS.escape(route)}"]`);
    if (heroButton) {
      const saved = state.bookmarks.has(route);
      heroButton.classList.toggle("is-saved", saved);
      heroButton.setAttribute("aria-pressed", String(saved));
      heroButton.setAttribute("aria-label", saved ? "Remove bookmark" : "Bookmark this module");
      heroButton.title = saved ? "Remove bookmark" : "Bookmark this module";
    }
    renderBookmarks();
  }

  function renderBookmarks() {
    const ordered = allRoutes.filter(route => state.bookmarks.has(route));
    els.bookmarkList.innerHTML = ordered.length ? ordered.map(route => `
      <div class="bookmark-item">
        <button type="button" class="text-button" data-route="${route}">${escapeHtml(data.labels[route])}</button>
        <button type="button" class="icon-button" data-remove-bookmark="${route}" aria-label="Remove ${escapeHtml(data.labels[route])} bookmark">×</button>
      </div>`).join("") : `<div class="callout"><h3>No bookmarks yet</h3><p>Use the star in any module header to build a focused revision list.</p></div>`;
  }

  function openBookmarks() {
    renderBookmarks();
    if (typeof els.bookmarkDialog.showModal === "function") els.bookmarkDialog.showModal();
    else els.bookmarkDialog.setAttribute("open", "");
  }

  function closeBookmarks() {
    if (typeof els.bookmarkDialog.close === "function" && els.bookmarkDialog.open) els.bookmarkDialog.close();
    else els.bookmarkDialog.removeAttribute("open");
  }

  function initializeSearchIndex() {
    state.searchIndex = allRoutes.map(route => {
      const module = data.modules[route];
      let body = "";
      try { body = stripHtml(module.body()); } catch (_) { body = ""; }
      return {
        route,
        title: module.title,
        label: data.labels[route],
        summary: module.summary || "",
        text: `${module.title} ${data.labels[route]} ${module.summary || ""} ${body}`.toLowerCase()
      };
    });
  }

  function searchTerms(query) {
    return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  }

  function excerpt(item, terms) {
    const source = `${item.summary} ${item.text}`.replace(/\s+/g, " ");
    const lower = source.toLowerCase();
    const positions = terms.map(term => lower.indexOf(term)).filter(index => index >= 0);
    const start = positions.length ? Math.max(0, Math.min(...positions) - 70) : 0;
    const text = source.slice(start, start + 190).trim();
    return `${start > 0 ? "…" : ""}${text}${source.length > start + 190 ? "…" : ""}`;
  }

  function runSearch(query) {
    const terms = searchTerms(query);
    if (!terms.length) {
      els.searchResults.hidden = true;
      els.searchResults.innerHTML = "";
      return;
    }
    const results = state.searchIndex.map(item => {
      let score = 0;
      const title = `${item.title} ${item.label}`.toLowerCase();
      for (const term of terms) {
        if (title.includes(term)) score += 8;
        if (item.summary.toLowerCase().includes(term)) score += 4;
        if (item.text.includes(term)) score += 1;
      }
      if (terms.every(term => item.text.includes(term))) score += 5;
      return {...item, score};
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 9);

    els.searchResults.innerHTML = results.length ? results.map(item => `
      <button class="search-result" type="button" role="option" data-route="${item.route}">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(excerpt(item, terms))}</span>
      </button>`).join("") : `<div class="search-result"><strong>No matching module</strong><span>Try a valve name, murmur timing, examination sign, or intervention.</span></div>`;
    els.searchResults.hidden = false;
  }

  function closeSearch() {
    els.searchResults.hidden = true;
  }

  function systemTheme() {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme, persist = true) {
    const chosen = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = chosen;
    const next = chosen === "dark" ? "light" : "dark";
    els.theme.setAttribute("aria-label", `Switch to ${next} mode`);
    els.theme.title = `Switch to ${next} mode`;
    els.theme.textContent = chosen === "dark" ? "☀" : "◐";
    $("meta[name='theme-color']")?.setAttribute("content", chosen === "dark" ? "#06151a" : "#123d4a");
    if (persist) storage.set(KEY.theme, chosen);
  }

  function resetProgress() {
    if (!confirm("Reset visited-module progress? Bookmarks and study answers will remain.")) return;
    state.visited = new Set([state.route]);
    saveProgress();
    updateNavigation();
    updateProgress();
    showToast("Visited progress reset");
  }

  function clearAllBookmarks() {
    if (!state.bookmarks.size) return showToast("There are no bookmarks to clear");
    if (!confirm("Remove all bookmarks?")) return;
    state.bookmarks.clear();
    saveProgress();
    renderBookmarks();
    const button = $("[data-bookmark-route]");
    button?.classList.remove("is-saved");
    button?.setAttribute("aria-pressed", "false");
    showToast("All bookmarks cleared");
  }

  function handleDocumentClick(event) {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) {
      event.preventDefault();
      const route = routeButton.dataset.route;
      closeSearch();
      if (routeButton.closest("#bookmark-dialog")) closeBookmarks();
      navigate(route);
      return;
    }
    const bookmarkButton = event.target.closest("[data-bookmark-route]");
    if (bookmarkButton) {
      event.preventDefault();
      toggleBookmark(bookmarkButton.dataset.bookmarkRoute);
      return;
    }
    const remove = event.target.closest("[data-remove-bookmark]");
    if (remove) {
      event.preventDefault();
      toggleBookmark(remove.dataset.removeBookmark);
    }
  }

  function bindEvents() {
    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("hashchange", () => render(routeFromHash()));
    els.menu.addEventListener("click", openSidebar);
    els.sidebarClose.addEventListener("click", closeSidebar);
    els.scrim.addEventListener("click", closeSidebar);
    els.search.addEventListener("input", () => runSearch(els.search.value));
    els.search.addEventListener("keydown", event => {
      if (event.key === "Escape") { closeSearch(); els.search.blur(); }
      if (event.key === "ArrowDown" && !els.searchResults.hidden) {
        event.preventDefault();
        $(".search-result[data-route]", els.searchResults)?.focus();
      }
    });
    els.searchResults.addEventListener("keydown", event => {
      const options = $$(".search-result[data-route]", els.searchResults);
      const index = options.indexOf(document.activeElement);
      if (event.key === "ArrowDown") { event.preventDefault(); options[(index + 1) % options.length]?.focus(); }
      if (event.key === "ArrowUp") { event.preventDefault(); (index <= 0 ? els.search : options[index - 1])?.focus(); }
      if (event.key === "Escape") { closeSearch(); els.search.focus(); }
    });
    document.addEventListener("pointerdown", event => {
      if (!event.target.closest(".search-box") && !event.target.closest("#search-results")) closeSearch();
    });
    els.theme.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
    els.print.addEventListener("click", () => window.print());
    els.resetProgress.addEventListener("click", resetProgress);
    els.clearBookmarks.addEventListener("click", clearAllBookmarks);
    els.bookmarksButton.addEventListener("click", openBookmarks);
    els.closeBookmarks.addEventListener("click", closeBookmarks);
    els.bookmarkDialog.addEventListener("click", event => {
      if (event.target === els.bookmarkDialog) closeBookmarks();
    });
    document.addEventListener("keydown", event => {
      const editing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
      if (event.key === "/" && !editing) { event.preventDefault(); els.search.focus(); }
      if (event.key.toLowerCase() === "d" && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        const index = allRoutes.indexOf(state.route);
        if (index > 0) navigate(allRoutes[index - 1]);
      }
      if (event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        const index = allRoutes.indexOf(state.route);
        if (index < allRoutes.length - 1) navigate(allRoutes[index + 1]);
      }
      if (event.key === "Escape") closeSidebar();
    });
  }

  function init() {
    buildNavigation();
    initializeSearchIndex();
    bindEvents();
    study?.bindGlobal?.();
    const storedTheme = storage.get(KEY.theme, null);
    applyTheme(storedTheme || systemTheme(), false);
    if (!location.hash || !allRoutes.includes(routeFromHash())) history.replaceState(null, "", "#overview");
    render(routeFromHash(), {instant: true});
  }

  init();
})();
