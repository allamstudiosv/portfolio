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
    file: "https://media.allamstudios.space/Muhammed%20Al%20Andaulsi.mp4",
    poster: "/videos/thumbs/muhammed-al-andaulsi.jpg"
  },

  VIDEOS: [
    {
      id: "muhammed-al-andaulsi",
      title: { en: "A Re-edit for Muhammed Al Andaulsi", ar: "إعادة مونتاج لفيديو محمد الأندلسي" },
      description: { en: "re-edit featuring cinematic visuals, motion graphics, and storytelling, created to enhance the original video and deliver a more immersive visual experience.", ar: "إعادة مونتاج تجمع بين المشاهد السينمائية والموشن جرافيك والسرد القصصي، بهدف تطوير الفيديو الأصلي وتقديم تجربة بصرية أكثر غنى واندماجًا." },
      type: { en: "", ar: "" },
      role: { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:31",
      file: "https://media.allamstudios.space/Muhammed%20Al%20Andaulsi.mp4",
      thumb: "/videos/thumbs/muhammed-al-andaulsi.jpg"
    },
    {
      id: "historical-documentary",
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
      id: "ui-animation",
      title: { en: "UI animation", ar: "تحريك واجهات" },
      description: { en: "Exploring the art of UI animation through smooth transitions, dynamic interface elements, and expressive micro-interactions that bring digital experiences to life", ar: "استكشاف فن تحريك الواجهات من خلال انتقالات سلسة، وعناصر واجهة ديناميكية، وتفاعلات دقيقة معبّرة تضفي الحياة على التجارب الرقمية." },
      type:  { en: "Motion graphics · UI animation", ar: "موشن جرافيك · تحريك بأسلوب الواجهات" },
      role:  { en: "", ar: "" },
      tools: { en: "", ar: "" },
      duration: "0:07",
      file: "https://media.allamstudios.space/UI%20Animation.mp4",
      thumb: "/videos/thumbs/ui-animation.jpg",
      vertical: true
    },
    {
      id: "football-content-showreel",
      title: { en: "Football Content Showreel", ar: "مختارات من محتوى كرة القدم" },
      type: { en: "Video Editing & Motion Graphics", ar: "مونتاج الفيديو والموشن جرافيك" },
      tags: { en: "Video Editing · Motion Graphics · Visual Storytelling", ar: "مونتاج الفيديو · موشن جرافيك · السرد البصري" },
      description: { en: "A showcase of football content combining dynamic editing, creative motion graphics, and purposeful visual storytelling to deliver engaging visual experiences.", ar: "مجموعة من أعمال كرة القدم تجمع بين المونتاج الحيوي والموشن جرافيك الإبداعي والسرد البصري الهادف، لتقديم تجارب بصرية جذابة." },
      duration: "3 videos",
      clips: [1, 2, 3].map(n => ({
        file: "https://media.allamstudios.space/football-showreel-" + n + ".mp4",
        poster: "https://media.allamstudios.space/football-showreel-" + n + ".jpg",
        width: 1080, height: 1920
      })),
      thumb: "https://media.allamstudios.space/football-showreel-1.jpg"
    },
    {
      "id": "healthcare-awareness-character-animation",
      "title": {
        "en": "Healthcare Awareness – Character Animation",
        "ar": "التوعية الصحية – تحريك الشخصيات"
      },
      "type": {
        "en": "Motion Graphics & 2D Animation",
        "ar": "موشن جرافيك ورسوم متحركة ثنائية الأبعاد"
      },
      "role": {
        "en": "2D Character Animation & Motion Graphics",
        "ar": "تحريك الشخصيات ثنائية الأبعاد والموشن جرافيك"
      },
      "description": {
        "en": "A graduation project completed as part of a motion graphics course, focused on bringing pre-designed 2D characters to life through expressive animation, dynamic motion graphics, and visual storytelling. This is a course graduation project, not commercial client work. My role: 2D Character Animation & Motion Graphics; character illustration and design were not part of my role.",
        "ar": "مشروع تخرج أُنجز ضمن دورة في الموشن جرافيك، يركز على إضفاء الحياة على شخصيات ثنائية الأبعاد مصممة مسبقًا، من خلال التحريك التعبيري والموشن جرافيك الحيوي والسرد البصري. هذا مشروع تعليمي وليس عملًا تجاريًا لعميل. دوري: تحريك الشخصيات ثنائية الأبعاد وتنفيذ الموشن جرافيك، ولا يشمل رسم الشخصيات أو تصميمها."
      },
      "duration": "0:28",
      "file": "/videos/healthcare-awareness.mp4",
      "thumb": "/videos/thumbs/healthcare-awareness.jpg"
    }
  ],

  UI_PROJECTS: []
};
