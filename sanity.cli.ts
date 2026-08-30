import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./lib/sanity/config";

// OJO: la version instalada de @sanity/cli (ver
// node_modules/@sanity/cli/lib/index.d.ts -> CliApiConfig) sólo acepta
// "projectId" y "dataset" acá -- no tiene un campo "organizationId"
// (agregarlo rompe el build de TypeScript). El id de la organización
// (SANITY_STUDIO_ORGANIZATION_ID en .env.local, exportado como
// "organizationId" en ./lib/sanity/config.ts) queda disponible para
// cuando se necesite -- por ejemplo, si se llama a la API de gestión
// de Sanity (manage.sanity.io) desde algún script -- pero no se pasa
// acá porque el tipo de este archivo no lo admite.
export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset
  }
});
