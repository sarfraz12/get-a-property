// components/navigation/NewsletterForm.tsx
//
// Barra de "Suscribirme" en píldora que se ve en la referencia del
// nuevo footer (input redondeado + botón negro pegado a la derecha).
//
// Es un componente de cliente aparte (en vez de vivir dentro de
// footer.js, que es un Server Component async) porque necesita estado
// local para el input y para mostrar el mensaje de éxito/error.
//
// Reutiliza el mismo endpoint que ya usa el formulario de contacto del
// home (pages/api/emailJs.js -> POST /api/emailJs), enviando el correo
// ingresado como una notificación. IMPORTANTE (ver comentarios en
// ContactCtaSection.tsx y en pages/api/emailJs.js): ese endpoint hoy
// dispara un correo puntual, NO agrega el email a una lista de
// newsletter real. Si más adelante quieres una lista de suscriptores
// de verdad (para enviar campañas), lo correcto es integrar un
// proveedor como Mailchimp / Brevo / ConvertKit y cambiar sólo el
// "fetch" de este componente para apuntar a esa integración.
"use client";

import { useState } from "react";

interface NewsletterFormProps {
  lang: string;
}

const COPY: Record<string, { placeholder: string; button: string; sending: string; success: string; error: string }> = {
  es: {
    placeholder: "Tu correo electrónico",
    button: "Suscribirme",
    sending: "Enviando...",
    success: "¡Gracias por suscribirte!",
    error: "No se pudo enviar. Intenta de nuevo.",
  },
  en: {
    placeholder: "Your email address",
    button: "Subscribe!",
    sending: "Sending...",
    success: "Thanks for subscribing!",
    error: "Something went wrong. Try again.",
  },
};

export default function NewsletterForm({ lang }: NewsletterFormProps) {
  const t = COPY[lang] || COPY.es;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/emailJs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter",
          email,
          message: "Nueva suscripción al newsletter desde el footer.",
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1 rounded-full border border-black/15 bg-white p-1.5 shadow-sm"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          className="w-full min-w-0 flex-1 truncate bg-transparent px-4 py-2 text-sm text-black placeholder:text-black/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex-shrink-0 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {status === "sending" ? t.sending : t.button}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-2 text-xs font-semibold text-emerald-600">{t.success}</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs font-semibold text-red-500">{t.error}</p>
      )}
    </div>
  );
}
