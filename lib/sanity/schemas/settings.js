import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";
import { supportedLanguages, baseLanguage } from "./locales";

export default defineType({
  name: "settings",
  type: "document",
  title: "Settings",
  icon: CogIcon,
  fieldsets: [
    {
      title: "SEO & metadata",
      name: "metadata",
      options: {
        collapsible: true,
        collapsed: false
      }
    },
    {
      title: "Social Media",
      name: "social"
    },
    {
      title: "Website Logo",
      name: "logos",
      options: {
        collapsible: true,
        collapsed: false
      }
    },
    {
      title: "Favicon",
      name: "favicon",
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    {
      title: "Textos del sitio",
      name: "siteCopy",
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    // Cada integración de terceros vive en su propio fieldset (pedido
    // del usuario: "que cada uno tenga su sección en sanity"), para
    // que se puedan ir conectando/desconectando sin tocar código --
    // ver cómo se consumen estos campos en app/(website)/[lang]/layout.tsx.
    {
      title: "Google Tag Manager",
      name: "gtm",
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    {
      title: "Google Analytics (GA4)",
      name: "ga",
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    {
      title: "Semrush",
      name: "semrush",
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    {
      title: "OpenRush",
      name: "openrush",
      options: {
        collapsible: true,
        collapsed: true
      }
    }
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Site title"
    }),
    defineField({
      title: "URL Whatsapp",
      name: "url",
      type: "url",
      description: "Enlace de WhatsApp que se usa en el botón/enlace de contacto del sitio (NO es la URL del sitio ni se usa para el canonical)."
    }),
    defineField({
      name: "copyright",
      type: "string",
      title: "Copyright ",
      description: "Enter copyright"
    }),
    defineField({
      title: "Main logo",
      description: "Upload your main logo here. SVG preferred. ",
      name: "logo",
      type: "image",
      fieldset: "logos",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity."
        },
        {
          name: "navbarMenu",
          type: "boolean",
          title: "Show in Nav Bar?",
          description: "This will make sure to show the image logo or Site Title instead"
        }
      ]
    }),

    defineField({
      title: "Alternate logo (optional)",
      description:
        "Upload alternate logo here. it can be light / dark variation ",
      name: "logoalt",
      type: "image",
      fieldset: "logos",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity."
        },
        {
          name: "navbarMenuAlt",
          type: "boolean",
          title: "Show in Alt Nav Bar?",
          description: "This will make sure to show the alt image logo or Site Title instead"
        }
      ]
    }),

    defineField({
      title: "Favicon (modo claro)",
      description:
        "Ícono que aparece en la pestaña del navegador cuando el sistema del visitante está en modo claro. Recomendado: PNG o SVG cuadrado (ej. 32x32 o 512x512, fondo transparente). Si se deja vacío, se usa /favicon.ico.",
      name: "faviconLight",
      type: "image",
      fieldset: "favicon"
    }),
    defineField({
      title: "Favicon (modo oscuro)",
      description:
        "Alternativa que se muestra cuando el sistema del visitante está en modo oscuro (el navegador cambia automáticamente según prefers-color-scheme). Si se deja vacío, se usa el favicon de modo claro.",
      name: "faviconDark",
      type: "image",
      fieldset: "favicon"
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Support Email",
      validation: Rule =>
        Rule.regex(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
          {
            name: "email", // Error message is "Does not match email-pattern"
            invert: false // Boolean to allow any value that does NOT match pattern
          }
        )
    }),

    defineField({
      name: "phone",
      type: "string",
      title: "Support Phone"
    }),

    defineField({
      name: "social",
      type: "array",
      title: "Social Links",
      description: "Enter your Social Media URLs",
      validation: Rule => Rule.unique(),
      of: [
        {
          type: "object",
          fields: [
            {
              type: "string",
              name: "media",
              title: "Choose Social Media",
              options: {
                list: [
                  { title: "Twitter", value: "twitter" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Linkedin", value: "linkedin" },
                  { title: "Youtube", value: "youtube" }
                ]
              }
            },
            {
              type: "url",
              name: "url",
              title: "Full Profile URL"
            }
          ],
          preview: {
            select: {
              title: "media",
              subtitle: "url"
            }
          }
        }
      ]
    }),

    defineField({
      title: "Meta Description",
      name: "description",
      fieldset: "metadata",
      type: "text",
      rows: 5,
      validation: Rule => Rule.min(20).max(200),
      description: "Enter SEO Meta Description"
    }),

    defineField({
      name: "openGraphImage",
      type: "image",
      title: "Open Graph Image",
      description:
        "Image for sharing previews on Facebook, Twitter etc.",
      fieldset: "metadata"
    }), 
    defineField({
      name: "location",
      type: "string",
      title: "Company Country location"
    }),
    defineField({
      title: "address",
      name: "address",
      type: "string",
      description: "The company address."
    }),
    defineField({
      name: "googleLink",
      type: "string",
      title: "Google Link Address ",
      description: "Enter Address Link"
    }),
    defineField({
      name: "googleIframe",
      type: "string",
      title: "Google googleIframe link ",
      description: "Enter googleIframe Link"
    }),
    defineField({
      name: "shopLink",
      type: "string",
      title: "Shop Link",
      description: "Enter your Shop Link (link externo o path interno comenzando con /)"
    }),
    defineField({
      name: "shopText",
      type: "string",
      title: "Text for shop Button",
      description: "The text that will take the button of the Shop"
    }),

    defineField({
      name: "twitterHandle",
      type: "string",
      title: "Twitter / X handle",
      description: "Usuario de Twitter/X del negocio, con arroba (ej. @getaproperty). Se usa en las etiquetas twitter:site para las tarjetas de vista previa. Déjalo vacío si no tienen cuenta.",
      fieldset: "metadata",
      validation: Rule =>
        Rule.custom(value => {
          if (!value) return true;
          return value.startsWith("@")
            ? true
            : "Debe empezar con @ (ej. @getaproperty)";
        })
    }),

    defineField({
      name: "priceRange",
      type: "string",
      title: "Rango de precios (SEO)",
      description:
        'Rango de precios que maneja el negocio, en el formato que espera Google (ej. "$$" o "$100000-$500000"). Se incluye en los datos estructurados (JSON-LD) como priceRange. Opcional -- déjalo vacío si prefieres que Google no muestre este dato.',
      fieldset: "metadata"
    }),

    defineField({
      name: "allPostsTitle",
      title: 'Título del listado "Todos los Posts"',
      description:
        'Encabezado grande que aparece arriba del listado completo de posts/propiedades (la página "/all"). Ej: "Propiedades" en vez de "Todos los Posts". Si se deja vacío en un idioma, ese idioma usa el texto por defecto ("Todos los Posts" / "All Posts").',
      type: "object",
      fieldset: "siteCopy",
      fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
      fields: supportedLanguages.map(lang => ({
        title: lang.title,
        name: lang.id,
        type: "string",
        fieldset: lang.id === baseLanguage.id ? null : "translations"
      }))
    }),

    defineField({
      name: "googleSiteVerification",
      type: "string",
      title: "Código de verificación de Google Search Console",
      description:
        'El código que te da Google Search Console para verificar el sitio por "etiqueta HTML" (solo el valor del content, ej. "abc123XYZ", no la etiqueta <meta> completa). Se usa para conectar el sitio a Search Console sin tocar el código.',
      fieldset: "metadata"
    }),

    // ------------------------------------------------------------------
    // Google Tag Manager -- reemplaza el ID que antes estaba escrito a
    // mano en app/(website)/[lang]/layout.tsx (GTM-TSL67V62). El sitio
    // arma el <script>/<noscript> completo solo (ver layout.tsx); acá
    // solo se pega el ID del contenedor. Si se deja vacío, el sitio
    // simplemente no renderiza el contenedor (no rompe nada).
    // ------------------------------------------------------------------
    defineField({
      name: "gtmContainerId",
      type: "string",
      title: "ID del contenedor GTM",
      description:
        'El ID que te da Google Tag Manager para tu contenedor (ej. "GTM-TSL67V62"), tal cual aparece en su panel (Admin > Instalar Google Tag Manager). El sitio arma el script y el <noscript> automáticamente con este ID -- no hace falta pegar el snippet completo.',
      fieldset: "gtm",
      validation: Rule =>
        Rule.custom(value => {
          if (!value) return true;
          return /^GTM-[A-Z0-9]+$/.test(value)
            ? true
            : 'Debe tener el formato "GTM-XXXXXXX" (tal cual lo muestra Google Tag Manager).';
        })
    }),
    defineField({
      name: "gtmEnabled",
      type: "boolean",
      title: "Contenedor GTM activo",
      description: "Apaga esto para dejar de cargar Google Tag Manager en el sitio sin tener que borrar el ID de arriba.",
      initialValue: true,
      fieldset: "gtm"
    }),

    // ------------------------------------------------------------------
    // Google Analytics (GA4) -- reemplaza el Measurement ID que antes
    // estaba escrito a mano en layout.tsx (G-SM5ZZYG685).
    // ------------------------------------------------------------------
    defineField({
      name: "gaMeasurementId",
      type: "string",
      title: "ID de medición de GA4",
      description:
        'El "Measurement ID" de tu propiedad de Google Analytics 4 (ej. "G-SM5ZZYG685"), lo encuentras en Analytics > Admin > Flujos de datos > (tu sitio). El sitio arma el script de gtag.js automáticamente con este ID.',
      fieldset: "ga",
      validation: Rule =>
        Rule.custom(value => {
          if (!value) return true;
          return /^G-[A-Z0-9]+$/.test(value)
            ? true
            : 'Debe tener el formato "G-XXXXXXXXXX" (tal cual lo muestra Google Analytics).';
        })
    }),
    defineField({
      name: "gaEnabled",
      type: "boolean",
      title: "Google Analytics activo",
      description: "Apaga esto para dejar de cargar Google Analytics en el sitio sin tener que borrar el ID de arriba.",
      initialValue: true,
      fieldset: "ga"
    }),

    // ------------------------------------------------------------------
    // Semrush -- mismo patrón que googleSiteVerification: Semrush (Site
    // Audit / "Domain" -> verificar propiedad) te pide agregar una
    // etiqueta <meta> con un nombre y un valor específicos. Acá se
    // guardan ambos (el nombre lo define Semrush, por eso es un campo
    // editable y no algo fijo en el código) y el sitio arma
    // <meta name={...} content={...} /> solo -- ver layout.tsx /
    // sharedMetaData(). Si se deja vacío, no se renderiza nada.
    // ------------------------------------------------------------------
    defineField({
      name: "semrushVerificationMetaName",
      type: "string",
      title: "Nombre de la etiqueta meta de verificación",
      description:
        'El "name" exacto que te pida Semrush al conectar tu dominio (Site Audit → Verificar propiedad → "Etiqueta HTML"), tal cual aparece en su panel. Déjalo vacío si todavía no vas a conectar Semrush.',
      fieldset: "semrush"
    }),
    defineField({
      name: "semrushVerificationCode",
      type: "string",
      title: "Valor de la etiqueta (content)",
      description: "El valor/código que te da Semrush para esa misma etiqueta (solo el content, no la etiqueta <meta> completa).",
      fieldset: "semrush"
    }),

    // ------------------------------------------------------------------
    // OpenRush -- mismo patrón que Semrush arriba.
    // ------------------------------------------------------------------
    defineField({
      name: "openrushVerificationMetaName",
      type: "string",
      title: "Nombre de la etiqueta meta de verificación",
      description:
        'El "name" exacto que te pida OpenRush al conectar tu dominio, tal cual aparece en su panel. Déjalo vacío si todavía no vas a conectar OpenRush.',
      fieldset: "openrush"
    }),
    defineField({
      name: "openrushVerificationCode",
      type: "string",
      title: "Valor de la etiqueta (content)",
      description: "El valor/código que te da OpenRush para esa misma etiqueta (solo el content, no la etiqueta <meta> completa).",
      fieldset: "openrush"
    }),
  ]
});
