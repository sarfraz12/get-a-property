// components/blog/PostContactForm.tsx
//
// Formulario de "cotización" que va debajo de la tarjeta del autor en
// la página de un post (el "Send Inquiry" de la referencia). Al
// enviarlo, se dispara un correo automático vía el mismo endpoint que
// ya usa el resto del sitio (pages/api/emailJs.js -> POST
// /api/emailJs) con los datos que la persona llenó en el formulario
// MÁS los datos del post desde el que se está escribiendo (título,
// categoría, fecha y el link directo al artículo), para que quien
// reciba el correo sepa exactamente sobre qué post es la consulta sin
// tener que preguntar. Ver el comentario en pages/api/emailJs.js para
// la salvedad de que hoy es la única API que usa esa ruta -- la
// página /contact manda el correo directo desde el navegador con
// @emailjs/browser.
"use client";

import { useState } from "react";

interface PostContactFormProps {
  lang: string;
  postTitle?: string;
  authorName?: string;
  postCategory?: string;
  postDate?: string;
  postSlug?: string;
}

const COPY: Record<
  string,
  { name: string; email: string; phone: string; subject: string; message: string; send: string; sending: string; success: string; error: string }
> = {
  es: {
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono (opcional)",
    subject: "Asunto (opcional)",
    message: "Hola, quisiera más información sobre este artículo...",
    send: "Enviar cotización",
    sending: "Enviando...",
    success: "¡Gracias! Te responderemos pronto con tu cotización.",
    error: "No se pudo enviar. Intenta de nuevo.",
  },
  en: {
    name: "Name",
    email: "Email",
    phone: "Phone (optional)",
    subject: "Subject (optional)",
    message: "Hi there, I would like more information about this article...",
    send: "Send quote request",
    sending: "Sending...",
    success: "Thanks! We'll get back to you soon with your quote.",
    error: "Something went wrong. Try again.",
  },
};

export default function PostContactForm({ lang, postTitle, authorName, postCategory, postDate, postSlug }: PostContactFormProps) {
  const t = COPY[lang] || COPY.es;

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    // Link directo al post (usa el origin del navegador, así funciona
    // igual en localhost, preview y producción sin hardcodear dominio).
    const postUrl =
      postSlug && typeof window !== "undefined" ? `${window.location.origin}/${lang}/all/post/${postSlug}` : undefined;

    // Todos los datos del post seleccionado, para que el correo que le
    // llega al negocio tenga contexto completo sin tener que preguntar.
    const postContext = [
      postTitle ? `Artículo: ${postTitle}` : null,
      postCategory ? `Categoría: ${postCategory}` : null,
      postDate ? `Fecha: ${postDate}` : null,
      authorName ? `Vendedor: ${authorName}` : null,
      postUrl ? `Link: ${postUrl}` : null,
      form.subject ? `Asunto: ${form.subject}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/emailJs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: postContext ? `Solicitud de cotización\n${postContext}\n\n${form.message}` : form.message,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-full border border-black/15 bg-white px-5 py-3 text-sm text-black placeholder:text-black/40 outline-none transition-colors focus:border-black";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required placeholder={t.name} value={form.name} onChange={update("name")} className={inputClass} />
        <input required type="email" placeholder={t.email} value={form.email} onChange={update("email")} className={inputClass} />
        <input placeholder={t.phone} value={form.phone} onChange={update("phone")} className={inputClass} />
        <input placeholder={t.subject} value={form.subject} onChange={update("subject")} className={inputClass} />
      </div>

      <textarea
        required
        rows={4}
        placeholder={t.message}
        value={form.message}
        onChange={update("message")}
        className="w-full rounded-2xl border border-black/15 bg-white px-5 py-4 text-sm text-black placeholder:text-black/40 outline-none transition-colors focus:border-black"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? t.sending : t.send}
      </button>

      {status === "success" && <p className="text-center text-xs font-semibold text-emerald-600">{t.success}</p>}
      {status === "error" && <p className="text-center text-xs font-semibold text-red-500">{t.error}</p>}
    </form>
  );
}
