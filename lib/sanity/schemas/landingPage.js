import { supportedLanguages, baseLanguage } from './locales';
import { VideoIcon } from '@sanity/icons/Video';


export default {
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  // Grupo de nivel documento (distinto de los "translations" fieldsets
  // que ya tiene cada campo bilingue para plegar ES adentro). "Generales"
  // junta el título y la descripción generales de la home -- el texto
  // que se muestra en el encabezado del Hero (components/generalUse/
  // hero.tsx), separado del arreglo "hero" (que sigue siendo solo el
  // carrusel de imágenes/CTA del hero, ver más abajo).
  fieldsets: [
    { name: 'generales', title: 'Generales', options: { collapsible: true, collapsed: false } },
    { name: 'principal', title: 'Principal (Hero)', options: { collapsible: true, collapsed: false } },
    { name: 'aboutSection', title: 'Seccion "Sobre nuestra empresa"', options: { collapsible: true, collapsed: true } },
    { name: 'teamSection', title: 'Seccion "Nuestro equipo"', options: { collapsible: true, collapsed: true } },
    { name: 'secciones', title: 'Secciones de Contenido (Body)', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    {
      name: "title",
      title: "Título General",
      description:
        'Título principal de la home. Se muestra en el encabezado del Hero (a la izquierda, en grande).',
      type: 'object',
      fieldset: 'generales',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Texto del botón de la sección del Hero (components/generalUse/
      // hero.tsx -> finalButtonText). Antes venía únicamente del primer
      // ítem del arreglo "hero" (hero[0].buttonText); ahora se edita acá,
      // junto con el título y la descripción generales, para que las 3
      // cosas que arma esa fila (título / descripción / botón) se
      // carguen en un solo lugar. Si se deja vacío, se usa el texto de
      // respaldo bilingüe ("Ver publicaciones" / "View posts").
      name: "buttonText",
      title: "Texto del Botón (Hero)",
      description:
        'Texto del botón que aparece junto a la descripción del Hero, con la flechita al lado. Ejemplo (ES): "Ver publicaciones". Example (EN): "View posts". Si se deja vacío, se usa ese mismo texto de respaldo.',
      type: 'object',
      fieldset: 'generales',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Link del botón del Hero (finalButtonLink). Es bilingüe (a
      // diferencia de hero[].buttonLink, que es un solo texto para los
      // dos idiomas) porque un link interno debe llevar el prefijo de
      // idioma correcto (/es/... o /en/...) -- si se deja vacío, el
      // código arma automáticamente "/{idioma}/all" (la página de todas
      // las publicaciones), así que nunca queda un botón que no lleve a
      // ningún lado.
      name: "buttonLink",
      title: "Link del Botón (Hero)",
      description:
        'A dónde lleva el botón del Hero al hacer clic. Puede ser una ruta interna del sitio (empieza con "/", incluyendo el idioma) o un link externo completo. Ejemplos válidos -- interno (ES): "/es/all" (ver todas las publicaciones) o "/es/contact" (ir a contacto); interno (EN): "/en/all" o "/en/contact"; externo: "https://wa.me/50764409399". Si se deja vacío, se usa automáticamente "/{idioma}/all".',
      type: 'object',
      fieldset: 'generales',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        description:
          lang.id === 'es'
            ? 'Ejemplo: /es/all'
            : 'Example: /en/all',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "description",
      title: "Descripción General",
      description:
        'Descripción principal de la home. Se muestra en el encabezado del Hero (a la derecha, junto al botón).',
      type: 'object',
      fieldset: 'generales',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        rows: 2,
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },

    // ================================================================
    // Sección "Sobre nuestra empresa" (components/sections/AboutSection.tsx)
    // ================================================================
    // Antes esta sección se armaba con copy fijo en el propio componente
    // (incluyendo estadísticas de ejemplo -- 99% / 15K / 5+ -- que eran
    // de la plantilla de referencia, NO datos reales de Get a Property).
    // Ahora cada texto que se ve en pantalla tiene su propio campo acá,
    // agrupados en el fieldset "aboutSection". Si TODOS estos campos se
    // dejan vacíos, el componente oculta la sección completa (en vez de
    // mostrar el copy/estadísticas de ejemplo) -- ver AboutSection.tsx.
    {
      name: "aboutTitle",
      title: "Título",
      description: 'Título de la sección. Ejemplo (ES): "Sobre nuestra empresa". Example (EN): "About our company".',
      type: 'object',
      fieldset: 'aboutSection',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "aboutParagraphs",
      title: "Párrafos",
      description: 'Agrega uno o más párrafos de texto para esta sección (aparecen en orden, debajo del título).',
      type: 'array',
      fieldset: 'aboutSection',
      of: [
        {
          type: 'object',
          name: 'paragraph',
          title: 'Párrafo',
          fields: [
            {
              name: 'text',
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
            select: { title: 'text.en' },
          },
        },
      ],
    },
    {
      name: "aboutStats",
      title: "Estadísticas",
      description:
        'Agrega una o más estadísticas (ej. "99% Satisfacción", "15K Clientes felices"). IMPORTANTE: usa sólo cifras reales de Get a Property -- si no tienes una cifra real todavía, mejor no cargar ninguna estadística (la sección se ajusta sola sin ellas).',
      type: 'array',
      fieldset: 'aboutSection',
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Estadística',
          fields: [
            {
              name: 'value',
              title: 'Valor',
              description: 'Ejemplo: "99%", "15K", "5+".',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'label',
              title: 'Etiqueta',
              description: 'Ejemplo (ES): "Satisfacción". Example (EN): "Satisfaction rate".',
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
            select: { title: 'value', subtitle: 'label.en' },
          },
        },
      ],
      validation: Rule => Rule.max(3),
    },
    {
      name: "aboutButtonText",
      title: "Texto del Botón",
      description: 'Ejemplo (ES): "Conócenos". Example (EN): "About us". Si se deja vacío, no se muestra ningún botón.',
      type: 'object',
      fieldset: 'aboutSection',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "aboutButtonLink",
      title: "Link del Botón",
      description:
        'A dónde lleva el botón al hacer clic. Ejemplos -- interno (ES): "/es/aboutUs"; interno (EN): "/en/aboutUs"; externo: "https://wa.me/50764409399". Si se deja vacío, se usa automáticamente "/{idioma}/aboutUs".',
      type: 'object',
      fieldset: 'aboutSection',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      name: "aboutWords",
      title: "Palabras de la Barra Negra",
      description:
        'Palabras que se desplazan en loop dentro de la barra negra debajo de esta sección (ej. "Casas", "Apartamentos", "En Venta"). Si se deja vacío, no se muestra la barra.',
      type: 'array',
      fieldset: 'aboutSection',
      of: [
        {
          type: 'object',
          name: 'word',
          title: 'Palabra',
          fields: [
            {
              name: 'word',
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
            select: { title: 'word.en' },
          },
        },
      ],
    },

    // ================================================================
    // Sección "Nuestro equipo" (components/sections/TeamSection.tsx)
    // ================================================================
    // Antes esta sección mostraba un equipo de EJEMPLO fijo en el
    // componente (8 tarjetas "Nombre Apellido" con círculo de iniciales
    // "NA" -- justo lo que el usuario reportó ver en producción). Ahora
    // cada integrante real se carga acá, uno por ítem del arreglo
    // "teamMembers" -- si no hay ningún integrante cargado, el
    // componente oculta la sección completa en vez de mostrar el
    // equipo de ejemplo (ver TeamSection.tsx).
    {
      name: "teamTitle",
      title: "Título",
      description: 'Ejemplo (ES): "Nuestro equipo". Example (EN): "Our team".',
      type: 'object',
      fieldset: 'teamSection',
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
      fieldset: 'teamSection',
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
      name: "teamMembers",
      title: "Integrantes",
      description: "Agrega un ítem por cada integrante -- cada uno genera su propio círculo en la sección.",
      type: 'array',
      fieldset: 'teamSection',
      of: [
        {
          type: 'object',
          name: 'teamMember',
          title: 'Integrante',
          fields: [
            {
              name: 'name',
              title: 'Nombre completo',
              description: 'El nombre no se traduce (es el mismo en los dos idiomas).',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'role',
              title: 'Cargo',
              description: 'Ejemplo (ES): "Agente Inmobiliario". Example (EN): "Real Estate Agent".',
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
              name: 'email',
              title: 'Correo',
              type: 'string',
            },
            {
              name: 'phone',
              title: 'Teléfono',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Foto',
              description: 'Si se deja vacía, se muestran las iniciales del nombre sobre un círculo de color.',
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role.en', media: 'image' },
          },
        },
      ],
    },

    {
      // Palabras clave para la etiqueta <meta name="keywords"> de la
      // home (app/(website)/[lang]/page.tsx -> generateMetadata).
      //
      // Aviso importante para quien cargue este campo en Studio: Google
      // confirmó oficialmente en su blog para desarrolladores que ESTA
      // ETIQUETA NO SE USA PARA EL POSICIONAMIENTO -- no tiene ningún
      // efecto en el ranking de búsqueda de Google.
      // Fuente: https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
      // (confirmado también en la documentación vigente de Search
      // Central, que la lista como "unsupported tag").
      // Se deja el campo igual porque no hace daño tenerlo (algunos
      // otros motores/herramientas de indexación sí la leen) y sirve
      // como referencia interna de qué palabras clave apunta la home.
      //
      // El límite de 255 caracteres de la validación de abajo es la
      // convención práctica histórica para esta etiqueta -- no es una
      // regla real de Google (Google no tiene política de límite de
      // caracteres para esto porque directamente no la usa).
      name: "seoKeywords",
      title: "Palabras Clave SEO (Google)",
      description:
        'Aviso: Google confirmó que NO usa esta etiqueta para el posicionamiento (no afecta tu ranking en Google) -- se deja disponible solo como referencia interna / por si otros buscadores la leen. Máx. 255 caracteres, separadas por coma. Ejemplo (ES): "bienes raíces Panamá, casas en venta, apartamentos en alquiler, terrenos en venta, Get a Property". Example (EN): "real estate Panama, houses for sale, apartments for rent, land for sale, Get a Property".',
      type: 'object',
      fieldset: 'seo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        description:
          lang.id === 'es'
            ? 'Ejemplo: bienes raíces Panamá, casas en venta, apartamentos en alquiler, terrenos en venta, Get a Property'
            : 'Example: real estate Panama, houses for sale, apartments for rent, land for sale, Get a Property',
        validation: Rule =>
          Rule.max(255).warning(
            'Se recomienda no pasar de 255 caracteres (convención práctica -- Google no usa esta etiqueta para el posicionamiento, así que esto no es una regla oficial de Google).'
          ),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Título específico para buscadores (<title> / og:title / twitter:title)
      // de la home. A diferencia de las palabras clave, ESTE campo sí lo usa
      // Google -- es lo primero que se ve en el resultado de búsqueda y en
      // la pestaña del navegador, y sí influye en cuánta gente hace clic.
      // Si se deja vacío, se usa el título general de site (sharedMetaData,
      // en app/(website)/[lang]/layout.tsx).
      //
      // El límite de 60 caracteres es una guía práctica (Google trunca el
      // resultado que se ve en el buscador a partir de cierto ancho en
      // píxeles, que ronda los 50-60 caracteres según el idioma y los
      // caracteres usados) -- Google no publica un límite exacto de
      // caracteres, así que esto es orientativo, no una regla fija.
      name: "metaTitle",
      title: "Meta Título SEO (<title>)",
      description:
        'Título que aparece en Google y en la pestaña del navegador. Recomendado: 50-60 caracteres. Ejemplo (ES): "Get a Property | Bienes Raíces en Panamá". Example (EN): "Get a Property | Real Estate in Panama". Si se deja vacío, se usa el título general del sitio.',
      type: 'object',
      fieldset: 'seo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        validation: Rule =>
          Rule.max(70).warning('Se recomienda no pasar de 60-70 caracteres para que Google no lo corte en los resultados de búsqueda.'),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Descripción específica para buscadores (meta description / og:description
      // / twitter:description) de la home. Este campo TAMBIÉN lo usa Google
      // de verdad: no es un factor directo de ranking, pero Google la suele
      // mostrar como el resumen debajo del título en los resultados de
      // búsqueda, y una buena descripción mejora cuánta gente hace clic
      // (CTR), lo cual sí termina ayudando indirectamente. Si se deja vacío,
      // se usa la descripción general del sitio (sharedMetaData).
      //
      // El límite de 155-160 caracteres es la guía práctica más citada
      // (Google no fija un máximo oficial, pero recorta el fragmento que
      // muestra alrededor de ese largo) -- no es una regla estricta de
      // Google, es orientativo.
      name: "metaDescription",
      title: "Meta Descripción SEO",
      description:
        'Resumen que aparece debajo del título en los resultados de Google. Recomendado: 120-160 caracteres. Ejemplo (ES): "Encuentra casas, apartamentos y terrenos en venta y alquiler en Panamá con Get a Property." Si se deja vacío, se usa la descripción general del sitio.',
      type: 'object',
      fieldset: 'seo',
      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: 'text',
        rows: 3,
        validation: Rule =>
          Rule.max(200).warning('Se recomienda no pasar de 155-160 caracteres para que Google no lo corte en los resultados de búsqueda.'),
        fieldset: lang.id === baseLanguage.id ? null : 'translations'
      }))
    },
    {
      // Imagen para compartir en redes (Facebook/WhatsApp/LinkedIn vía
      // Open Graph, y Twitter/X vía twitter:image). Tamaño recomendado por
      // la propia documentación de Open Graph / Facebook: 1200x630px. Si
      // se deja vacía, se usa la imagen general del sitio
      // (settings.openGraphImage).
      name: "ogImage",
      title: "Imagen para Redes Sociales (Open Graph)",
      description:
        'Imagen que se muestra al compartir el link de la home en redes sociales (Facebook, WhatsApp, LinkedIn, Twitter/X). Tamaño recomendado: 1200x630px. Si se deja vacía, se usa la imagen general del sitio.',
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
      // URL canónica -- le dice a Google cuál es "la" versión oficial de
      // esta página cuando hay contenido duplicado o accesible por varias
      // rutas. Casi nunca hace falta tocarla (por defecto ya se arma como
      // https://getaproperty.com.pa/{lang} en sharedMetaData); se deja
      // disponible por si algún día se necesita apuntarla a otra URL.
      name: "canonicalUrl",
      title: "URL Canónica (avanzado, casi nunca hace falta)",
      description:
        'Dejar vacío en el 99% de los casos -- ya se genera automáticamente. Sólo completar si Google debe indexar esta página bajo una URL distinta a la normal.',
      type: 'url',
      fieldset: 'seo',
    },
    {
      // Interruptor para pedirle a Google que NO indexe esta página
      // (noindex). Sirve para, por ejemplo, sacar temporalmente la home de
      // los resultados de búsqueda sin tener que borrar contenido.
      name: "noIndex",
      title: "Ocultar de Google (noindex)",
      description:
        'Actívalo sólo si quieres que Google DEJE de mostrar esta página en sus resultados de búsqueda (por ejemplo, mientras se termina de cargar contenido real). Dejar apagado en el uso normal del sitio.',
      type: 'boolean',
      fieldset: 'seo',
      initialValue: false,
    },
    {
      name: "post",
      fieldset: 'principal',
      title: "Post",
      type: "reference",
      to: { type: "post" }
    },
    {
      name: "hero",
      fieldset: 'principal',
      type: "array",
      title: "Hero - Main Image Slider",
      description: "Enter the hero content",
      of: [
        {
          type: "object",
          fields: [
            {
              name: 'title',
              title: 'Título (no se usa en pantalla)',
              description:
                'título descriptivo',
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
              title: 'Descripción (no se usa en pantalla)',
              description:
                'Ya no se muestra en el sitio: el encabezado del Hero ahora usa "Título General" / "Descripción General" (grupo "Generales", arriba en este mismo documento). Se deja este campo por compatibilidad con contenido viejo.',
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
              name: 'buttonText',
              title: 'Texto del Botón (no se usa en pantalla)',
              description:
                'Ya no se muestra: el botón del Hero ahora usa "Texto del Botón (Hero)" / "Link del Botón (Hero)" (grupo "Generales", arriba en este mismo documento). Se deja este campo por compatibilidad con contenido viejo.',
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
              name: 'buttonLink',
              title: 'Link del Botón (no se usa en pantalla)',
              description:
                'Ya no se muestra: el botón del Hero ahora usa "Texto del Botón (Hero)" / "Link del Botón (Hero)" (grupo "Generales", arriba en este mismo documento). Se deja este campo por compatibilidad con contenido viejo.',
              type: 'string',
            },
            {
              name: 'backgroundColor',
              type: 'string',
            },
            {
              // Carrusel de imágenes del hero. Antes el componente de
              // React (components/generalUse/hero.tsx) esperaba un
              // arreglo "slides" que este schema nunca tuvo -- sólo
              // existían "backgroundImage" y "productImage" (una sola
              // imagen cada uno). Eso significaba que el carrusel del
              // hero NUNCA podía mostrar imágenes reales desde Sanity.
              // Se agrega este campo para poder cargar 1 o más fotos.
              // Si se deja vacío, el frontend usa "Background Image" /
              // "Product Image" como respaldo, y si esas tampoco están
              // cargadas, usa fotos genéricas del sitio sólo para que
              // el carrusel nunca se vea vacío.
              name: 'slides',
              title: 'Hero Carousel Slides',
              description:
                'Agrega una o más imágenes O videos para el carrusel del hero (elige el tipo en cada slide; se pueden mezclar, ej. slide 1 imagen, slide 2 video). Si se deja vacío, se usan "Background Image" / "Product Image" como respaldo.',
              type: 'array',
              of: [
                {
                  // NUEVO: cada slide ahora es un objeto (imagen + alt +
                  // categoría opcional) en vez de sólo una imagen suelta,
                  // para poder conectar la foto del carrusel con una
                  // categoría real (al hacer click en la foto, lleva a
                  // esa categoría). Es retrocompatible: no había ninguna
                  // foto cargada todavía en este campo en el documento
                  // de landingPage, así que no hay datos viejos que migrar.
                  type: 'object',
                  name: 'slide',
                  title: 'Slide',
                  fields: [
                    {
                      // NUEVO: cada slide puede ser una imagen fija O un
                      // video que se reproduce en automático (en
                      // silencio, en loop) mientras se muestra -- ej.
                      // slide 1 = imagen, slide 2 = video, mezclados como
                      // se quiera. Este campo decide cuál de los dos de
                      // abajo ("Imagen" o "Video") aplica para este slide;
                      // el otro se oculta en el Studio para no confundir.
                      name: 'mediaType',
                      title: 'Tipo de contenido',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Imagen', value: 'image' },
                          { title: 'Video', value: 'video' },
                        ],
                        layout: 'radio',
                        direction: 'horizontal',
                      },
                      initialValue: 'image',
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: 'image',
                      title: 'Imagen',
                      type: 'image',
                      options: { hotspot: true },
                      hidden: ({ parent }) => parent?.mediaType === 'video',
                      validation: Rule =>
                        Rule.custom((value, context) => {
                          if (context.parent?.mediaType !== 'video' && !value) {
                            return 'La imagen es obligatoria cuando el tipo de contenido es "Imagen".';
                          }
                          return true;
                        }),
                    },
                    {
                      name: 'video',
                      title: 'Video',
                      type: 'file',
                      options: { accept: 'video/*' },
                      description:
                        'Se reproduce automáticamente, en silencio y en loop, mientras se muestra este slide (sin controles ni sonido, igual que el video de fondo de una página).',
                      hidden: ({ parent }) => parent?.mediaType !== 'video',
                      validation: Rule =>
                        Rule.custom((value, context) => {
                          if (context.parent?.mediaType === 'video' && !value) {
                            return 'El video es obligatorio cuando el tipo de contenido es "Video".';
                          }
                          return true;
                        }),
                    },
                    {
                      name: 'videoPoster',
                      title: 'Imagen de portada del video (opcional)',
                      description:
                        'Se muestra mientras el video todavía está cargando. Si se deja vacío, se ve un fondo negro hasta que arranque a reproducirse.',
                      type: 'image',
                      options: { hotspot: true },
                      hidden: ({ parent }) => parent?.mediaType !== 'video',
                    },
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alternative text',
                      description: 'Important for SEO and accessibility.',
                    },
                    {
                      // NUEVO: ahora es un arreglo (selección múltiple),
                      // no una sola categoría -- una misma foto del
                      // carrusel puede representar más de un filtro a
                      // la vez (ej. una foto de una casa en Coronado en
                      // venta -> "Casa" + "Coronado" + "Venta", una de
                      // cada tipo). Al hacer click, el Hero arma la
                      // MISMA combinación de filtros que armaría el
                      // usuario eligiéndolas a mano en la píldora de
                      // arriba (ver lib/categoryFilters.ts), y navega a
                      // /{lang}/all con esa combinación como query
                      // params. Si se deja vacío, la foto no es
                      // clickeable.
                      name: 'categories',
                      title: 'Categorías vinculadas (opcional, selección múltiple)',
                      description:
                        'Elige 1 o más categorías (de Ubicación / Tipo de Propiedad / Tipo de Oferta). Al hacer click en esta foto del carrusel, se navega al listado filtrado por esa combinación exacta. Si se deja vacío, la foto no es clickeable.',
                      type: 'array',
                      of: [{ type: 'reference', to: { type: 'category' } }],
                    },
                  ],
                  preview: {
                    select: { media: 'image', title: 'alt', mediaType: 'mediaType' },
                    prepare({ media, title, mediaType }) {
                      return {
                        title: title || (mediaType === 'video' ? 'Video' : 'Imagen'),
                        media: mediaType === 'video' ? VideoIcon : media,
                      };
                    },
                  },
                },
              ],
              validation: Rule => Rule.max(8),
            },
            {
              name: 'backgroundImage',
              title: 'Background Image (respaldo si "Hero Carousel Slides" está vacío)',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },

            {
              name: 'productImage',
              title: 'Product Image (respaldo si "Hero Carousel Slides" está vacío)',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              media: 'image',
            },
          },
        },
      ]
    },
    {
      name: "comparisonCard",
      fieldset: 'secciones',
      type: "array",
      title: "Hero - comparisonCard Content",
      description: "Content section with link elements",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: 'object',
              title: "Landing Service Title",
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
              name: "linkText",
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
              name: "linkPath",
              title: "Landing Service Link",
              type: 'string',
            },
            {
              name: "items",
              type: "array",
              title: "landing Service Items",
              description: "Enter all Items Services",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: 'title',
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
                      name: 'category',
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
                      name: 'spanColor',
                      title: 'Span Color',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Blue', value: 'blue' },
                          { title: 'Red', value: 'red' },
                          { title: 'Green', value: 'green' },
                          { title: 'Yellow', value: 'yellow' },
                          { title: 'Teal', value: 'teal' },
                          { title: 'Orange', value: 'orange' },
                        ],
                        layout: 'dropdown' // Ensures it appears as a dropdown menu
                      },
                    },
                    {
                      name: 'textColor',
                      title: 'Text Color',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Blue', value: 'blue' },
                          { title: 'Red', value: 'red' },
                          { title: 'Green', value: 'green' },
                          { title: 'Yellow', value: 'yellow' },
                          { title: 'Teal', value: 'teal' },
                          { title: 'Orange', value: 'orange' },
                        ],
                        layout: 'dropdown' // Ensures it appears as a dropdown menu
                      },
                    },
                    {
                      name: 'serviceLink',
                      title: 'Service Link',
                      type: 'string'

                    },
                  ],
                  preview: {
                    select: {
                      title: 'title.en',
                      media: 'image',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              media: 'image',
            },
          },
        },
      ]
    },

    {
      name: "infinitSlider",
      fieldset: 'secciones',
      type: "array",
      title: "Body - Infinit Slider Images",
      description: "Images as logo, clients, brands",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "items",
              type: "array",
              title: "Items of group",
              description: "Group of images",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: 'title',
                      title: 'Image Title',
                      type: 'string',
                    },
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                    },
                    {
                      name: 'imageAlt',
                      title: 'Image Alt',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      media: 'image',
                    },
                  },
                },
              ],
            },
          ]
        },
      ],
    },
    {
      name: "ServiceCards",
      fieldset: 'secciones',
      type: "array",
      title: "Body -  Right / Left Cards",
      description: "Enter all Cards Details",
      of: [
        {
          type: "object",
          fields: [
            {
              name: 'serviceCardTitle',
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
              name: 'serviceCarddescription',
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'text',
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
            {
              name: "contentCardPoints",
              type: "array",
              title: "Service Card Texts Items",
              description: "Enter all Service Card Items",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: 'contentCardItemDescription',
                      type: 'object',
                      fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
                      fields: supportedLanguages.map(lang => ({
                        title: lang.title,
                        name: lang.id,
                        type: 'text',
                        fieldset: lang.id === baseLanguage.id ? null : 'translations'
                      }))
                    },

                  ],
                  preview: {
                    select: {
                      title: 'contentCardItemDescription.en',
                      media: 'image',
                    },
                  },
                },
              ]
            },
            {
              name: 'serviceCarddescription2',
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'text',
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
            {
              name: 'serviceCardImage',
              title: 'Card Image ',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'serviceCardImageAlt',
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
              name: 'serviceCardReverse',
              title: 'Card Image Reverse ?',
              type: 'boolean',
            },
            {
              name: 'serviceCardAnimation',
              type: 'string',
              options: {
                list: [
                  { title: 'Slide In Left', value: 'animate-slideInLeft' },
                  { title: 'Slide In Right', value: 'animate-slideInRight' },
                  { title: 'Fade In', value: 'animate-fadeIn' },
                  { title: 'Bounce', value: 'animate-bounce' },
                  { title: 'Fade In Top Right', value: 'animate-fadeInTopRight' },
                  { title: 'Bounce In Left', value: 'animate-bounceInLeft' },
                ], // Define your animation options here
                layout: 'dropdown' // Ensures it appears as a dropdown menu
              }
            },
          ],
          preview: {
            select: {
              title: 'serviceCardTitle.en',
              media: 'image',
            },
          },
        },
      ]
    },
    {
      name: "sliders",
      fieldset: 'secciones',
      type: "array",
      title: "Body - paralax Sliders",
      description: "Enter all sliders",
      of: [
        {
          type: "object",
          fields: [
            {
              name: 'sliderTitle',
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
              name: 'sliderDescription',
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'text',
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
            {
              name: 'sliderImage',
              title: 'Slider Image ',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },
            {
              name: 'overlay',
              title: 'Image Overlay Color',
              type: 'string',
              description: 'Optional overlay color to apply over the slider image.',
              options: {
                list: [
                  { title: 'None', value: 'none' },
                  { title: 'Black', value: 'black' },
                  { title: 'White', value: 'white' },
                ],
                layout: 'dropdown'
              },
              initialValue: 'none'
            },
            {
              name: 'titleOverlayColor',
              title: 'Title Overlay Color',
              type: 'string',
              description: 'Muestra un fondo semitransparente detrás del título para mejorar la legibilidad.',
              options: {
                list: ['black', 'white', 'none'],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'black',
            },
            {
              name: 'titleTextColor',
              title: 'Title Text Color',
              type: 'string',
              description: 'Si no hay Overlay para el título. Elegir su color de texto.',
              options: {
                list: ['black', 'white'],
                layout: 'radio',
                direction: 'vertical',
              },
              initialValue: 'black',
            },
            {
              name: 'descriptionOverlayColor',
              title: 'Description Overlay Color',
              type: 'string',
              description: 'Muestra un fondo semitransparente detrás del texto para mejorar la legibilidad.',
              options: {
                list: ['black', 'white', 'none'],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'black',
            },
          ],
          preview: {
            select: {
              title: 'sliderTitle.en',
              media: 'image',
            },
          },
        },
      ]
    },
    {
      name: "keyActivities",
      fieldset: 'secciones',
      type: "array",
      title: "Body - Icon Box",
      description: "Enter all Items",
      of: [
        {
          type: "object",
          fields: [
            {
              name: 'title',
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
              type: 'object',
              fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: 'text',
                fieldset: lang.id === baseLanguage.id ? null : 'translations'
              }))
            },
            {
              name: 'attachment',
              title: 'Attachment Document',
              type: 'file',
              options: {
                accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar', // Optional: restrict file types
              },
            },
            {
              name: 'iconString',
              type: 'string',
              options: {
                list: [
                  { title: 'File', value: 'folderMinus' },
                  { title: 'Cash', value: 'banknotes' },
                  { title: 'Graph', value: 'presentationChartLine' },
                ], // Define your animation options here
                layout: 'dropdown' // Ensures it appears as a dropdown menu
              }
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              media: 'image',
            },
          },
        },
      ]
    },
    {
      name: "ctaContentCards",
      fieldset: 'secciones',
      type: "array",
      title: "Body - CTA Cards",
      description: "Enter all Cards Details",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "ctaCardTitle",
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
              name: "ctaCardSubtitle",
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
              name: "ctaCardDescription",
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
              name: "ctaCardButtonMessage",
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
              name: "ctaCardButtonLink",
              title: 'cta Card Button Link',
              type: 'string',
            },
            {
              name: "ctaCardImageAlt",
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
              name: 'ctaCardImage',
              title: 'CTA Card Image ',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              title: 'ctaCardTitle.en',
              media: 'image',
            },
          },
        },
      ]
    },
    {
      name: "testimonialSection",
      fieldset: 'secciones',
      title: "Body - Testimonial Section",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            // Section Title
            {
              name: "title",
              title: "Section Title",
              type: "object",
              fieldsets: [
                { name: "translations", title: "Translations", options: { collapsible: true } }
              ],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: "string",
                fieldset: lang.id === baseLanguage.id ? null : "translations"
              }))
            },

            // Section Description
            {
              name: "description",
              title: "Section Description",
              type: "object",
              fieldsets: [
                { name: "translations", title: "Translations", options: { collapsible: true } }
              ],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: "text",
                fieldset: lang.id === baseLanguage.id ? null : "translations"
              }))
            },

            // Background Image
            {
              name: "backgroundImage",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },

            // Testimonials Array
            {
              name: "testimonials",
              title: "Testimonials",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "quote",
                      title: "Quote",
                      type: "object",
                      fieldsets: [
                        { name: "translations", title: "Translations", options: { collapsible: true } }
                      ],
                      fields: supportedLanguages.map(lang => ({
                        title: lang.title,
                        name: lang.id,
                        type: "text",
                        fieldset: lang.id === baseLanguage.id ? null : "translations"
                      }))
                    },
                    {
                      name: "author",
                      title: "Author",
                      type: "string",
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              media: 'image',
            },
          },
        },
      ],
    },
    {
      name: "formSlider",
      fieldset: 'secciones',
      title: "Body - Form Slider Section",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            // Section Title
            {
              name: "title",
              title: "Section Title",
              type: "object",
              fieldsets: [
                { name: "translations", title: "Translations", options: { collapsible: true } }
              ],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: "string",
                fieldset: lang.id === baseLanguage.id ? null : "translations"
              }))
            },

            // Section Description
            {
              name: "description",
              title: "Section Description",
              type: "object",
              fieldsets: [
                { name: "translations", title: "Translations", options: { collapsible: true } }
              ],
              fields: supportedLanguages.map(lang => ({
                title: lang.title,
                name: lang.id,
                type: "text",
                fieldset: lang.id === baseLanguage.id ? null : "translations"
              }))
            },
            {
              name: "buttonText",
              title: "Button Text",
              type: "string",
            },
            {
              name: "buttonLink",
              title: "Button Link",
              type: "string",
            },
            {
              name: "backgroundColor",
              title: "background Color",
              type: "string",
            },
            // Background Image
            {
              name: "backgroundImage",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },
            {
              name: "productImage",
              title: "Product Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para SEO y accesibilidad.',
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              media: 'image',
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'image',
    },
  },
}
