// lib/siteContext.ts
//
// Get a Property es HOY el único negocio/sitio que sirve este código
// (el proyecto ya no comparte el dataset con "Gold Ghee" -- ese
// contenido se retiró por completo). SiteKey queda como un tipo de
// un solo valor (en vez de borrar directamente getSiteKey/
// isRealEstate/SiteKey de todo el código, lo que hubiera obligado a
// tocar cada archivo que las importa) para que lib/siteConfig.ts y
// los `generateMetadata` de cada página sigan funcionando sin cambios,
// listos para un futuro tenant sin volver a tocar esta lógica.

export type SiteKey = "get-a-property";

type LandingLike = {
  siteKey?: string | null;
  title?: string | null;
  description?: string | null;
} | null | undefined;

/**
 * Único sitio soportado hoy: siempre "get-a-property". Se mantiene la
 * firma (recibe el documento "landingPage" o "settings") para no tener
 * que tocar cada call site si en el futuro vuelve a hacer falta
 * distinguir más de un sitio.
 */
export function getSiteKey(_landing?: LandingLike): SiteKey {
  return "get-a-property";
}

export function isRealEstate(_landing?: LandingLike): boolean {
  return true;
}
