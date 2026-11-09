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
      title: { en: "A Re-edit for Muhammed Al Andaulsi", ar: "إعادة مونتاج لفيديو محمد الأندلسي" },
      description: { en: "re-edit featuring cinematic visuals, motion graphics, and storytelling, created to enhance the original video and deliver a more immersive visual experience.", ar: "إعادة مونتاج تجمع بين المشاهد السينمائية والموشن جرافيك والسرد القصصي، بهدف تطوير الفيديو الأصلي وتقديم تجربة بصرية أكثر غنى واندماجًا." },
      type: { en: "", ar: "" },
      role: { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:31",
      file: "https://pub-0b2ca809847b423981bcb0f5bcc7e2b2.r2.dev/Muhammed%20Al%20Andaulsi.mp4",
      thumb: "/videos/thumbs/muhammed-al-andaulsi.jpg"
    },
    {
      title: { en: "Historical documentary", ar: "فيلم وثائقي تاريخي" },
      description: { en: "A motion graphics project created for a historical documentary. I focused on designing visuals that evoke a sense of heritage through animated maps, title design, and the cinematic integration of historical elements. I used motion, lighting, and aged textures to create a cohesive visual identity that supports the content and captures the viewer’s attention, with all animation and effects produced in Adobe After Effects.", ar: "مشروع موشن جرافيك تم تنفيذه لفيديو وثائقي تاريخي، ركزت فيه على تصميم مشاهد بصرية تعكس الطابع التراثي من خلال تحريك الخرائط، وتصميم العناوين، ودمج العناصر التاريخية بطريقة سينمائية. اعتمدت على استخدام الحركة، والإضاءة، والخامات القديمة لإضفاء هوية بصرية متناسقة تدعم المحتوى وتلفت انتباه المشاهد، مع تنفيذ جميع التحريكات والمؤثرات داخل Adobe After Effects." },
      type:  { en: "Motion graphics", ar: "موشن جرافيكس" },
      role:  { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:28",
      file: "/videos/historical-documentary.mp4",
      thumb: "/videos/thumbs/historical-documentary.jpg"
    },
    {
      title: { en: "UI animation", ar: "تحريك واجهات" },
      description: { en: "Exploring the art of UI animation through smooth transitions, dynamic interface elements, and expressive micro-interactions that bring digital experiences to life", ar: "استكشاف فن تحريك الواجهات من خلال انتقالات سلسة، وعناصر واجهة ديناميكية، وتفاعلات دقيقة معبّرة تضفي الحياة على التجارب الرقمية." },
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
