// Cloudflare Pages Function for the contact form at /api/contact.
// Messages are stored in the D1 database bound as DB (see wrangler.jsonc).

const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost = ({ request, env }) => handleContact(request, env);

export const onRequest = () =>
  new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });

async function handleContact(request, env) {
  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/x-www-form-urlencoded") && !type.includes("multipart/form-data")) {
    return errorPage(415, "The form was sent in an unexpected format.");
  }
  if (Number(request.headers.get("content-length") || 0) > 20000) {
    return errorPage(413, "Your message is too long. Keep it under 5,000 characters.");
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return errorPage(400, "The form couldn't be read. Go back and try again.");
  }
  const field = (k) => (form.get(k) ?? "").toString().trim();

  // Honeypot: real visitors never see or fill this field. Pretend success for bots.
  if (field("bot-field")) return redirect(request, "/thanks");

  const name = field("name");
  const email = field("email");
  const message = field("message");

  const problems = [];
  if (!name) problems.push("Add your name.");
  else if (name.length > LIMITS.name) problems.push(`Shorten your name to ${LIMITS.name} characters.`);
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) problems.push("Enter a valid email address so I can reply.");
  if (!message) problems.push("Add a few details about your project.");
  else if (message.length > LIMITS.message) problems.push(`Shorten your message to ${LIMITS.message.toLocaleString("en")} characters.`);
  if (problems.length) return errorPage(400, problems.join(" "));

  try {
    await env.DB.prepare(
      "INSERT INTO messages (name, email, message, country) VALUES (?1, ?2, ?3, ?4)"
    ).bind(name, email, message, request.cf?.country ?? null).run();
  } catch (err) {
    console.error("D1 insert failed:", err);
    return errorPage(500, "Your message wasn't saved because of a server problem. Try again in a few minutes.");
  }

  return redirect(request, "/thanks");
}

function redirect(request, path) {
  return Response.redirect(new URL(path, request.url).toString(), 303);
}

function errorPage(status, text) {
  const safe = text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Message not sent | Hamza Allam</title>
<style>
:root{--paper:#EDF0F2;--ink:#17202B;--muted:#56636F;--blue:#1F4E79}
@media (prefers-color-scheme: dark){:root{--paper:#0F1C2B;--ink:#E4E9EE;--muted:#9AA8B5;--blue:#8DB8E2}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--paper);color:var(--ink);font-family:Georgia,serif;font-size:1.125rem;padding:1.5rem}
h1{font-family:Arial,sans-serif;font-weight:800;font-size:clamp(2.2rem,7vw,4rem);margin:0 0 1rem}
p{color:var(--muted);max-width:40ch}
a{color:var(--blue);font-family:Arial,sans-serif;font-weight:600}
</style>
</head>
<body>
<main>
<h1>Message not sent</h1>
<p>${safe}</p>
<p><a href="/#contact">Back to the contact form</a></p>
</main>
</body>
</html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}
