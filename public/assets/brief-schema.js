// Shared source for the bilingual form and server-side validation.
const text = (id, ar, en, type = 'text', max = 300) => ({id, label:{ar,en}, type, max});
const choice = (id, ar, en, type, options) => ({id,label:{ar,en},type,options:options.map(([value,ar,en])=>({value,label:{ar,en}}))});
export const BRIEF_GROUPS = [
  {title:{ar:'بيانات العميل',en:'About you'},fields:[
    {...text('client','اسم العميل أو الشركة','Client or company name'),required:true},
    text('contact','مسؤول التواصل','Contact person'),
    {...text('email','البريد الإلكتروني','Email address','email',254),required:true},
    text('phone','الهاتف أو واتساب','Phone or WhatsApp','tel',80),
    text('website','الموقع أو الحسابات (إن وجدت)','Website or social accounts (if any)','textarea',1500)
  ]},
  {title:{ar:'تفاصيل المشروع',en:'Your project'},fields:[
    text('project','اسم المشروع','Project name'),
    choice('service','نوع الخدمة','Service type','radio',[
      ['editing','مونتاج فيديو','Video editing'],['editing-motion','مونتاج فيديو مصحوب بموشن جرافيك','Video editing with motion graphics'],['motion','موشن جرافيك','Motion graphics'],['advert','فيديو إعلاني','Promotional video'],['other','أخرى','Other']]),
    text('description','وصف المشروع','Project description','textarea',5000),
    choice('goals','هدف المشروع','Project goals','checkbox',[
      ['sales','زيادة المبيعات','Increase sales'],['introduce','التعريف بمنتج أو خدمة','Introduce a product or service'],['engagement','زيادة التفاعل والمشاهدات','Increase engagement and views'],['education','محتوى تعليمي أو توعوي','Educational or awareness content'],['identity','بناء الهوية البصرية','Build a visual identity'],['other','أخرى','Other']]),
    text('audience','الجمهور المستهدف','Target audience','textarea',2000)
  ]},
  {title:{ar:'الفيديوهات ومنصات النشر',en:'Videos and platforms'},fields:[
    text('count','عدد الفيديوهات','Number of videos','number',6),
    choice('video_type','نوع الفيديو','Video type','radio',[
      ['short','ريل / فيديو قصير','Reel / short video'],['long','فيديو طويل','Long-form video']]),
    text('duration','مدة كل فيديو','Length of each video'),
    choice('platforms','منصات النشر','Publishing platforms','checkbox',[
      ['instagram','Instagram','Instagram'],['tiktok','TikTok','TikTok'],['youtube','YouTube','YouTube'],['facebook','Facebook','Facebook'],['website','الموقع الإلكتروني','Website'],['other','أخرى','Other']]),
    choice('ratios','ما أبعاد الفيديو المطلوبة؟','Which video aspect ratios do you need?','checkbox',[
      ['vertical','عمودي 9:16','Vertical 9:16'],['horizontal','أفقي 16:9','Horizontal 16:9'],['square','مربع 1:1','Square 1:1'],['multiple','أكثر من مقاس','Multiple formats'],['recommend','أحتاج إلى اقتراح من الاستوديو','I need a recommendation from the studio']]),
    text('language','لغة المحتوى','Content language')
  ]},
  {title:{ar:'الأسلوب والمراجع',en:'Style and references'},fields:[
    choice('identity','هل توجد هوية بصرية؟','Do you have a visual identity?','radio',[
      ['yes','نعم، سأرسل ملفات الهوية','Yes, I will send the brand assets'],['no','لا','No'],['help','أحتاج مساعدة في تحديد الأسلوب','I need help defining the style']]),
    text('style','ما أسلوب المونتاج أو التصميم الذي تفضله؟','What editing or design style do you prefer?','textarea',2000),
    text('reference_1','مرجع فيديو 1','Video reference 1','url',2000),
    text('reference_2','مرجع فيديو 2','Video reference 2','url',2000),
    text('reference_3','مرجع فيديو 3','Video reference 3','url',2000),
    text('reference_notes','ما أعجبك بالمراجع','What do you like about these references?','textarea',3000),
    text('avoid','أساليب لا تريدها','Styles you want to avoid','textarea',2000)
  ]},
  {title:{ar:'المواد المتاحة',en:'Available assets'},fields:[
    choice('assets','المواد المتاحة','Available assets','checkbox',[
      ['footage','فيديوهات مصورة','Recorded footage'],['script','سكريبت جاهز','Completed script'],['voiceover','تعليق صوتي مسجل','Recorded voiceover'],['branding','لوجو وهوية بصرية','Logo and brand identity'],['graphics','صور ورسومات','Images and graphics'],['projects','ملفات مشروع سابقة','Previous project files'],['none','لا توجد مواد جاهزة','No assets ready yet']]),
    text('assets_url','رابط المواد','Link to assets','url',2000),
    text('missing_assets','مواد ناقصة للمناقشة','Missing assets to discuss','textarea',2000)
  ]},
  {title:{ar:'المواعيد والميزانية',en:'Timeline and budget'},fields:[
    text('start_date','تاريخ البدء المرغوب','Preferred start date','date',10),
    text('deadline','تاريخ التسليم المطلوب','Requested delivery date','date',10),
    choice('fixed_deadline','هل موعد التسليم ثابت ومرتبط بمناسبة أو حملة؟','Is the deadline fixed and tied to an event or campaign?','radio',[
      ['yes','نعم','Yes'],['no','لا، مرن','No, it is flexible']]),
    text('deadline_details','تفاصيل الموعد الثابت','Fixed deadline details','textarea',2000),
    text('budget','الميزانية التقريبية','Approximate budget'),
    text('notes','ملاحظات إضافية','Additional notes','textarea',3000)
  ]}
];
export const BRIEF_FIELDS = BRIEF_GROUPS.flatMap(group=>group.fields);
