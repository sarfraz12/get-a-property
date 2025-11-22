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
    },
  },
}
