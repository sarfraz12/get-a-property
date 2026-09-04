// lib/sanity/schemas/legalPage.js
//
// NUEVO: tipo de documento genérico para políticas / términos y
// condiciones (Política de Privacidad, Términos y Condiciones,
// Política de Cookies, Política de Reembolso, Eliminación de Datos de
// Facebook, etc.) -- pedido explícito del cliente: "que uno pueda
// crear las diferentes políticas que solicitan hoy día Google,
// Facebook y demás" SIN que un desarrollador tenga que tocar código
// cada vez. Sigue exactamente el mismo patrón ya establecido en este
// proyecto para "post"/"category": título + slug bilingües, contenido
// bilingüe con formato enriquecido (blockContent -- el mismo campo que
// ya usan los posts: negrita, cursiva, títulos, listas con viñetas o
// numeradas, links, citas), y un grupo SEO opcional que se auto-arma
// si se deja vacío (ver app/(website)/[lang]/legal/[slug]/page.js).
//
// IMPORTANTE: esto es ADITIVO. Las 3 páginas legales que ya existían
// (Términos, Privacidad, Cookies -- app/(website)/[lang]/{terms,
// privacy,cookies}/page.js, con su texto en lib/legalContent.js) NO
// se tocan ni se reemplazan -- siguen viviendo en sus mismas URLs de
// siempre (ya indexadas en Google, ya linkeadas). Este tipo de
// documento nuevo es para agregar políticas ADICIONALES desde Sanity
// sin depender de un deploy de código; cada una aparece automática en
// el pie de página junto a esas 3 (ver components/navigation/footer.js
// -> EXTRA_LEGAL_LINKS / prop "extraLegalLinks").
import { supportedLanguages, baseLanguage } from './locales';
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export default {
  name: "legalPage",
  title: "Política / Términos (página legal)",
  type: "document",
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO (opcional -- se arma automático si se deja vacío)',
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    {
      name: "title",
      title: "Título",
      description: 'Ejemplo (ES): "Política de Reembolso". Example (EN): "Refund Policy".',
      type: 'object',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        validation: Rule => Rule.required(),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "slug",
      title: "Slug (define la URL)",
      description: 'Genera la URL de la página: /es/legal/{slug} y /en/legal/{slug} -- el mismo slug se usa para los dos idiomas.',
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: "description",
      title: "Descripción corta",
      description:
        'Resumen de 1-2 líneas. Se muestra debajo del título en la página, y se usa como descripción para Google/redes sociales si no se completa "Meta Descripción SEO" más abajo.',
      type: 'object',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        rows: 2,
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Mismo campo de contenido enriquecido que ya usan los posts
      // (lib/sanity/schemas/blockContent.js): títulos H2/H3/H4, negrita,
      // cursiva, subrayado, tachado, citas, listas con viñetas o
      // numeradas, links internos/externos, imágenes y tablas.
      name: "body",
      title: "Contenido",
      description: "El texto completo de la política. Admite títulos, negrita/cursiva, listas con viñetas o numeradas, links, imágenes y tablas.",
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
      name: "effectiveDate",
      title: '"Vigente desde" / última actualización (opcional)',
      description:
        'Fecha que se muestra como "Última actualización" en la página. Si se deja vacía, se usa la fecha del último guardado en Sanity automáticamente.',
      type: 'date',
    },
    {
      name: "showInFooter",
      title: "¿Mostrar link en el pie de página?",
      description: "Si está activo, esta política aparece junto a Términos/Privacidad/Cookies en el pie de página de todo el sitio.",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "order",
      title: "Orden en el pie de página (opcional)",
      description: "Número más chico aparece primero. Si se deja vacío, se ordenan alfabéticamente.",
      type: "number",
    },
    {
      name: "seoKeywords",
      title: "Palabras Clave SEO (Google) -- opcional",
      description:
        'Aviso: Google confirmó que NO usa esta etiqueta para el posicionamiento -- se deja disponible solo como referencia interna. Si se deja vacío, se usan las palabras clave generales del sitio.',
      type: 'object',
      fieldset: 'seo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        validation: Rule => Rule.max(255).warning('Se recomienda no pasar de 255 caracteres.'),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "metaTitle",
      title: "Meta Título SEO (<title>) -- opcional",
      description: 'Si se deja vacío, se usa el título de arriba. Sólo completar si querés que en Google se vea un título distinto.',
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
      description: 'Si se deja vacío, se usa la "Descripción corta" de arriba.',
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
      name: "ogImage",
      title: "Imagen para Redes Sociales (Open Graph) -- opcional",
      description:
        'Imagen que se muestra al compartir el link de esta página en redes sociales (WhatsApp, Facebook, etc). Tamaño recomendado: 1200x630px. Si se deja vacía, se usa la imagen general del sitio.',
      type: 'image',
      fieldset: 'seo',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Texto alternativo' },
      ],
    },
    {
      name: "canonicalUrl",
      title: "URL Canónica (avanzado, casi nunca hace falta) -- opcional",
      description: 'Dejar vacío en el 99% de los casos -- ya se genera automáticamente.',
      type: 'url',
      fieldset: 'seo',
    },
    {
      name: "noIndex",
      title: "Ocultar de Google (noindex)",
      description: 'Actívalo sólo si querés que Google DEJE de mostrar esta página en sus resultados de búsqueda, sin despublicarla del sitio.',
      type: 'boolean',
      fieldset: 'seo',
      initialValue: false,
    }
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'slug.current',
    },
  },
};
