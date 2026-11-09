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
      description: { en: "A video editing project for Muhammed Al Andaulsi. Watch the complete 31-second clip here.", ar: "مشروع مونتاج فيديو لمحمد الأندلسي. شاهد المقطع كاملًا بمدة 31 ثانية." },
      type: { en: "", ar: "" },
      role: { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:31",
      file: "https://pub-0b2ca809847b423981bcb0f5bcc7e2b2.r2.dev/Muhammed%20Al%20Andaulsi.mp4",
      thumb: "/videos/thumbs/muhammed-al-andaulsi.jpg"
    },
    {
      title: { en: "Historical documentary", ar: "فيلم وثائقي تاريخي" },
      description: { en: "A short historical documentary segment using motion graphics to present historical information visually.", ar: "مقطع وثائقي تاريخي قصير يوظّف الموشن جرافيك لعرض المعلومات التاريخية بصريًا." },
      type:  { en: "Motion graphics", ar: "موشن جرافيكس" },
      role:  { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:28",
      file: "/videos/historical-documentary.mp4",
      thumb: "/videos/thumbs/historical-documentary.jpg"
    },
    {
      title: { en: "UI animation", ar: "تحريك واجهات" },
      description: { en: "A short motion graphics piece in the style of UI animation, presented in a vertical format.", ar: "عمل موشن جرافيك قصير بأسلوب تحريك عناصر الواجهات، معروض بتنسيق رأسي." },
      type:  { en: "Motion graphics · UI animation", ar: "موشن جرافيك · تحريك بأسلوب الواجهات" },
      role:  { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:07",
      file: "https://pub-0b2ca809847b423981bcb0f5bcc7e2b2.r2.dev/UI%20Animation.mp4",
      thumb: "/videos/thumbs/ui-animation.jpg",
      vertical: true
    }
  ],

  UI_PROJECTS: []
};
