// lib/sanity/favicon.js
//
// Arma el campo "icons" de metadata (favicon real subido en Sanity
// Settings -> fieldset "Favicon": faviconLight/faviconDark) para usar
// en el generateMetadata() de CUALQUIER página del sitio.
//
// Por qué existe: Next.js NO combina el campo "icons" entre el layout
// y una página -- si una página define su propio "icons" en
// generateMetadata(), reemplaza por completo el del layout padre (no
// se "mezclan" como sí pasa con otros campos). El layout raíz
// (app/(website)/[lang]/layout.tsx) ya arma el favicon real desde
// Sanity, pero cada página de contenido (Nosotros, Contacto,
// Búsqueda, categoría, post, Términos, Privacidad, Cookies) tenía su
// propio "icons: { icon: '/favicon.ico' }" fijo, pisando el favicon
// real con el genérico de /public en esas pestañas -- por eso la
// pestaña de "Nosotros" no mostraba el mismo ícono que la de Inicio.
//
// Uso: cada generateMetadata() debe llamar a getSettings() (Sanity) y
// pasar el resultado acá para armar "icons" con el mismo criterio
// claro/oscuro que ya usa el layout.
import { urlForImage } from "@/lib/sanity/image";

export function getFaviconIcons(settings) {
  const faviconLightSrc = settings?.faviconLight ? urlForImage(settings.faviconLight)?.src : null;
  const faviconDarkSrc = settings?.faviconDark ? urlForImage(settings.faviconDark)?.src : null;

  const iconEntries =
    faviconLightSrc || faviconDarkSrc
      ? [
          { url: faviconLightSrc || faviconDarkSrc || "/favicon.ico", media: "(prefers-color-scheme: light)" },
          { url: faviconDarkSrc || faviconLightSrc || "/favicon.ico", media: "(prefers-color-scheme: dark)" },
        ]
      : "/favicon.ico";

  return {
    icon: iconEntries,
    apple: "/apple-touch-icon.png",
    shortcut: faviconLightSrc || faviconDarkSrc || "/favicon.ico",
  };
}
