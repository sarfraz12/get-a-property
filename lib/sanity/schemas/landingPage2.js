import { supportedLanguages, baseLanguage } from './locales';


export default {
  name: 'landingPage2',
  title: 'Landing Page',
  type: 'document',
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
      name: "hero",
      type: "array",
      title: "Hero - Main Image Slider",
      description: "Enter the hero content",
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
              name: 'buttonText',
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
              type: 'string',
            },
            {
              name: 'backgroundColor',
              type: 'string',
            },
            {
              name: 'backgroundImage',
              title: 'Background Image ',
              type: 'image',
              options: {
                hotspot: true,
              },
            },

            {
              name: 'productImage',
              title: 'Product Image ',
              type: 'image',
              options: {
                hotspot: true,
              },
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
            },
            {
              name: "productImage",
              title: "Product Image",
              type: "image",
              options: { hotspot: true },
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
