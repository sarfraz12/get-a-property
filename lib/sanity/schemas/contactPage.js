// lib/sanity/schemas/contactPage.js
//
// SEO editable desde Sanity para la página "Contacto"
// (app/(website)/[lang]/contact/page.js). El contenido visible de
// esta página (textos, formulario, etc.) sigue viviendo en su propio
// archivo .js como ya estaba -- este documento SOLO cubre el <title>,
// meta description, palabras clave, imagen Open Graph, URL canónica
// y noindex, para que se puedan cambiar sin tocar código. Si no se
// crea este documento en Studio, o se deja algún campo vacío, el
// código sigue usando el texto de respaldo que ya tenía la página --
// nada se rompe.
//
// A propósito NO es un documento "singleton" forzado por código (
// mismo criterio ya usado en landingPage.js / aboutPage.js): sólo
// debería existir una instancia, así que basta con crear una sola
// vez en Studio y no borrarla.
import { supportedLanguages, baseLanguage } from './locales';

export default {
  name: 'contactPage',
  title: 'Contact Page (SEO)',
  type: 'document',
  fieldsets: [
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    {
      name: "seoKeywords",
      title: "Palabras Clave SEO (Google)",
      description:
        'No afecta el posicionamiento en Google (referencia interna). Separadas por coma. Si se deja vacío, se usa el texto de respaldo de la página.',
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
      title: "Meta Título SEO (<title>)",
      description:
        'Título que aparece en Google y en la pestaña del navegador. Recomendado: 50-60 caracteres. Si se deja vacío, se usa el título de respaldo de la página.',
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
      title: "Meta Descripción SEO",
      description:
        'Resumen que aparece debajo del título en los resultados de Google. Recomendado: 120-160 caracteres. Si se deja vacío, se usa la descripción de respaldo de la página.',
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
      title: "Imagen para Redes Sociales (Open Graph)",
      description:
        'Imagen al compartir el link de esta página en redes sociales. Tamaño recomendado: 1200x630px. Si se deja vacía, se usa la imagen general del sitio.',
      type: 'image',
      fieldset: 'seo',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          description: 'Descripción corta de la imagen (accesibilidad + SEO).',
        },
      ],
    },
    {
      name: "canonicalUrl",
      title: "URL Canónica (avanzado, casi nunca hace falta)",
      description:
        'Dejar vacío en el 99% de los casos -- ya se genera automáticamente.',
      type: 'url',
      fieldset: 'seo',
    },
    {
      name: "noIndex",
      title: "Ocultar de Google (noindex)",
      description:
        'Actívalo sólo si quieres que Google DEJE de mostrar esta página en sus resultados de búsqueda. Dejar apagado en el uso normal del sitio.',
      type: 'boolean',
      fieldset: 'seo',
      initialValue: false,
    },
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page (SEO)' };
    },
  },
}
