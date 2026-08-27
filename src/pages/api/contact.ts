export const prerender = false;

import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido").max(100),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(7).max(30),
  objetivo: z.string().optional(),
  mensaje: z.string().min(5).max(2000),
  recaptchaToken: z.string().min(10, "reCAPTCHA requerido"),
});

async function verifyRecaptcha(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (remoteIp) params.append("remoteip", remoteIp);
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await res.json().catch(() => ({}));
  // v3: success && score >=0.5
  if (!data.success) return false;
  if (typeof data.score === "number") return data.score >= 0.5;
  return true;
}

async function sendBrevoEmail(payload: {
  nombre: string;
  email: string;
  telefono: string;
  objetivo?: string;
  mensaje: string;
}) {
  const apiKey = (import.meta as any).env?.BREVO_API_KEY || (process as any).env?.BREVO_API_KEY;
  const toEmail = (import.meta as any).env?.CONTACT_TO || (process as any).env?.CONTACT_TO || "laura@badi108realestate.com";
  const senderEmail = (import.meta as any).env?.BREVO_SENDER || (process as any).env?.BREVO_SENDER || "web@badi108realstate.com";
  const senderName = (import.meta as any).env?.BREVO_SENDER_NAME || "BADI 108 Web";

  if (!apiKey) {
    console.warn("BREVO_API_KEY no configurada, logueando lead sin enviar email");
    console.log("Lead:", payload, "->", toEmail);
    return { mocked: true };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail, name: "Laura BADI 108" }],
      replyTo: { email: payload.email, name: payload.nombre },
      subject: `Nuevo lead BADI 108 - ${payload.objetivo || "Contacto web"}`,
      htmlContent: `
        <h3>Nuevo contacto desde badi108realstate.com</h3>
        <p><b>Nombre:</b> ${payload.nombre}</p>
        <p><b>Email:</b> ${payload.email}</p>
        <p><b>Teléfono:</b> ${payload.telefono}</p>
        <p><b>Objetivo:</b> ${payload.objetivo || "-"}</p>
        <p><b>Mensaje:</b></p>
        <p>${(payload.mensaje || "").replace(/\n/g, "<br/>")}</p>
        <hr/><p style="font-size:12px;color:#888">Enviado desde Cloud Run SSR · ${new Date().toISOString()}</p>
      `,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Brevo error ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json();
}

export async function POST({ request, clientAddress }: { request: Request; clientAddress: string }) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, string> = {};
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) data[k] = String(v);
    }

    const parsed = schema.safeParse({
      nombre: data.nombre || data.name || "",
      email: data.email || "",
      telefono: data.telefono || data.phone || data.tel || "",
      objetivo: data.objetivo || data.objective || data.asunto || "",
      mensaje: data.mensaje || data.message || data.mensaje || "",
      recaptchaToken: data.recaptchaToken || data["g-recaptcha-response"] || "",
    });

    if (!parsed.success) {
      return new Response(JSON.stringify({ ok: false, error: "Datos inválidos", details: parsed.error.flatten() }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const secret = (import.meta as any).env?.RECAPTCHA_SECRET || (process as any).env?.RECAPTCHA_SECRET || (import.meta as any).env?.RECAPTCHA_SECRET_KEY || (process as any).env?.RECAPTCHA_SECRET_KEY;
    if (secret) {
      const ok = await verifyRecaptcha(parsed.data.recaptchaToken, secret, clientAddress);
      if (!ok) return new Response(JSON.stringify({ ok: false, error: "reCAPTCHA falló, intenta de nuevo" }), { status: 400, headers: { "Content-Type": "application/json" } });
    } else {
      console.warn("RECAPTCHA_SECRET no configurada, saltando verificación (no recomendado en prod)");
    }

    await sendBrevoEmail(parsed.data);

    // Opcional: crear lead en Tokko (si se desea, descomentar y configurar)
    // const tokkoKey = (import.meta as any).env?.TOKKO_API_KEY || (process as any).env?.TOKKO_API_KEY;
    // if (tokkoKey) { await fetch(`https://www.tokkobroker.com/api/v1/contact/?key=${tokkoKey}&format=json&lang=es_ar`, { method: "POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ name: parsed.data.nombre, email: parsed.data.email, phone: parsed.data.telefono, message: parsed.data.mensaje }) }).catch(()=>{}) }

    return new Response(JSON.stringify({ ok: true, message: "Mensaje enviado" }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("contact API error", err);
    return new Response(JSON.stringify({ ok: false, error: err?.message || "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
