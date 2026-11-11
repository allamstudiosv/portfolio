import {hash,encoder} from './brief-utils.js';
export const SESSION_COOKIE='__Host-studio_session';
export const STAGES=['received','planning','production','review','revision','completed','on_hold'];
export const newToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
export const cookie=(token,age=28800)=>`${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
export async function passwordHash(password,salt){
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-512',salt:encoder.encode(salt),iterations:100000},key,256);
 return Array.from(new Uint8Array(bits),n=>n.toString(16).padStart(2,'0')).join('');
}
export function equal(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;return crypto.subtle.timingSafeEqual(encoder.encode(a),encoder.encode(b));}
export async function rateLimit(db,request,kind,limit,identity=''){
 const window=15*60*1000,now=Date.now();
 const key=await hash(`${kind}:${request.headers.get('cf-connecting-ip')||'local'}:${identity}:${Math.floor(now/window)}`);
 const row=await db.prepare('INSERT INTO portal_rate_limits(bucket,attempts,expires) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(key,now+window).first();
 await db.prepare('DELETE FROM portal_rate_limits WHERE expires<?').bind(now).run();
 return row.attempts<=limit;
}
export async function session(db,request){
 const token=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1);
 if(!token||!/^[a-f0-9]{48}$/.test(token))return null;
 const tokenHash=await hash(token);
 const s=await db.prepare('SELECT s.*,u.email,u.role,u.active FROM portal_sessions s LEFT JOIN portal_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires>?').bind(tokenHash,Date.now()).first();
 if(!s||(s.user_id&&!s.active))return null;
 return {...s,tokenHash};
}
export async function createSession(db,userId,projectId){
 const token=newToken();await db.prepare('DELETE FROM portal_sessions WHERE expires<?').bind(Date.now()).run();
 await db.prepare('INSERT INTO portal_sessions(token_hash,user_id,project_id,expires) VALUES(?,?,?,?)').bind(await hash(token),userId,projectId,Date.now()+28800000).run();return token;
}
export function canAccess(s,p){return s&&(s.role==='admin'||(s.role==='employee'&&p.assigned_to===s.user_id)||s.project_id===p.id);}
