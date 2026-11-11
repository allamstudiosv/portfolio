import {BRIEF_FIELDS} from '../../public/assets/brief-schema.js';
import {json,hash,readLimited,sameOrigin,escapeHtml} from '../../lib/brief-utils.js';
export async function onRequest(context){
  const {request,env}=context;
  if(request.method!=='POST')return json({error:'Method not allowed'},405,{Allow:'POST'});
  if(!sameOrigin(request))return json({error:'Request not allowed'},403);
  let lang='en';
  const reply=(message,status=400)=>{
    if((request.headers.get('accept')||'').includes('application/json'))return json({error:message},status);
    return new Response(`<!doctype html><html lang="${lang}" ${lang==='ar'?'dir="rtl"':''}><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/assets/site.css"><main class="wrap"><section><h1>${lang==='ar'?'تعذّر إرسال الطلب':'Unable to send brief'}</h1><p>${escapeHtml(message)}</p><a href="${lang==='ar'?'/ar':''}/start-a-project/">${lang==='ar'?'العودة إلى النموذج':'Back to form'}</a></section></main></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  };
  if(!(request.headers.get('content-type')||'').startsWith('application/x-www-form-urlencoded'))return reply('Unsupported form format.',415);
  let form;try{form=new URLSearchParams(await readLimited(request));}catch{return reply('The form is too large.',413);}
  lang=form.get('lang')==='ar'?'ar':'en';const ar=lang==='ar';
  const success=()=> (request.headers.get('accept')||'').includes('application/json')?json({ok:true}):Response.redirect(new URL(ar?'/ar/brief-thanks/':'/brief-thanks/',request.url),303);
  if(form.get('bot-field'))return success();
  const answers={};
  for(const f of BRIEF_FIELDS){
    const values=form.getAll(f.id).map(s=>s.trim());const v=values[0]||'';
    const invalid=()=>reply(ar?`راجع إجابتك عن: ${f.label.ar}`:`Check your answer for: ${f.label.en}`);
    if(f.required&&!v)return invalid();
    if(f.options){if(values.some(v=>!f.options.some(o=>o.value===v))||(f.type==='radio'&&values.length>1))return invalid();answers[f.id]=f.type==='checkbox'?[...new Set(values)]:v;continue;}
    if(values.length>1||v.length>f.max)return invalid();
    if(v&&f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))return invalid();
    if(v&&f.type==='number'&&(!/^\d+$/.test(v)||Number(v)<1||Number(v)>999999))return invalid();
    if(v&&f.type==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v))return invalid();
    if(v&&f.type==='url'){try{if(!['http:','https:'].includes(new URL(v).protocol))return invalid();}catch{return invalid();}}
    answers[f.id]=v;
  }
  if(answers.start_date&&answers.deadline&&answers.deadline<answers.start_date)return reply(ar?'تاريخ التسليم يسبق تاريخ البدء. راجع التاريخين.':'Delivery date is before the start date. Please check both dates.');
  let id=form.get('request_id')||crypto.randomUUID();
  if(!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))return reply(ar?'أعد تحميل الصفحة وحاول مجددًا.':'Reload the form and try again.');
  try{
    const existing=await env.DB.prepare('SELECT answers FROM project_briefs WHERE id=?').bind(id).first();
    if(existing){if(existing.answers!==JSON.stringify(answers))return reply(ar?'تم استخدام رقم الطلب مسبقًا. أعد تحميل الصفحة لطلب جديد.':'This request was already used. Reload the page for a new request.',409);return success();}
    const ipHash=await hash(`${env.BRIEF_ADMIN_PASSWORD_HASH||'brief'}:${request.headers.get('cf-connecting-ip')||'local'}:${new Date().toISOString().slice(0,10)}`);
    const rate=await env.DB.prepare("SELECT count(*) AS count FROM project_briefs WHERE ip_hash=? AND created_at>datetime('now','-1 hour')").bind(ipHash).first();
    if(rate.count>=5)return reply(ar?'تم إرسال عدة طلبات مؤخرًا. حاول مرة أخرى لاحقًا.':'Several requests were sent recently. Please try again later.',429);
    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO project_briefs(id,lang,client,email,project,answers,ip_hash,email_status,notion_status) VALUES(?,?,?,?,?,?,?,'awaiting_setup','awaiting_setup')").bind(id,lang,answers.client,answers.email,answers.project||answers.client,JSON.stringify(answers),ipHash),
      env.DB.prepare('INSERT OR IGNORE INTO portal_projects(id) VALUES(?)').bind(id)
    ]);
    const saved=await env.DB.prepare('SELECT answers FROM project_briefs WHERE id=?').bind(id).first();
    if(saved.answers!==JSON.stringify(answers))return reply(ar?'أعد تحميل الصفحة لإرسال طلب جديد.':'Reload the page for a new request.',409);
    return success();
  }catch{console.error('Brief storage failed');return reply(ar?'لم يتم حفظ طلبك بسبب مشكلة مؤقتة. إجاباتك ما زالت موجودة؛ حاول مجددًا.':'Your request could not be saved. Your answers are still here; please try again.',503);}
}
