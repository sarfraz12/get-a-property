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

// token to edit and wrtie
export const tokenId = process.env.NEXT_PUBLIC_SANITY_TOKEN as string;