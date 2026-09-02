export const useCdn = process.env.NODE_ENV === "production";
// export const useCdn = false;

/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

// both .env required to work
// NEXT_PUBLIC_ for 3000
// SANITY_STUDIO_ for 3333 & *.sanity.studio
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  (process.env.SANITY_STUDIO_PROJECT_ID as string);

// Id de la organización de Sanity dueña de este proyecto (manage.sanity.io).
// Sólo lo usa sanity.cli.ts (para que el CLI/Studio sepan a qué
// organización pertenece el proyecto) -- el frontend de Next.js no lo
// necesita para consultar datos, así que no hace falta un NEXT_PUBLIC_.
export const organizationId = process.env.SANITY_STUDIO_ORGANIZATION_ID as string;

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || ("production" as string);

// see https://www.sanity.io/docs/api-versioning for how versioning works
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-03-25";

// This is the document id used for the preview secret that's stored in your dataset.
// The secret protects against unauthorized access to your draft content and have a lifetime of 60 minutes, to protect against bruteforcing.
export const previewSecretId = process.env
  .SANITY_REVALIDATE_SECRET as string;

// VULNERABILIDAD REAL corregida antes del lanzamiento: este token tiene
// permiso de ESCRITURA en Sanity (createPreRegisterUser() en client.ts
// lo usa para crear documentos), pero estaba leyendo la variable
// NEXT_PUBLIC_SANITY_TOKEN -- cualquier variable con prefijo
// NEXT_PUBLIC_ Next.js la incrusta tal cual (como texto plano) en el
// bundle de JavaScript que se manda al navegador de CADA visitante.
// Un token de escritura publico = cualquiera podria extraerlo del
// bundle y crear/editar/borrar contenido en el Sanity de produccion.
// Ahora lee SANITY_API_TOKEN (SIN NEXT_PUBLIC_) para que Next.js lo
// mantenga solo en el servidor. IMPORTANTE: en Vercel, esta variable
// debe cargarse como SANITY_API_TOKEN (no NEXT_PUBLIC_SANITY_TOKEN)
// -- y como el valor actual ya vivio en un env var publico, lo mas
// seguro es generar un token nuevo en manage.sanity.io y revocar el
// viejo antes de usarlo en produccion.
export const tokenId = process.env.SANITY_API_TOKEN as string;