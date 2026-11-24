/* Renders the video grid, player and UI case studies.
   Content lives in content.js; this file shouldn't need editing. */
(function () {
  const LANG = document.documentElement.lang === "ar" ? "ar" : "en";
  const { VIDEOS, UI_PROJECTS } = window.SITE_CONTENT;

  const STRINGS = {
    en: {

      share: "Share video", copied: "Link copied", copyPrompt: "Copy this video link:",
      play: t => `Play ${t}`,
      noThumb: "Add a thumbnail",
      noVideo: t => `"${t}" isn't available yet.`,
      noShot: "Add a screenshot or mockup",
      shotAlt: t => `Screens from ${t}`,
      problem: "The problem", work: "What I did", result: "The result", tools: "Tools",
      prototype: "View prototype", caseStudy: "Read case study",
      sep: ". "
    },
    ar: {

      share: "مشاركة الفيديو", copied: "تم نسخ الرابط", copyPrompt: "انسخ رابط الفيديو:",
      play: t => `تشغيل ${t}`,
      noThumb: "أضف صورة مصغّرة",
      noVideo: t => `«${t}» غير متاح بعد.`,
      noShot: "أضف لقطة شاشة أو نموذجًا",
      shotAlt: t => `شاشات من ${t}`,
      problem: "المشكلة", work: "ما قمت به", result: "النتيجة", tools: "الأدوات",
      prototype: "عرض النموذج التفاعلي", caseStudy: "قراءة دراسة الحالة",
      sep: " · "
    }
  }[LANG];

  const L = v => (v && typeof v === "object") ? (v[LANG] ?? v.en ?? "") : (v ?? "");
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function embed(src, autoplay) {
    const ap = autoplay ? 1 : 0;
    if (src.youtube) return `<iframe src="https://www.youtube-nocookie.com/embed/${esc(src.youtube)}?autoplay=${ap}&rel=0" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (src.vimeo) return `<iframe src="https://player.vimeo.com/video/${esc(src.vimeo)}?autoplay=${ap}" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (src.file) return `<video src="${esc(src.file)}" controls ${autoplay ? "autoplay" : ""} playsinline></video>`;
    return "";
  }
  const hasSrc = v => v.youtube || v.vimeo || v.file || v.clips?.length;
  const thumbFor = v => v.thumb || (v.youtube ? `https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg` : "");

  // Video grid
  if ($("#videos")) $("#videos").innerHTML = VIDEOS.map((v, i) => {
    const t = thumbFor(v);
    const meta = [L(v.type), L(v.role)].filter(Boolean).join(STRINGS.sep);
    return `<article class="video" id="video-${i}">
      <button type="button" data-i="${i}" aria-label="${esc(STRINGS.play(L(v.title)))}">
        <div class="thumb${v.clips ? " collection-thumb" : ""}">${t ? `<img src="${esc(t)}" alt="" loading="lazy">` : `<span class="noimg">${esc(STRINGS.noThumb)}</span>`}
          <span class="video-play-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 4.5v15l12-7.5z"/></svg></span><span class="dur tc">${v.clips ? (LANG === "ar" ? "٣ فيديوهات" : "3 videos") : esc(v.duration)}</span></div>
        <h3>${esc(L(v.title))}</h3>
        ${meta ? `<p class="meta">${esc(meta)}</p>` : ""}
        ${L(v.tools) ? `<p class="meta">${esc(L(v.tools))}</p>` : ""}
      </button><button type="button" class="video-share" data-share="${i}" aria-label="${esc(STRINGS.share + ": " + L(v.title))}">${STRINGS.share}</button><span class="share-status" role="status"></span></article>`;
  }).join("");

  // Load a silent preview only when a pointer enters a project.
  const dlg = $("#player");
  const previews = [];
  const hoverMedia = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll(".video button[data-i]").forEach(btn => {
    const v = VIDEOS[btn.dataset.i];
    let preview, active = false;
    const stop = () => {
      active = false;
      if (preview) { preview.pause(); preview.currentTime = 0; preview.classList.remove("is-playing"); }
    };
    previews.push(stop);
    btn.addEventListener("pointerenter", e => {
      if (e.pointerType === "touch" || !hoverMedia.matches || reducedMotion.matches || dlg?.open || !v.file) return;
      previews.forEach(pause => pause());
      active = true;
      if (!preview) {
        preview = document.createElement("video");
        preview.className = "video-preview";
        preview.muted = true; preview.loop = true; preview.playsInline = true;
        preview.preload = "none"; preview.setAttribute("aria-hidden", "true");
        preview.src = v.file;
        btn.querySelector(".thumb").append(preview);
        preview.addEventListener("playing", () => {
          if (active) preview.classList.add("is-playing"); else preview.pause();
        });
      }
      preview.play().catch(() => preview.classList.remove("is-playing"));
    });
    btn.addEventListener("pointerleave", stop);
    btn.addEventListener("click", () => {
      openVideo(v, true);
      const url = new URL(location.href);
      url.hash = "video=" + v.id;
      history.replaceState(null, "", url);
      syncLanguageLink();
    });
  });
  let collectionObserver;
  function openVideo(v, autoplay = false) {
    if (!dlg || !hasSrc(v)) return;
    previews.forEach(pause => pause());
    collectionObserver?.disconnect();
    dlg.classList.toggle("project-collection", !!v.clips?.length);
    $("#dlgFrame").innerHTML = v.clips?.length
      ? '<div class="project-clips">' + v.clips.map((clip, i) => `<figure><video data-src="${esc(clip.file)}" poster="${esc(clip.poster)}" width="${clip.width}" height="${clip.height}" autoplay loop muted playsinline controls preload="none" aria-label="${esc(L(v.title))} — ${i + 1}"></video><figcaption>${LANG === "ar" ? "الفيديو" : "Video"} ${i + 1}</figcaption></figure>`).join('') + '</div>'
      : embed(v, autoplay);
    dlg.classList.toggle("tall", !!v.vertical);
    $("#dlgTitle").textContent = L(v.title);
    if ($("#dlgDescription")) $("#dlgDescription").textContent = L(v.description);
    $(".project-extra")?.remove();
    if (v.clips?.length) {
      const extra = document.createElement("div");
      extra.className = "project-extra";
      extra.innerHTML = '<p class="project-category">' + esc(L(v.type)) + '</p><p class="project-tags">' + esc(L(v.tags)) + '</p>';
      $(".project-dialog-copy").append(extra);
    }
    document.body.classList.add("project-open");
    if (!dlg.open) dlg.showModal();
    if (v.clips?.length) {
      collectionObserver = new IntersectionObserver(entries => {
        entries.forEach(({target: video, isIntersecting}) => {
          if (isIntersecting) {
            if (!video.src) video.src = video.dataset.src;
            video.muted = true;
            video.play().catch(() => {});
          } else video.pause();
        });
      }, { root: dlg, threshold: 0.1 });
      $("#dlgFrame").querySelectorAll("video").forEach(video => collectionObserver.observe(video));
    }
  }
  function syncLanguageLink() {
    const link = $(".lang");
    if (link) { const url = new URL(link.href); url.hash = location.hash; link.href = url.href; }
  }
  function openLinkedVideo() {
    const id = new URLSearchParams(location.hash.slice(1)).get("video");
    const video = VIDEOS.find(v => v.id === id);
    if (video) openVideo(video);
    else if (dlg?.open) dlg.close();
    syncLanguageLink();
  }
  document.querySelectorAll("[data-share]").forEach(button => {
    button.addEventListener("click", async () => {
      const video = VIDEOS[button.dataset.share];
      const url = new URL(LANG === "ar" ? "/ar/work/" : "/work/", location.origin);
      url.hash = "video=" + video.id;
      const status = button.nextElementSibling;
      status.textContent = "";
      try { await navigator.clipboard.writeText(url.href); status.textContent = STRINGS.copied; }
      catch { window.prompt(STRINGS.copyPrompt, url.href); }
    });
  });
  window.addEventListener("hashchange", openLinkedVideo);
  document.addEventListener("visibilitychange", () => { if (document.hidden) previews.forEach(stop => stop()); });
  reducedMotion.addEventListener("change", () => previews.forEach(stop => stop()));
  $("#dlgClose")?.addEventListener("click", () => dlg.close());
  dlg?.addEventListener("click", e => {
    const r = dlg.getBoundingClientRect();
    if (e.target === dlg && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dlg.close();
  });
  dlg?.addEventListener("close", () => {
    if (dlg.open) return;
    collectionObserver?.disconnect();
    const url = new URL(location.href);
    if (new URLSearchParams(url.hash.slice(1)).has("video")) {
      url.hash = "";
      history.replaceState(null, "", url);
    }
    syncLanguageLink();
    $("#dlgFrame").innerHTML = "";
    document.body.classList.remove("project-open");
  });

  openLinkedVideo();

  // UI case studies
  if ($("#cases")) $("#cases").innerHTML = UI_PROJECTS.map(p => `<article class="case">
    <div class="shot">${p.image ? `<img src="${esc(p.image)}" alt="${esc(STRINGS.shotAlt(L(p.title)))}" loading="lazy">` : esc(STRINGS.noShot)}</div>
    <div>
      <h3>${esc(L(p.title))}</h3>
      <p class="kind">${esc(L(p.kind))}</p>
      <dl>
        <div><dt>${STRINGS.problem}</dt><dd>${esc(L(p.problem))}</dd></div>
        <div><dt>${STRINGS.work}</dt><dd>${esc(L(p.work))}</dd></div>
        <div><dt>${STRINGS.result}</dt><dd>${esc(L(p.result))}</dd></div>
        <div><dt>${STRINGS.tools}</dt><dd>${esc(L(p.tools))}</dd></div>
      </dl>
      <p class="links"><a href="${esc(p.prototype)}">${STRINGS.prototype}</a><a href="${esc(p.caseStudy)}">${STRINGS.caseStudy}</a></p>
    </div></article>`).join("");
})();
