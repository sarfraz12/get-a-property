// lib/siteConfig.ts
//
// Valores de marca/SEO por defecto de Get a Property (único negocio
// que sirve este código hoy -- ver lib/siteContext.ts). Son SOLO
// respaldos: cualquier campo cargado en Sanity (landingPage.metaTitle,
// settings.title, etc.) sigue teniendo prioridad -- esto es lo que se
// usa cuando esos campos vienen vacíos, y lo que arma el <title>/
// JSON-LD/Open Graph "de fábrica" de cada página.
//
// IMPORTANTE -- "Get a Property" todavía tiene datos de marca que NO
// conozco y que NO debo inventar (dominio real, cuentas de redes
// sociales, email de contacto real): quedan marcados "// TODO" abajo
// con un valor de relleno obviamente temporal. Antes de publicar el
// sitio hay que reemplazarlos por los reales.

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
  // TODO: reemplazar por el dominio real de Get a Property antes de
  // publicar (afecta canonical/OG/JSON-LD -- hoy es un valor de
  // relleno, ver nota arriba).
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
  // TODO: no tengo las cuentas reales de Instagram/Twitter de Get a
  // Property -- se dejan sin definir a propósito (en vez de inventar
  // un handle) hasta que las compartas; mientras tanto el código que
  // las usa debe omitir esas etiquetas si vienen undefined.
  instagramUrl: undefined,
  twitterHandle: undefined,
  // TODO: reemplazar por el email real de contacto de Get a Property.
  defaultContactEmail: "info@getaproperty.com.pa",
};

const PROFILES: Record<SiteKey, SiteProfile> = {
  "get-a-property": GET_A_PROPERTY,
};

export function getSiteProfile(siteKey: SiteKey): SiteProfile {
  return PROFILES[siteKey] || GET_A_PROPERTY;
}
