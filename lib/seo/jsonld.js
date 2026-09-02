// lib/seo/jsonld.js
//
// Constructor único de datos estructurados (JSON-LD / schema.org) para
// todo el sitio. Objetivo del negocio: que Google pueda identificar el
// sitio como un negocio/organización real (RealEstateAgent) -- ver
// https://schema.org/RealEstateAgent.
//
// REGLA DE ORO de este archivo (igual que el resto del sitio): nunca
// inventar datos. Cada campo se arma SOLO si el dato real existe en
// Sanity (settings) -- si falta, se omite el campo en vez de rellenar
// con un valor falso. Esto es a propósito: datos estructurados
// incorrectos son peores que datos estructurados incompletos (Google
// puede penalizar/ignorar markup con información falsa).
//
// Por qué un solo archivo para esto: antes cada página armaba su
// propio bloque JSON-LD con su propia copia (a veces inconsistente)
// de nombre/dirección/teléfono/redes del negocio. Ahora hay una única
// entidad "Organization/RealEstateAgent" con un @id fijo
// (buildOrganizationId) y cada página que necesita referenciar al
// negocio usa {"@id": ese id} en vez de repetir el objeto completo --
// así Google entiende que todas las páginas hablan del mismo negocio,
// y un cambio de teléfono/dirección en Sanity se refleja en todo el
// sitio a la vez.
//
// IMPORTANTE (bug corregido en esta misma sesión): Next.js's Metadata
// API `other` field (usado antes en todo el sitio como
// `other["script:ld+json"]`) SOLO genera etiquetas <meta name=...
// content=...> -- nunca un <script type="application/ld+json"> real.
// Eso significaba que TODO el JSON-LD del sitio era invisible para
// Google (confirmado inspeccionando el DOM en vivo: 0 elementos
// <script type="application/ld+json">). El componente
// components/seo/JsonLd.jsx es el reemplazo correcto: se renderiza
// directamente en el JSX de cada página (no en generateMetadata), y
// sí produce un <script> real.

/**
 * Intenta extraer latitud/longitud del iframe de Google Maps guardado
 * en settings.googleIframe (Settings -> "Google googleIframe link").
 * El embed de Google codifica las coordenadas en la URL como
 * "!2d<longitud>!3d<latitud>" -- si el formato cambia o el campo está
 * vacío/no matchea, se devuelve null (nunca coordenadas inventadas).
 */
export function parseGeoFromGoogleIframe(iframeUrlOrHtml) {
  if (!iframeUrlOrHtml || typeof iframeUrlOrHtml !== "string") return null;
  const lngMatch = iframeUrlOrHtml.match(/!2d(-?\d+\.?\d*)/);
  const latMatch = iframeUrlOrHtml.match(/!3d(-?\d+\.?\d*)/);
  if (!lngMatch || !latMatch) return null;
  const longitude = parseFloat(lngMatch[1]);
  const latitude = parseFloat(latMatch[1]);
  if (Number.isNaN(longitude) || Number.isNaN(latitude)) return null;
  return { latitude, longitude };
}

/** @id estable de la entidad Organization/RealEstateAgent del sitio. */
export function buildOrganizationId(baseUrl) {
  return `${baseUrl}/#organization`;
}

/** @id estable de la entidad WebSite del sitio. */
export function buildWebsiteId(baseUrl) {
  return `${baseUrl}/#website`;
}

/**
 * Arma el bloque schema.org RealEstateAgent (subtipo de LocalBusiness/
 * Organization -- el que Google recomienda para agencias inmobiliarias)
 * con TODOS los datos reales disponibles en Sanity settings. Se usa
 * una sola vez, sitewide, en el layout raíz -- el resto de páginas que
 * necesiten "hablar" de la empresa referencian este mismo @id en vez
 * de repetir el objeto.
 */
export function buildOrganizationJsonLd({ settings, profile, baseUrl, image }) {
  const name = settings?.title || profile.organizationName;
  const description = settings?.description || undefined;
  const email = settings?.email || undefined;
  const telephone = settings?.phone || undefined;
  const priceRange = settings?.priceRange || undefined;

  const sameAs = (settings?.social || [])
    .map(item => item?.url)
    .filter(Boolean);

  const address = settings?.address
    ? {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Panamá",
        addressCountry: "PA",
      }
    : undefined;

  const geoCoords = parseGeoFromGoogleIframe(settings?.googleIframe);
  const geo = geoCoords
    ? {
        "@type": "GeoCoordinates",
        latitude: geoCoords.latitude,
        longitude: geoCoords.longitude,
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": buildOrganizationId(baseUrl),
    name,
    url: baseUrl,
    ...(image ? { image, logo: image } : {}),
    ...(description ? { description } : {}),
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(address ? { address } : {}),
    ...(geo ? { geo } : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: {
      "@type": "Country",
      name: "Panamá",
    },
  };
}

/**
 * Bloque schema.org WebSite + SearchAction (habilita el "sitelinks
 * search box" de Google) con referencia (publisher) a la Organization
 * de arriba en vez de repetirla.
 */
export function buildWebsiteJsonLd({ baseUrl, siteName, lang }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": buildWebsiteId(baseUrl),
    url: baseUrl,
    name: siteName,
    inLanguage: lang === "en" ? "en" : "es",
    publisher: { "@id": buildOrganizationId(baseUrl) },
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${lang || "es"}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Bloque schema.org BreadcrumbList a partir de una lista [{name, url}]. */
export function buildBreadcrumbJsonLd(items) {
  const filtered = (items || []).filter(item => item && item.name && item.url);
  if (!filtered.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: filtered.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
