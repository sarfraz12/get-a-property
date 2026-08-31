import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { supportedLanguages, baseLanguage } from './locales';

export default {
  name: 'author',
  title: 'Vendedor',
  type: 'document',
  icon:BlockContentIcon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      // NUEVO: cargo/rol de la persona (ej. "Fundadora", "Encargado de
      // producción"). Se muestra en la tarjeta de "Nuestro equipo" de
      // la página Nosotros. Opcional -- si está vacío, esa línea
      // simplemente no se muestra.
      name: 'role',
      title: 'Cargo / Rol (opcional)',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      // NUEVO: para mostrar contacto del autor en la tarjeta de la
      // página del post. Opcional -- si el autor no tiene email/
      // teléfono cargado, esas líneas simplemente no se muestran.
      name: 'email',
      title: 'Email de contacto (opcional)',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Teléfono de contacto (opcional)',
      type: 'string',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
}
