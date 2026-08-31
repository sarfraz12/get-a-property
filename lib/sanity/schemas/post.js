import { supportedLanguages, baseLanguage } from './locales';
import { BlockContentIcon } from "@sanity/icons/BlockContent";

export default {
  name: "post",
  title: "Post",
  type: "document",
  initialValue: () => ({
    publishedAt: new Date().toISOString()
  }),
  icon: BlockContentIcon,
  // NUEVO: agrupa precio / ubicación / características en una sola
  // sección plegable del formulario (en vez de quedar sueltos entre
  // los demás campos), para que el editor los vea juntos como "la
  // ficha de la propiedad".
  fieldsets: [
    {
      name: 'propertyDetails',
      title: 'Detalles de Propiedad (precio, ubicación, características)',
      options: { collapsible: true }
    },
    {
      // NUEVO: documentos descargables (folletos, fichas técnicas,
      // planos, etc.) para que el usuario los descargue desde la
      // página del post -- ver campo "attachments" más abajo y su
      // render en postHome.js (debajo del cuerpo del artículo).
      name: 'documents',
      title: 'Documentos Descargables',
      options: { collapsible: true, collapsed: true }
    },
    {
      // SEO opcional para este post -- las páginas de posts son
      // "auto-generadas" (su SEO ya se arma solo, a partir del
      // título/extracto/imagen real del post en
      // app/(website)/[lang]/[category]/post/[slug]/page.js), así que
      // estos 3 campos son sólo para los casos puntuales donde el
      // vendedor quiere un <title>/descripción distinto al que se ve
      // en la página, o sacar un post de Google sin despublicarlo. Si
      // se dejan vacíos, se sigue usando el título/extracto real del
      // post como hasta ahora -- nada cambia.
      name: 'seo',
      title: 'SEO (opcional -- se arma automático si se deja vacío)',
      options: { collapsible: true, collapsed: true }
    }
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
      name: "productMain",
      title: "Producto Principal?",
      type: "boolean",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96
      }
    },
    {
      name: "excerpt",
      title: "Excerpt",
      description:
        "The excerpt is used in blog feeds, and also for search results",
      type: 'object',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        rows: 3,
        validation: Rule => Rule.max(1000),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "author",
      title: "Vendedor",
      type: "reference",
      to: { type: "author" }
    },
    {
      // NUEVO: precio de la propiedad, tal como se debe mostrar (con
      // moneda y período si aplica). Es texto libre bilingüe (no un
      // número) porque el formato cambia entre idiomas (ej. "$230
      // USD/mes" vs "$230 USD/month") y porque no todos los posts son
      // propiedades con precio -- si se deja vacío, no se muestra
      // ningún precio en ningún lado (tarjetas ni la página del post).
      name: "price",
      title: "Precio",
      description:
        "Precio a mostrar, con moneda/período incluidos (ej. \"$230 USD/mes\"). Opcional -- si se deja vacío, no aparece la insignia de precio en las tarjetas ni en la página del post.",
      type: "object",
      fieldset: "propertyDetails",
      fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: "string",
        fieldset: lang.id === baseLanguage.id ? null : "translations"
      }))
    },
    {
      // NUEVO: ubicación/dirección de la propiedad. Bilingüe por si se
      // quiere describir la zona en cada idioma (ej. "Cerca de la
      // playa" / "Near the beach"); una dirección literal puede
      // dejarse igual en los dos idiomas. Opcional.
      name: "location",
      title: "Ubicación",
      description:
        "Dirección o zona de la propiedad (ej. \"Walkers Ridge Cir, Powhatan\"). Opcional -- si se deja vacío, no aparece en las tarjetas ni en la página del post.",
      type: "object",
      fieldset: "propertyDetails",
      fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: "text",
        rows: 2,
        fieldset: lang.id === baseLanguage.id ? null : "translations"
      }))
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      fields: [
        // {
        //   name: "caption",
        //   type: "string",
        //   title: "Image caption",
        //   description: "Appears below image.",

        // },
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity."
        }
      ],
      options: {
        hotspot: true
      }
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }]
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    },
    {
      name: "featured",
      title: "Mark as Featured",
      type: "boolean"
    },
    {
      name: "body",
      title: "Body",
      type: 'object',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'blockContent',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // NUEVO: fotos secundarias para la página del post (la galería
      // de miniaturas debajo de la foto principal en el nuevo diseño).
      // Es opcional: si un post no tiene fotos acá, esa fila
      // simplemente no se muestra en la página, no rompe nada.
      name: "gallery",
      title: "Galería (fotos secundarias)",
      description:
        "Fotos adicionales que se muestran como miniaturas debajo de la foto principal en la página del post. Opcional.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Texto alternativo"
            }
          ]
        }
      ],
      validation: Rule => Rule.max(8)
    },
    {
      // "Puntos clave" del artículo -> se muestran en el recuadro
      // negro junto al título (equivalente a la lista de "Beds /
      // Bathrooms / Sq.ft" de la referencia). Cada ítem ahora también
      // elige un ÍCONO real (de una lista fija pensada para bienes
      // raíces) en vez de que el ícono se asigne solo por posición --
      // así "Baños" siempre muestra el ícono de baño, no el que le
      // toque por orden. El ícono es sólo un selector (no se
      // traduce); el texto sigue siendo bilingüe. Sigue siendo
      // opcional: si está vacío, ese recuadro no se muestra, y un
      // ítem sin ícono elegido cae en un ícono decorativo genérico
      // (compatibilidad con contenido viejo cargado antes de este
      // campo).
      name: "highlights",
      title: "Puntos Clave / Key Items (con ícono, 10 a elegir)",
      description:
        "Lista de puntos clave manuales: cada uno con su texto en español, en inglés, y un ícono elegido de una lista fija de 10. " +
        "Estos MISMOS puntos clave son los que se muestran en 3 lugares del sitio para que siempre coincidan entre sí: " +
        "el recuadro negro \"Puntos clave\" (todos, hasta 8) y el recuadro gris de arriba (los primeros 3) en la página del post, " +
        "y la fila de íconos de la tarjeta (PostCard) en todos los listados (los primeros 3). Opcional, máximo 8.",
      type: "array",
      fieldset: "propertyDetails",
      validation: Rule => Rule.max(8),
      of: [
        {
          type: "object",
          name: "highlight",
          fields: [
            {
              name: "icon",
              title: "Ícono",
              description: "Sólo para elegir -- no se traduce.",
              type: "string",
              options: {
                list: [
                  { title: "🛏️ Habitaciones / Bedrooms", value: "bed" },
                  { title: "🛁 Baños / Bathrooms", value: "bath" },
                  { title: "📐 Área / Square footage", value: "area" },
                  { title: "🚗 Garaje / Garage", value: "garage" },
                  { title: "🏢 Pisos / Floors", value: "floors" },
                  { title: "📅 Año de construcción / Year built", value: "yearBuilt" },
                  { title: "🗺️ Tamaño del terreno / Lot size", value: "lotSize" },
                  { title: "🏊 Piscina / Pool", value: "pool" },
                  { title: "🛋️ Amueblado / Furnished", value: "furnished" },
                  { title: "🐾 Mascotas permitidas / Pets allowed", value: "pets" }
                ]
              }
            },
            ...supportedLanguages.map(lang => ({
              title: lang.title,
              name: lang.id,
              type: "string"
            }))
          ],
          preview: {
            select: { title: baseLanguage.id, subtitle: "icon" }
          }
        }
      ]
    },
    {
      // NUEVO: documentos descargables para la página del post (ej.
      // folleto en PDF, ficha técnica, planos). Cada ítem es un
      // nombre visible + un archivo -- si se deja vacío, no aparece
      // ninguna sección de descargas en la página (ver postHome.js).
      name: "attachments",
      title: "Documentos (folletos, fichas técnicas, planos, etc.)",
      description:
        "Agrega uno o más archivos descargables (PDF, Word, etc.) para que los visitantes de la página del post puedan descargarlos. Opcional.",
      type: "array",
      fieldset: "documents",
      validation: Rule => Rule.max(10),
      of: [
        {
          type: "object",
          name: "attachment",
          title: "Documento",
          fields: [
            {
              name: "title",
              title: "Nombre visible",
              description: 'Ejemplo: "Folleto de la propiedad" / "Brochure".',
              type: "object",
              fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: "string",
                fieldset: lang.id === baseLanguage.id ? null : "translations"
              })),
              validation: Rule => Rule.required(),
            },
            {
              name: "file",
              title: "Archivo",
              type: "file",
              options: {
                accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip",
              },
              validation: Rule => Rule.required(),
            },
          ],
          preview: {
            select: { title: "title." + baseLanguage.id, subtitle: "file.asset.originalFilename" },
          },
        },
      ],
    },
    {
      name: "metaTitle",
      title: "Meta Título SEO (<title>) -- opcional",
      description:
        'Si se deja vacío, se usa el título real del post. Sólo completar si querés que en Google se vea un título distinto.',
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
        'Si se deja vacío, se usa el extracto ("excerpt") real del post. Sólo completar si querés que en Google se vea un resumen distinto.',
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
        'Actívalo sólo si querés que Google DEJE de mostrar este post en sus resultados de búsqueda, sin despublicarlo del sitio.',
      type: 'boolean',
      fieldset: 'seo',
      initialValue: false,
    }
  ],

  preview: {
    select: {
      title: "title.en",
      author: "author.name",
      media: "mainImage"
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }
};
