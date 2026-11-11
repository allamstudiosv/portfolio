import {json,hash,readLimited,sameOrigin} from '../../lib/brief-utils.js';
import {STAGES,newToken,cookie,passwordHash,equal,rateLimit,session,createSession,canAccess} from '../../lib/portal-auth.js';
const emailOK=s=>typeof s==='string'&&s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const passwordOK=s=>typeof s==='string'&&s.length>=12&&s.length<=128;
const err=(code,status=400)=>json({error:code},status);
async function handle({request,env}){
 if(request.method!=='POST')return err('method',405);
 if(!sameOrigin(request))return err('forbidden',403);
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))return err('format',415);
 let d;try{d=JSON.parse(await readLimited(request,12000));if(!d||typeof d!=='object'||Array.isArray(d))throw 0;}catch{return err('invalid');}
 const db=env.DB;
 if(['employee_login','client_login','activate'].includes(d.action)){
  if(!await rateLimit(db,request,'auth',20))return err('rate',429);
  if(d.action==='employee_login'){
   if(!emailOK(d.email)||typeof d.password!=='string'||d.password.length>128)return err('credentials',401);
   const email=d.email.trim().toLowerCase();
   if(!await rateLimit(db,request,'account',8,email))return err('rate',429);
   const u=await db.prepare('SELECT * FROM portal_users WHERE email=?').bind(email).first();
   const candidate=await passwordHash(d.password,u?.password_salt||'missing-account-dummy-salt');
   if(!u||!u.active||!u.password_hash||!equal(candidate,u.password_hash))return err('credentials',401);
   return json({ok:true},200,{'Set-Cookie':cookie(await createSession(db,u.id,null))});
  }
  if(d.action==='client_login'){
   const code=typeof d.code==='string'?d.code.trim().replaceAll('-','').toLowerCase():'';
   if(!/^[a-f0-9]{48}$/.test(code))return err('code',401);
   const p=await db.prepare('SELECT id FROM portal_projects WHERE client_code_hash=?').bind(await hash(code)).first();
   if(!p)return err('code',401);
   return json({ok:true},200,{'Set-Cookie':cookie(await createSession(db,null,p.id))});
  }
  if(!emailOK(d.email)||!passwordOK(d.password)||typeof d.token!=='string'||!/^[a-f0-9]{48}$/.test(d.token))return err('activation');
  const u=await db.prepare('SELECT id FROM portal_users WHERE email=? AND invite_hash=? AND invite_expires>? AND active=1').bind(d.email.trim().toLowerCase(),await hash(d.token),Date.now()).first();
  if(!u)return err('activation');
  const salt=newToken(),password=await passwordHash(d.password,salt);
  const result=await db.prepare('UPDATE portal_users SET password_hash=?,password_salt=?,invite_hash=NULL,invite_expires=NULL WHERE id=? AND invite_hash=? AND invite_expires>?').bind(password,salt,u.id,await hash(d.token),Date.now()).run();
  if(!result.meta.changes)return err('activation');
  await db.prepare('DELETE FROM portal_sessions WHERE user_id=?').bind(u.id).run();
  return json({ok:true},200,{'Set-Cookie':cookie(await createSession(db,u.id,null))});
 }
 const s=await session(db,request);if(!s)return err('unauthorized',401);
 if(d.action==='logout'){await db.prepare('DELETE FROM portal_sessions WHERE token_hash=?').bind(s.tokenHash).run();return json({ok:true},200,{'Set-Cookie':cookie('',0)});}
 if(d.action==='me')return json({role:s.role||'client',email:s.email||null,projectId:s.project_id});
 if(d.action==='password'){
  if(!s.user_id)return err('forbidden',403);
  if(!passwordOK(d.password)||typeof d.current!=='string'||d.current.length>128)return err('password');
  const u=await db.prepare('SELECT password_hash,password_salt FROM portal_users WHERE id=?').bind(s.user_id).first();
  if(!await rateLimit(db,request,'password',8,s.user_id))return err('rate',429);
  if(!equal(await passwordHash(d.current,u.password_salt),u.password_hash))return err('credentials',401);
  const salt=newToken(),pw=await passwordHash(d.password,salt);
  await db.batch([db.prepare('UPDATE portal_users SET password_hash=?,password_salt=? WHERE id=?').bind(pw,salt,s.user_id),db.prepare('DELETE FROM portal_sessions WHERE user_id=?').bind(s.user_id)]);
  return json({ok:true},200,{'Set-Cookie':cookie(await createSession(db,s.user_id,null))});
 }
 if(['users','invite','deactivate'].includes(d.action)){
  if(s.role!=='admin')return err('forbidden',403);
  if(d.action==='users')return json({users:(await db.prepare('SELECT id,email,role,active,password_hash IS NOT NULL AS activated FROM portal_users ORDER BY email').all()).results});
  if(d.action==='deactivate'){
   if(typeof d.userId!=='string')return err('invalid');
   await db.batch([db.prepare("UPDATE portal_users SET active=0,invite_hash=NULL,invite_expires=NULL WHERE id=? AND role='employee'").bind(d.userId),db.prepare("DELETE FROM portal_sessions WHERE user_id IN (SELECT id FROM portal_users WHERE id=? AND role='employee')").bind(d.userId)]);return json({ok:true});
  }
  if(!emailOK(d.email))return err('email');
  if(!await rateLimit(db,request,'invite',20,s.user_id))return err('rate',429);
  const email=d.email.trim().toLowerCase(),old=await db.prepare('SELECT id,role FROM portal_users WHERE email=?').bind(email).first();
  if(old?.role==='admin')return err('forbidden',403);
  const token=newToken(),id=old?.id||crypto.randomUUID();
  await db.batch([db.prepare("INSERT INTO portal_users(id,email,role,invite_hash,invite_expires) VALUES(?,?,'employee',?,?) ON CONFLICT(email) DO UPDATE SET active=1,password_hash=NULL,password_salt=NULL,invite_hash=excluded.invite_hash,invite_expires=excluded.invite_expires").bind(id,email,await hash(token),Date.now()+7*86400000),db.prepare('DELETE FROM portal_sessions WHERE user_id=?').bind(id)]);
  return json({ok:true,invitation:new URL('/portal/#invite='+token,request.url).href});
 }
 if(d.action==='list'){
  if(!s.user_id)return err('forbidden',403);
  const offset=Math.max(0,Math.min(100000,parseInt(d.offset,10)||0));
  const rows=await db.prepare(`SELECT p.id,p.stage,p.progress,p.due_date,p.updated_at,p.assigned_to,b.client,b.project,b.created_at,b.read,u.email AS assignee FROM portal_projects p JOIN project_briefs b ON b.id=p.id LEFT JOIN portal_users u ON u.id=p.assigned_to ${s.role==='admin'?'':'WHERE p.assigned_to=?'} ORDER BY b.created_at DESC,p.id DESC LIMIT 50 OFFSET ?`).bind(...(s.role==='admin'?[]:[s.user_id]),offset).all();return json({rows:rows.results});
 }
 const id=s.project_id||d.id;
 if(typeof id!=='string'||id.length>40)return err('invalid');
 const p=await db.prepare('SELECT p.*,b.project,b.client,b.email,b.answers,b.created_at FROM portal_projects p JOIN project_briefs b ON b.id=p.id WHERE p.id=?').bind(id).first();
 if(!p||!canAccess(s,p))return err('not_found',404);
 if(d.action==='detail'){
  const updates=(await db.prepare('SELECT id,stage,progress,note,created_at FROM portal_updates WHERE project_id=? ORDER BY created_at DESC,rowid DESC LIMIT 100').bind(id).all()).results;
  if(s.user_id){await db.prepare('UPDATE project_briefs SET read=1 WHERE id=?').bind(id).run();const {client_code_hash,...safe}=p;return json({project:{...safe,hasCode:!!client_code_hash},updates});}
  return json({project:{project:p.project,stage:p.stage,progress:p.progress,due_date:p.due_date,updated_at:p.updated_at},updates});
 }
 if(!s.user_id)return err('forbidden',403);
 if(d.action==='assign'){
  if(s.role!=='admin')return err('forbidden',403);
  const uid=d.userId||null;
  if(uid&&!await db.prepare('SELECT id FROM portal_users WHERE id=? AND active=1').bind(uid).first())return err('invalid');
  await db.prepare('UPDATE portal_projects SET assigned_to=? WHERE id=?').bind(uid,id).run();return json({ok:true});
 }
 if(d.action==='issue_code'){
  if(s.role!=='admin')return err('forbidden',403);
  const code=newToken();await db.batch([db.prepare('UPDATE portal_projects SET client_code_hash=? WHERE id=?').bind(await hash(code),id),db.prepare('DELETE FROM portal_sessions WHERE project_id=?').bind(id)]);
  return json({code:code.match(/.{1,8}/g).join('-')});
 }
 if(d.action==='update'){
  if(!STAGES.includes(d.stage)||!Number.isInteger(d.progress)||d.progress<0||d.progress>100||typeof d.note!=='string'||!d.note.trim()||d.note.length>3000||typeof d.due_date!=='string')return err('invalid');
  if(d.due_date&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.due_date)||!Number.isFinite(Date.parse(d.due_date))||new Date(d.due_date).toISOString().slice(0,10)!==d.due_date))return err('invalid');
  // Recheck assignment in the writes so reassignment cannot race authorization.
  const guard=s.role==='admin'?'1=1':'assigned_to=?',args=s.role==='admin'?[]:[s.user_id];
  await db.batch([db.prepare(`INSERT INTO portal_updates(id,project_id,author_id,stage,progress,note) SELECT ?,id,?,?,?,? FROM portal_projects WHERE id=? AND ${guard}`).bind(crypto.randomUUID(),s.user_id,d.stage,d.progress,d.note.trim(),id,...args),db.prepare(`UPDATE portal_projects SET stage=?,progress=?,due_date=?,updated_at=datetime('now') WHERE id=? AND ${guard}`).bind(d.stage,d.progress,d.due_date,id,...args)]);
  return json({ok:true});
 }
 return err('invalid');
}
export async function onRequest(context){try{return await handle(context);}catch{console.error('Portal request failed');return err('unavailable',503);}}
