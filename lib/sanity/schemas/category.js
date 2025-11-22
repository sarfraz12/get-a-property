import { supportedLanguages, baseLanguage } from './locales';
import {BlockContentIcon} from '@sanity/icons'

export default {
  name: "category",
  title: "Category",
  type: "document",
  icon:BlockContentIcon,
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
      name: "color",
      title: "Color",
      type: "string",
      description: "Color of the category",
      options: {
        list: [
          { title: "Green", value: "green" },
          { title: "Blue", value: "blue" },
          { title: "Purple", value: "purple" },
          { title: "Orange", value: "orange" }
        ]
      }
    },
    {
      name: "description",
      title: "Description",
      type: "text"
    }
  ],
  preview: {
    select: {
      title: 'title.en',
    },
  },
};
