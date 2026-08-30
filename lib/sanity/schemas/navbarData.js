// import { type } from "os";
import { supportedLanguages, baseLanguage } from './locales';
import { CogIcon } from "@sanity/icons";

export default {
  name: 'navbarData',
  type: 'document',
  icon: CogIcon,
  fields: [
    {
      name: "label",
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
      name: "href",
      title: "Href",
      type: 'string',
    },
    {
      name: "external",
      title: 'Is external link?',
      type: 'boolean',
    },
    {
      name: "button",
      title: 'Is Button?',
      type: 'boolean',
    },
    {
      // Controla el orden en que este ítem aparece en la barra de
      // navegación (ver GROQ: allnavbarquery ya ordena por este campo).
      // Antes el orden de los ítems del navbar dependía únicamente del
      // orden en que se crearon los documentos en Sanity, sin ninguna
      // forma de reordenarlos desde el Studio -- este campo lo resuelve.
      name: "order",
      title: "Orden de Aparición",
      description:
        'Controla en qué posición aparece este ítem en la barra de navegación (de menor a mayor -- ej. 1 aparece antes que 2). Si se deja vacío, el ítem aparece al final, después de todos los que sí tienen un número asignado.',
      type: 'number',
      validation: Rule => Rule.integer(),
    },
    {
      name: "children",
      type: "array",
      title: "Dropdown Menu",
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
              name: 'path',
              Title: 'Path',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'label.en',
        maxLength: 96,
      },
    },

  ],
  preview: {
    select: {
      title: 'label.en',
      order: 'order',
    },
    prepare(selection) {
      const { title, order } = selection;
      return {
        title,
        subtitle: order === undefined || order === null ? 'Sin orden asignado (va al final)' : `Orden: ${order}`,
      };
    },
  },
}
