// Cloudflare Pages Function for the contact form at /api/contact.
// Messages are stored in the D1 database bound as DB (see wrangler.jsonc).
// The Arabic page sends lang=ar, so replies and error pages come back in Arabic.

const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEXT = {
  en: {
    thanks: "/thanks",
    home: "/#contact",
    title: "Message not sent",
    back: "Back to the contact form",
    siteName: "Hamza Allam",
    format: "The form was sent in an unexpected format.",
    tooLong: "Your message is too long. Keep it under 5,000 characters.",
    unreadable: "The form couldn't be read. Go back and try again.",
    noName: "Add your name.",
    longName: `Shorten your name to ${LIMITS.name} characters.`,
    badEmail: "Enter a valid email address so I can reply.",
    noMessage: "Add a few details about your project.",
    longMessage: `Shorten your message to ${LIMITS.message.toLocaleString("en")} characters.`,
    server: "Your message wasn't saved because of a server problem. Try again in a few minutes."
  },
  ar: {
    thanks: "/ar/thanks",
    home: "/ar/#contact",
    title: "لم تُرسَل الرسالة",
    back: "العودة إلى نموذج التواصل",
    siteName: "حمزة علام",
    format: "أُرسل النموذج بتنسيق غير متوقع.",
    tooLong: "رسالتك طويلة جدًا. اجعلها أقل من 5,000 حرف.",
    unreadable: "تعذّرت قراءة النموذج. ارجع وحاول مرة أخرى.",
    noName: "أضف اسمك.",
    longName: `اختصر اسمك إلى ${LIMITS.name} حرف كحد أقصى.`,
    badEmail: "أدخل بريدًا إلكترونيًا صحيحًا حتى أتمكن من الرد.",
    noMessage: "أضف بعض التفاصيل عن مشروعك.",
    longMessage: `اختصر رسالتك إلى ${LIMITS.message.toLocaleString("en")} حرف كحد أقصى.`,
    server: "لم تُحفظ رسالتك بسبب مشكلة في الخادم. حاول مرة أخرى بعد بضع دقائق."
  }
};

export const onRequestPost = ({ request, env }) => handleContact(request, env);

export const onRequest = () =>
  new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });

// Before the form is parsed, guess the language from the page it came from.
function langFromReferer(request) {
  try {
    return new URL(request.headers.get("referer") || "").pathname.startsWith("/ar") ? "ar" : "en";
  } catch {
    return "en";
  }
}

async function handleContact(request, env) {
  let lang = langFromReferer(request);
  let t = TEXT[lang];

  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/x-www-form-urlencoded") && !type.includes("multipart/form-data")) {
    return errorPage(415, t.format, lang);
  }
  if (Number(request.headers.get("content-length") || 0) > 40000) {
    return errorPage(413, t.tooLong, lang);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return errorPage(400, t.unreadable, lang);
  }
  const field = (k) => (form.get(k) ?? "").toString().trim();

  if (field("lang") === "ar" || field("lang") === "en") {
    lang = field("lang");
    t = TEXT[lang];
  }

  // Honeypot: real visitors never see or fill this field. Pretend success for bots.
  if (field("bot-field")) return redirect(request, t.thanks);

  const name = field("name");
  const email = field("email");
  const message = field("message");

  const problems = [];
  if (!name) problems.push(t.noName);
  else if (name.length > LIMITS.name) problems.push(t.longName);
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) problems.push(t.badEmail);
  if (!message) problems.push(t.noMessage);
  else if (message.length > LIMITS.message) problems.push(t.longMessage);
  if (problems.length) return errorPage(400, problems.join(" "), lang);

  try {
    await env.DB.prepare(
      "INSERT INTO messages (name, email, message, country) VALUES (?1, ?2, ?3, ?4)"
    ).bind(name, email, message, request.cf?.country ?? null).run();
  } catch (err) {
    console.error("D1 insert failed:", err);
    return errorPage(500, t.server, lang);
  }

  return redirect(request, t.thanks);
}

function redirect(request, path) {
  return Response.redirect(new URL(path, request.url).toString(), 303);
}

function errorPage(status, text, lang = "en") {
  const t = TEXT[lang];
  const safe = text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const font = lang === "ar" ? '"Alexandria","Sora",Arial,sans-serif' : '"Sora","Alexandria",Arial,sans-serif';
  const html = `<!DOCTYPE html>
<html lang="${lang}"${lang === "ar" ? ' dir="rtl"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.title} | ${t.siteName}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="stylesheet" href="/fonts/fonts.css">
<style>
html{color-scheme:dark}
:root{--paper:#111318;--ink:#FFFFFF;--muted:#A3A9B5;--blue:#2878FF}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--paper);color:var(--ink);font-family:${font};font-size:1.125rem;line-height:1.7;padding:1.5rem}
h1{font-weight:800;font-size:clamp(2.2rem,7vw,4rem);line-height:1.2;margin:0 0 1rem}
p{color:var(--muted);max-width:40ch}
a{color:var(--blue);font-weight:600}
</style>
</head>
<body>
<main>
<h1>${t.title}</h1>
<p>${safe}</p>
<p><a href="${t.home}">${t.back}</a></p>
</main>
</body>
</html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}
