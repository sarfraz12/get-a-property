// components/legal/CookieNotice.tsx
//
// Aviso de cookies simple e informativo (a pedido explícito: "aviso
// simple, informativo", sin bloquear Google Analytics/Tag Manager --
// ver respuesta guardada en esta sesión). NO es un banner de
// consentimiento que pida "Aceptar/Rechazar" antes de cargar nada:
// GA/GTM ya se cargan siempre (ver app/(website)/[lang]/layout.tsx),
// este aviso sólo informa que se usan y enlaza a la Política de
// Cookies real (app/(website)/[lang]/cookies/page.js). Se puede
// cerrar y no vuelve a aparecer en ese navegador (localStorage) --
// nunca bloquea la navegación ni el resto del Sitio.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "gap-cookie-notice-dismissed";

const COPY = {
  es: {
    text: "Usamos cookies de analítica (Google Analytics/Tag Manager) para entender cómo se usa este sitio.",
    linkLabel: "Política de Cookies",
    dismiss: "Entendido",
  },
  en: {
    text: "We use analytics cookies (Google Analytics/Tag Manager) to understand how this site is used.",
    linkLabel: "Cookie Policy",
    dismiss: "Got it",
  },
};

export default function CookieNotice({ lang }: { lang: string }) {
  const [visible, setVisible] = useState(false);
  const t = COPY[lang as "es" | "en"] || COPY.es;

  useEffect(() => {
    // Sólo se lee/escribe localStorage en el cliente, después del
    // primer render, para evitar cualquier desajuste de
    // hidratación entre servidor y navegador.
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // Si localStorage no está disponible (ej. navegación privada
      // muy restrictiva), simplemente no se muestra el aviso en vez
      // de romper la página.
    }
  }, []);

  function handleDismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignorado a propósito -- ver comentario de arriba.
    }
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t.linkLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-brand-dark/95 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-black/70 dark:text-white/70 sm:text-left">
          {t.text}{" "}
          <Link href={`/${lang}/cookies`} className="font-semibold text-brand-gold underline underline-offset-2">
            {t.linkLabel}
          </Link>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-full bg-black px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-black"
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}
