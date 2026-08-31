import { supportedLanguages, baseLanguage } from './locales';
import { BlockContentIcon } from "@sanity/icons/BlockContent";

export default {
  name: "category",
  title: "Category",
  type: "document",
  icon:BlockContentIcon,
  // Grupo "SEO" opcional -- las páginas de categoría son
  // "auto-generadas" (su SEO ya se arma solo, a partir del nombre
  // real de la categoría y sus posts, en
  // app/(website)/[lang]/[category]/page.js), así que estos campos
  // son sólo para casos puntuales donde se quiera un <title>/
  // descripción distinto, o sacar una categoría de Google sin
  // ocultarla del sitio. Si se dejan vacíos, se sigue armando todo
  // automático como hasta ahora.
  fieldsets: [
    { name: 'seo', title: 'SEO (opcional -- se arma automático si se deja vacío)', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    {
      name: "title",
      type: 'object',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      // NUEVO: agrupa las categorías por tipo (ubicación / tipo de
      // propiedad / tipo de oferta) para poder armar los filtros
      // reales del Hero y del listado de posts (Location / Property /
      // Status en la referencia que envió el cliente). Es opcional
      // ("General") para no romper categorías viejas que ya existan
      // sin este campo: siguen funcionando igual que antes (siguen
      // apareciendo en la página de esa categoría), sólo que no entran
      // en ninguno de los 3 grupos de filtro hasta que se les asigne
      // un tipo acá.
      name: "categoryType",
      title: "Tipo de categoría (para los filtros)",
      description:
        "De qué grupo de filtro es esta categoría: Ubicación (ej. Coronado, Ciudad de Panamá), Tipo de Propiedad (ej. Casa, Apartamento, Terreno) u Oferta (ej. Venta, Alquiler). Así el sitio arma los filtros reales del Hero y del listado con las categorías que sí existan.",
      type: "string",
      options: {
        list: [
          { title: "Ubicación", value: "location" },
          { title: "Tipo de Propiedad", value: "propertyType" },
          { title: "Tipo de Oferta (venta/alquiler)", value: "offerType" },
          { title: "General (no entra en los filtros)", value: "general" },
        ],
        layout: "radio",
      },
      initialValue: "general",
    },
    {
      name: "color",
      title: "Color",
      type: "string",
      description: "Color of the category. Debe coincidir con COLORS en components/ui/label.js -- ahí está el mapa color -> estilos reales.",
      options: {
        list: [
          { title: "Green", value: "green" },
          { title: "Blue", value: "blue" },
          { title: "Purple", value: "purple" },
          { title: "Orange", value: "orange" },
          { title: "Pink", value: "pink" },
          { title: "Red", value: "red" },
          { title: "Yellow", value: "yellow" },
          { title: "Teal", value: "teal" },
          { title: "Indigo", value: "indigo" },
          { title: "Gray", value: "gray" }
        ]
      }
    },
    {
      name: "description",
      title: "Description",
      type: "text"
    },
    {
      // NUEVO: imagen propia de la categoría, para la tarjeta de
      // categorías del landing page (antes esa tarjeta usaba la foto
      // del post más reciente de esa categoría, que no siempre era
      // representativa). Opcional: si no se carga, la tarjeta de esa
      // categoría cae en una imagen genérica del sitio.
      name: "featuredImage",
      title: "Imagen destacada (para la tarjeta del landing page)",
      description:
        "Foto que representa a esta categoría (ej. una foto de una casa para la categoría \"Casa\"). Se usa como fondo de su tarjeta en la sección de categorías del inicio.",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Texto alternativo",
          description: "Importante para SEO y accesibilidad."
        }
      ]
    },
    {
      // NUEVO: controla si esta categoría aparece como tarjeta en la
      // sección de categorías del landing page. Antes esa sección
      // mostraba automáticamente cualquier categoría que tuviera
      // posts; ahora el editor elige a mano cuáles destacar (para no
      // saturar el inicio con categorías poco relevantes).
      name: "featured",
      title: "¿Destacar en el landing page?",
      description:
        "Si está activo, esta categoría aparece como tarjeta en la sección de categorías del inicio (usando la \"Imagen destacada\" de arriba).",
      type: "boolean",
      initialValue: false
    },
    {
      name: "metaTitle",
      title: "Meta Título SEO (<title>) -- opcional",
      description:
        'Si se deja vacío, se usa el nombre de la categoría. Sólo completar si querés que en Google se vea un título distinto.',
      type: 'object',
      fieldset: 'seo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        validation: Rule => Rule.max(70).warning('Se recomienda no pasar de 60-70 caracteres.'),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "metaDescription",
      title: "Meta Descripción SEO -- opcional",
      description:
        'Si se deja vacío, se usa la descripción general del catálogo de propiedades. Sólo completar si querés un resumen distinto para esta categoría.',
      type: 'object',
      fieldset: 'seo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        rows: 3,
        validation: Rule => Rule.max(200).warning('Se recomienda no pasar de 155-160 caracteres.'),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "noIndex",
      title: "Ocultar de Google (noindex)",
      description:
        'Actívalo sólo si querés que Google DEJE de mostrar esta categoría en sus resultados de búsqueda, sin ocultarla del sitio.',
      type: 'boolean',
      fieldset: 'seo',
      initialValue: false,
    }
  ],
  preview: {
    select: {
      title: 'title.en',
    },
  },
};
