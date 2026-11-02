/* Renders the showreel, timeline, video grid, player and UI case studies.
   Content lives in content.js; this file shouldn't need editing. */
(function () {
  const LANG = document.documentElement.lang === "ar" ? "ar" : "en";
  const { SHOWREEL, VIDEOS, UI_PROJECTS } = window.SITE_CONTENT;

  const STRINGS = {
    en: {
      playReel: "Play showreel",
      reelEmpty: "Showreel coming soon.",
      jumpTo: t => `Jump to ${t}`,
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
      playReel: "تشغيل العرض",
      reelEmpty: "العرض قريبًا.",
      jumpTo: t => `الانتقال إلى ${t}`,
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
  const toSec = d => { const [m, s] = (d || "0:00").split(":").map(Number); return m * 60 + (s || 0); };
  const fmt = t => `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, "0")}`;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function embed(src, autoplay) {
    const ap = autoplay ? 1 : 0;
    if (src.youtube) return `<iframe src="https://www.youtube-nocookie.com/embed/${esc(src.youtube)}?autoplay=${ap}&rel=0" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (src.vimeo) return `<iframe src="https://player.vimeo.com/video/${esc(src.vimeo)}?autoplay=${ap}" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (src.file) return `<video src="${esc(src.file)}" controls ${autoplay ? "autoplay" : ""} playsinline></video>`;
    return "";
  }
  const hasSrc = v => v.youtube || v.vimeo || v.file;
  const thumbFor = v => v.thumb || (v.youtube ? `https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg` : "");

  // Showreel
  (function () {
    const reel = $("#reel");
    const poster = SHOWREEL.poster || thumbFor(SHOWREEL);
    reel.innerHTML = `<button class="reel-poster" type="button" ${poster ? `style="background-image:url('${esc(poster)}')"` : ""}>
        <span class="play">${esc(STRINGS.playReel)}</span></button>
        ${hasSrc(SHOWREEL) ? "" : `<p class="reel-empty">${esc(STRINGS.reelEmpty)}</p>`}`;
    reel.querySelector("button").addEventListener("click", () => {
      if (hasSrc(SHOWREEL)) reel.innerHTML = embed(SHOWREEL, true);
    });
  })();

  // Timeline
  (function () {
    const total = VIDEOS.reduce((a, v) => a + Math.max(toSec(v.duration), 1), 0);
    $("#ruler").innerHTML = [0, .25, .5, .75, 1].map(f => `<span>${fmt(total * f)}</span>`).join("");
    const track = $("#track");
    VIDEOS.forEach((v, i) => {
      const b = document.createElement("button");
      b.className = "clip";
      // Square root keeps a 12-minute video from swallowing a 20-second one
      b.style.setProperty("--len", Math.sqrt(Math.max(toSec(v.duration), 1)).toFixed(2));
      b.innerHTML = `${esc(L(v.title))}<span class="tc">${esc(v.duration)}</span>`;
      b.setAttribute("aria-label", STRINGS.jumpTo(L(v.title)));
      b.addEventListener("click", () => {
        const card = document.getElementById(`video-${i}`);
        card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
        card.classList.add("flash"); setTimeout(() => card.classList.remove("flash"), 1600);
      });
      track.appendChild(b);
    });
  })();

  // Video grid
  $("#videos").innerHTML = VIDEOS.map((v, i) => {
    const t = thumbFor(v);
    const meta = [L(v.type), L(v.role)].filter(Boolean).join(STRINGS.sep);
    return `<article class="video" id="video-${i}">
      <button type="button" data-i="${i}" aria-label="${esc(STRINGS.play(L(v.title)))}">
        <div class="thumb">${t ? `<img src="${esc(t)}" alt="" loading="lazy">` : `<span class="noimg">${esc(STRINGS.noThumb)}</span>`}
          <span class="dur tc">${esc(v.duration)}</span></div>
        <h3>${esc(L(v.title))}</h3>
        ${meta ? `<p class="meta">${esc(meta)}</p>` : ""}
        ${L(v.tools) ? `<p class="meta">${esc(L(v.tools))}</p>` : ""}
      </button></article>`;
  }).join("");

  // Player
  const dlg = $("#player");
  document.querySelectorAll(".video button").forEach(btn => btn.addEventListener("click", () => {
    const v = VIDEOS[btn.dataset.i];
    if (!hasSrc(v)) { alert(STRINGS.noVideo(L(v.title))); return; }
    $("#dlgFrame").innerHTML = embed(v, true);
    dlg.classList.toggle("tall", !!v.vertical);
    $("#dlgTitle").textContent = [L(v.title), L(v.type)].filter(Boolean).join(STRINGS.sep);
    dlg.showModal();
  }));
  $("#dlgClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { $("#dlgFrame").innerHTML = ""; });

  // UI case studies
  $("#cases").innerHTML = UI_PROJECTS.map(p => `<article class="case">
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
