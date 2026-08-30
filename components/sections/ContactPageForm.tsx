// components/sections/ContactPageForm.tsx
//
// Formulario de la página /contact, rediseñado para calcar la
// referencia que enviaste: tarjeta gris redondeada con un label chico
// arriba de cada campo (Name / Email / Phone / Message), inputs en
// píldora blanca y un botón negro ancho al final.
//
// Reutiliza el mismo endpoint que ya usa el resto del sitio
// (pages/api/emailJs.js -> POST /api/emailJs), igual que
// NewsletterForm, PostContactForm y el formulario rápido de
// ContactCtaSection en el home. Ese endpoint ya se encarga de anexar
// el teléfono al mensaje si viene, así que acá sólo se arma
// {name, email, phone, message}.
"use client";

import { useState } from "react";

interface ContactPageFormProps {
  lang: string;
}

const COPY: Record<
  string,
  {
    name: string;
    email: string;
    phone: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    error: string;
  }
> = {
  es: {
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos en qué podemos ayudarte...",
    send: "Enviar mensaje",
    sending: "Enviando...",
    success: "¡Gracias! Recibimos tu mensaje y te responderemos pronto.",
    error: "No se pudo enviar. Intenta de nuevo.",
  },
  en: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    messagePlaceholder: "Tell us how we can help...",
    send: "Send message",
    sending: "Sending...",
    success: "Thanks! We received your message and will get back to you soon.",
    error: "Something went wrong. Please try again.",
  },
};

const emptyForm = { name: "", email: "", phone: "", message: "" };

export default function ContactPageForm({ lang }: ContactPageFormProps) {
  const t = COPY[lang] || COPY.es;

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/emailJs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `Nuevo mensaje desde la página de contacto.\n\n${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  }

  const labelClass = "mb-2 block text-sm font-semibold text-black/50";
  const inputClass =
    "w-full rounded-full border border-black/15 bg-white px-5 py-3.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors focus:border-black";

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-gray-50 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t.name}</label>
          <input required value={form.name} onChange={update("name")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.email}</label>
          <input required type="email" value={form.email} onChange={update("email")} className={inputClass} />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass}>{t.phone}</label>
        <input type="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
      </div>

      <div className="mt-5">
        <label className={labelClass}>{t.message}</label>
        <textarea
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          value={form.message}
          onChange={update("message")}
          className="w-full rounded-2xl border border-black/15 bg-white px-5 py-4 text-sm text-black placeholder:text-black/30 outline-none transition-colors focus:border-black"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? t.sending : t.send}
      </button>

      {status === "success" && (
        <p className="mt-3 text-center text-xs font-semibold text-emerald-600">{t.success}</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-center text-xs font-semibold text-red-500">{t.error}</p>
      )}
    </form>
  );
}
