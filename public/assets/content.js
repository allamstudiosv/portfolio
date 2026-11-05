/* =====================================================================
   PORTFOLIO CONTENT, shared by the English (/) and Arabic (/ar/) pages.
   Edit this file to add or change videos and UI projects; both
   languages update together.

   Text fields take both languages: { en: "...", ar: "..." }.
   Leave a language empty ("") to hide that line on that page.

   Video sources (use ONE per item):
     youtube: "VIDEO_ID"          from youtube.com/watch?v=VIDEO_ID
     vimeo:   "VIDEO_ID"          from vimeo.com/VIDEO_ID
     file:    "/videos/clip.mp4"  a file in public/videos (under 25 MB),
                                  or a full https:// link (e.g. R2)
   vertical: true   for 9:16 videos, so the player opens tall
   thumb:    optional image path (YouTube videos get one automatically)
   duration: "m:ss", also sets each clip's width on the timeline
   ===================================================================== */

window.SITE_CONTENT = {
  SHOWREEL: {
    youtube: "",
    vimeo: "",
    file: "https://pub-0b2ca809847b423981bcb0f5bcc7e2b2.r2.dev/Muhammed%20Al%20Andaulsi.mp4",
    poster: "/videos/thumbs/muhammed-al-andaulsi.jpg"
  },

  VIDEOS: [
    {
      title: { en: "Muhammed Al Andaulsi", ar: "محمد الأندلسي" },
      type: { en: "", ar: "" },
      role: { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:31",
      file: "https://pub-0b2ca809847b423981bcb0f5bcc7e2b2.r2.dev/Muhammed%20Al%20Andaulsi.mp4",
      thumb: "/videos/thumbs/muhammed-al-andaulsi.jpg"
    },
    {
      title: { en: "Historical documentary", ar: "فيلم وثائقي تاريخي" },
      type:  { en: "Motion graphics", ar: "موشن جرافيكس" },
      role:  { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:28",
      file: "/videos/historical-documentary.mp4",
      thumb: "/videos/thumbs/historical-documentary.jpg"
    },
    {
      title: { en: "UI animation", ar: "تحريك واجهات" },
      type:  { en: "UI motion design", ar: "تصميم حركة الواجهات" },
      role:  { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:07",
      file: "https://pub-0b2ca809847b423981bcb0f5bcc7e2b2.r2.dev/UI%20Animation.mp4",
      thumb: "/videos/thumbs/ui-animation.jpg",
      vertical: true
    }
  ],

  UI_PROJECTS: [
    {
      title:   { en: "App name", ar: "اسم التطبيق" },
      kind:    { en: "Mobile app redesign", ar: "إعادة تصميم تطبيق جوال" },
      problem: { en: "What was hard or broken for users before you started.",
                 ar: "ما الذي كان صعبًا أو معطّلًا على المستخدمين قبل أن تبدأ." },
      work:    { en: "What you did: research, wireframes, components, prototype.",
                 ar: "ما قمت به: البحث، المخططات الأولية، المكوّنات، النموذج التفاعلي." },
      result:  { en: "What changed: clearer flow, fewer steps, feedback received.",
                 ar: "ما الذي تغيّر: تدفّق أوضح، خطوات أقل، وآراء المستخدمين." },
      tools:   { en: "Figma", ar: "Figma" },
      image: "", prototype: "#", caseStudy: "#"
    },
    {
      title:   { en: "Website name", ar: "اسم الموقع" },
      kind:    { en: "Landing page design", ar: "تصميم صفحة هبوط" },
      problem: { en: "The goal of the page and who it was for.",
                 ar: "هدف الصفحة والجمهور الموجّهة إليه." },
      work:    { en: "Layout, visual direction, and responsive versions you designed.",
                 ar: "التخطيط والاتجاه البصري والنسخ المتجاوبة التي صمّمتها." },
      result:  { en: "The outcome or what you learned.",
                 ar: "النتيجة أو ما تعلّمته." },
      tools:   { en: "Figma, HTML, CSS", ar: "Figma، HTML، CSS" },
      image: "", prototype: "#", caseStudy: "#"
    }
  ]
};
