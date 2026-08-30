import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./lib/sanity/schemas";
import {
  projectId,
  dataset,
  previewSecretId
} from "./lib/sanity/config";
import settings from "./lib/sanity/schemas/settings";
import {
  pageStructure,
  singletonPlugin
} from "./lib/sanity/plugins/settings";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { table } from "@sanity/table";
import { codeInput } from "@sanity/code-input";
import { StudioLogo } from "./lib/sanity/components/StudioLogo";

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = ["post"];

export default defineConfig({
  name: "GetAProperty",
  // "title" es sólo el respaldo estático (pestaña del navegador antes
  // de que cargue JS, y demás usos internos de Sanity que no pueden
  // usar un componente). El nombre que se VE en la barra superior del
  // Studio lo reemplaza StudioLogo, que lo sigue en vivo desde
  // Settings -> "Site title" (ver ese archivo).
  title: "Get a Property",
  basePath: "/studio",
  projectId: projectId,
  dataset: dataset,

  studio: {
    components: {
      logo: StudioLogo
    }
  },

  plugins: [
    structureTool({
      structure: pageStructure([settings])
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      // defaultDocumentNode: previewDocumentNode({ apiVersion, previewSecretId }),
    }),
    singletonPlugin(["settings"]),
    visionTool(),
    unsplashImageAsset(),
    table(),
    codeInput()
  ],
  "locales": [
    { "id": "en", "title": "English" },
    { "id": "fr", "title": "French" }
    // Add more languages as needed
  ],
  "defaultLocale": "en",

  schema: {
    types: schemaTypes
  }
});
