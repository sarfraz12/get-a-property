// lib/siteConfig.ts
//
// Valores de marca/SEO por defecto de Get a Property (único negocio
// que sirve este código hoy -- ver lib/siteContext.ts). Son SOLO
// respaldos: cualquier campo cargado en Sanity (landingPage.metaTitle,
// settings.title, etc.) sigue teniendo prioridad -- esto es lo que se
// usa cuando esos campos vienen vacíos, y lo que arma el <title>/
// JSON-LD/Open Graph "de fábrica" de cada página.
//
// Dominio principal (a pedido del cliente, set. 2026):
// https://www.getaproperty.com.pa -- CON "www". En Vercel,
// www.getaproperty.com.pa quedó como el dominio de "Production" y
// getaproperty.com.pa (sin www) redirige hacia él con un 308 (eso lo
// configura Vercel solo, no es código) -- antes este archivo tenía la
// versión SIN www, lo que hacía que el canonical/JSON-LD del sitio
// apuntaran a una URL que en la práctica sólo redirige, mientras el
// visitante real termina en la versión con www. Se alinea acá para
// que canonical/JSON-LD/OG coincidan con la URL real donde vive el
// sitio. getapropertypanama.com (el dominio viejo) es el que
// redirecciona hacia este. Si el negocio vuelve a cambiar de dominio
// principal, este es el único lugar del código que hace falta tocar
// (ver también metadataBase en app/(website)/[lang]/layout.tsx, que
// se arma a partir de este mismo valor en vez de repetirlo).
//
// IMPORTANTE, fuera de este código: la variable de entorno
// NEXT_PUBLIC_SITE_URL en Vercel (la usan app/robots.ts y
// app/sitemap.ts directamente, no leen este archivo) también debe ser
// "https://www.getaproperty.com.pa" para que coincida -- confirmá que
// quedó así en Project Settings -> Environment Variables.
//
// defaultContactEmail (y los otros "admin@..." repetidos como
// respaldo en contact.js/AboutTeamSection.tsx/legalContent.js)
// también se actualizaron al nuevo dominio (admin@getaproperty.com.pa,
// set. 2026) a pedido del cliente. IMPORTANTE: esto es sólo el valor
// de RESPALDO -- el que se ve hoy en el sitio en la mayoría de los
// lugares viene de settings.email en Sanity (tiene prioridad sobre
// este default), así que ese campo también hay que actualizarlo
// manualmente en el Studio para que el sitio muestre el correo nuevo.
// Y, fuera de este código: ese buzón (admin@getaproperty.com.pa) tiene
// que existir y recibir correo de verdad antes de publicar este
// cambio, o los mailto: de contacto/legal van a apuntar a una
// dirección que rebota. Instagram/Facebook NO se hardcodean aquí -- ya
// están en Sanity (settings.social[]) y ese es el origen de verdad;
// usa getSocialUrl()/similar en el sitio en vez de estos campos si
// necesitas esas URLs.

import type { SiteKey } from "./siteContext";

type LocalizedText = { es: string; en: string };

export type SiteProfile = {
  siteKey: SiteKey;
  siteName: string;
  titleTemplate: string; // usa "%s"
  baseUrl: string;
  defaultTitle: LocalizedText;
  defaultDescription: LocalizedText;
  defaultKeywords: LocalizedText;
  defaultOgImagePath: string; // relativo a /public, ej. "/images/x.jpg"
  organizationName: string; // para JSON-LD
  appleMobileWebAppTitle: string;
  instagramUrl?: string;
  twitterHandle?: string; // con "@"
  defaultContactEmail: string;
};

const GET_A_PROPERTY: SiteProfile = {
  siteKey: "get-a-property",
  siteName: "Get a Property",
  titleTemplate: "%s | Get a Property",
  baseUrl: "https://www.getaproperty.com.pa",
  defaultTitle: {
    es: "Get a Property | Bienes Raíces en Panamá",
    en: "Get a Property | Real Estate in Panama",
  },
  defaultDescription: {
    es: "Encuentra casas, apartamentos, terrenos y propiedades en venta y alquiler en Panamá con Get a Property. Explora nuestro catálogo de bienes raíces y da el siguiente paso hacia tu próxima propiedad.",
    en: "Find houses, apartments, land, and properties for sale and rent in Panama with Get a Property. Browse our real estate listings and take the next step toward your next property.",
  },
  defaultKeywords: {
    es: "bienes raíces Panamá, casas en venta, apartamentos en alquiler, propiedades en Panamá, terrenos en venta, Get a Property",
    en: "real estate Panama, houses for sale, apartments for rent, properties in Panama, land for sale, Get a Property",
  },
  defaultOgImagePath: "/images/lotes-frente-playa.webp",
  organizationName: "Get a Property Panama",
  appleMobileWebAppTitle: "Get a Property",
  // Redes sociales: se leen de Sanity (settings.social[]), no de aquí
  // -- se dejan sin definir para no duplicar/desincronizar ese dato.
  instagramUrl: undefined,
  twitterHandle: undefined,
  // Debe coincidir con settings.email en Sanity (hoy: admin@getaproperty.com.pa).
  defaultContactEmail: "admin@getaproperty.com.pa",
};

const PROFILES: Record<SiteKey, SiteProfile> = {
  "get-a-property": GET_A_PROPERTY,
};

export function getSiteProfile(siteKey: SiteKey): SiteProfile {
  return PROFILES[siteKey] || GET_A_PROPERTY;
}
