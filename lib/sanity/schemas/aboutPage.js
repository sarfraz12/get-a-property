// import { type } from "os";
import { supportedLanguages, baseLanguage } from './locales';

export default {
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  // Grupo "SEO" (mismo patrón que lib/sanity/schemas/landingPage.js):
  // permite editar el <title>/meta description/palabras clave/imagen
  // OG/URL canónica/noindex de la página "Nosotros" desde Sanity, sin
  // tocar código. Si se deja vacío cualquier campo, el código usa el
  // texto de respaldo que ya tenía la página (ver ABOUT_COPY en
  // app/(website)/[lang]/aboutUs/page.js) -- nada se rompe mientras
  // el campo no se cargue en Studio.
  fieldsets: [
    { name: 'hero', title: 'Sección Hero (arriba: título, cifras, foto)', options: { collapsible: true, collapsed: false } },
    { name: 'historia', title: 'Sección "Nuestra historia" (texto largo)', options: { collapsible: true, collapsed: true } },
    { name: 'whatWeDo', title: 'Sección "Qué hacemos"', options: { collapsible: true, collapsed: true } },
    { name: 'process', title: 'Sección "Calidad en cada paso"', options: { collapsible: true, collapsed: true } },
    { name: 'team', title: 'Sección "Nuestro equipo" (encabezado)', options: { collapsible: true, collapsed: true } },
    { name: 'cta', title: 'Botón Final (Llamado a la acción)', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    {
      name: "title",
      title: "Título",
      description: 'Título grande de la sección Hero (arriba de todo). Ejemplo (ES): "Nuestra historia, una propiedad a la vez".',
      type: 'object',
      fieldset: 'hero',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "description",
      title: "Descripción",
      description: 'Párrafo que acompaña al título en la sección Hero (a la derecha del título y las cifras).',
      type: 'object',
      fieldset: 'hero',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "heroStats",
      title: "Cifras (hasta 3)",
      description:
        'Hasta 3 cifras que aparecen debajo del título (ej. "100% Transparencia"). IMPORTANTE: usar sólo cifras reales -- si se deja vacío, se muestran las cifras de respaldo ya cargadas en el código.',
      type: 'array',
      fieldset: 'hero',
      validation: Rule => Rule.max(3),
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Cifra',
          fields: [
            {
              name: 'value',
              title: 'Valor',
              description: 'Ejemplo: "100%", "3", "0".',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'label',
              title: 'Etiqueta',
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'string',
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
          ],
          preview: {
            select: { title: 'value', subtitle: `label.${baseLanguage.id}` }
          }
        },
      ],
    },
    {
      name: "heroImage",
      title: "Foto de Banner",
      description: 'Foto grande de ancho completo debajo del título/cifras/descripción. Si se deja vacía, se usa la foto de respaldo ya cargada en el código.',
      type: 'image',
      fieldset: 'hero',
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
      name: "body",
      title: "Texto Largo (\"Nuestra historia\")",
      description: 'Texto enriquecido (negrita, cursiva, títulos, listas, imágenes) que aparece debajo del Hero. Si se deja vacío, esta sección no se muestra.',
      type: 'object',
      fieldset: 'historia',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'blockContent',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "whatWeDoHeading",
      title: "Título de la Sección",
      description: 'Ejemplo (ES): "Qué hacemos". Si se deja vacío, se usa el texto de respaldo ya cargado en el código.',
      type: 'object',
      fieldset: 'whatWeDo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "whatWeDoItems",
      title: "Tarjetas (\"Qué hacemos\")",
      description:
        'Agrega una tarjeta por cada cosa que hace la empresa (ícono + título + descripción). Si se deja vacío, se usan las 3 tarjetas de respaldo ya cargadas en el código.',
      type: 'array',
      fieldset: 'whatWeDo',
      validation: Rule => Rule.max(6),
      of: [
        {
          type: 'object',
          name: 'whatWeDoItem',
          title: 'Tarjeta',
          fields: [
            {
              name: 'icon',
              title: 'Ícono',
              description: 'Sólo para elegir -- no se traduce.',
              type: 'string',
              options: {
                list: [
                  { title: '🔍 Búsqueda / Search', value: 'search' },
                  { title: '🏠 Casa / Home', value: 'home' },
                  { title: '✅ Verificado / Shield check', value: 'shield-check' },
                  { title: '🌿 Simple / Leaf', value: 'leaf' },
                  { title: '🤝 Acompañamiento / Support', value: 'handshake' },
                  { title: '📈 Crecimiento / Chart', value: 'chart' },
                  { title: '⭐ Calidad / Star', value: 'star' },
                  { title: '⏱️ Rapidez / Clock', value: 'clock' },
                ]
              }
            },
            {
              name: 'title',
              title: 'Título',
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
              name: 'description',
              title: 'Descripción',
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'text',
                rows: 3,
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
          ],
          preview: {
            select: { title: `title.${baseLanguage.id}`, subtitle: 'icon' }
          }
        },
      ],
    },
    {
      name: "processImage",
      title: "Foto",
      description: 'Foto a la izquierda de la sección "Calidad en cada paso". Si se deja vacía, se usa la foto de respaldo ya cargada en el código.',
      type: 'image',
      fieldset: 'process',
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
      name: "processHeading",
      title: "Título",
      description: 'Ejemplo (ES): "Calidad en cada paso". Si se deja vacío, se usa el texto de respaldo ya cargado en el código.',
      type: 'object',
      fieldset: 'process',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "processDescription",
      title: "Descripción",
      type: 'object',
      fieldset: 'process',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        rows: 3,
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "processItems",
      title: "Checklist (hasta 10)",
      description:
        'Lista de puntos cortos con un check al lado (ej. "Catálogo verificado"). Si se deja vacío, se usa la lista de respaldo ya cargada en el código.',
      type: 'array',
      fieldset: 'process',
      validation: Rule => Rule.max(10),
      of: [
        {
          type: 'object',
          name: 'checklistItem',
          title: 'Punto',
          fields: [
            {
              name: 'text',
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'string',
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
          ],
          preview: {
            select: { title: `text.${baseLanguage.id}` }
          }
        },
      ],
    },
    {
      name: "teamHeading",
      title: "Título",
      description: 'Encabezado de la sección "Nuestro equipo" (los datos de cada persona -- nombre, cargo, email, teléfono -- se cargan como Autores, no acá). Si se deja vacío, se usa el texto de respaldo ya cargado en el código.',
      type: 'object',
      fieldset: 'team',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "teamDescription",
      title: "Descripción",
      type: 'object',
      fieldset: 'team',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "ctaText",
      title: "Texto del Botón Final",
      description: 'Ejemplo (ES): "Ponerse en contacto". El botón siempre lleva a la página de Contacto. Si se deja vacío, se usa el texto de respaldo ya cargado en el código.',
      type: 'object',
      fieldset: 'cta',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Palabras clave para <meta name="keywords"> de la página
      // "Nosotros". Aviso: Google confirmó que NO usa esta etiqueta
      // para el posicionamiento (no afecta el ranking) -- se deja
      // sólo como referencia interna / por si otros buscadores la
      // leen. Fuente: https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
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
      // Título específico para buscadores (<title> / og:title /
      // twitter:title) de "Nosotros". A diferencia de las palabras
      // clave, este campo SÍ lo usa Google. Si se deja vacío, se usa
      // el título de respaldo de la página.
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
      // Meta descripción para buscadores de "Nosotros". Google la
      // suele mostrar como resumen debajo del título en los
      // resultados de búsqueda. Si se deja vacío, se usa la
      // descripción de respaldo de la página.
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
      // Imagen para compartir en redes (Open Graph/Twitter) de
      // "Nosotros". Recomendado 1200x630px. Si se deja vacía, se usa
      // la imagen general del sitio.
      name: "ogImage",
      title: "Imagen para Redes Sociales (Open Graph)",
      description:
        'Imagen al compartir el link de "Nosotros" en redes sociales. Tamaño recomendado: 1200x630px. Si se deja vacía, se usa la imagen general del sitio.',
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
      // URL canónica avanzada -- casi nunca hace falta (ver mismo
      // campo en landingPage.js).
      name: "canonicalUrl",
      title: "URL Canónica (avanzado, casi nunca hace falta)",
      description:
        'Dejar vacío en el 99% de los casos -- ya se genera automáticamente.',
      type: 'url',
      fieldset: 'seo',
    },
    {
      // Interruptor para pedirle a Google que NO indexe "Nosotros".
      name: "noIndex",
      title: "Ocultar de Google (noindex)",
      description:
        'Actívalo sólo si quieres que Google DEJE de mostrar esta página en sus resultados de búsqueda. Dejar apagado en el uso normal del sitio.',
      type: 'boolean',
      fieldset: 'seo',
      initialValue: false,
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
    },

  ],
  preview: {
    select: {
      title: 'title.en',
    },
  },
}
