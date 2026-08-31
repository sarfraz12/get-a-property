import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

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
      description: "The main site url. Used to create canonical url"
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
  ]
});
