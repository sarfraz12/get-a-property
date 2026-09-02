import { groq } from "next-sanity";

// Get all posts
export const postquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
  _id,
  _createdAt,
  publishedAt,
  mainImage {
    ...,
    "blurDataURL":asset->metadata.lqip,
    "ImageColor": asset->metadata.palette.dominant.background,
  },
  featured,
  "excerpt": excerpt[$lang],
  // price/location: bilingües (ver lib/sanity/schemas/post.js), hay
  // que resolverlos al idioma activo igual que title/excerpt --
  // "..." los traería como el objeto crudo {es, en} sin esto.
  "price": price[$lang],
  "location": location[$lang],
  // estReadingTime / galleryCount: mismo cálculo que ya usaba
  // singlequery para la página del post, ahora también acá para que
  // las tarjetas del listado (PostCard) puedan mostrar "X min" y
  // "X fotos" sin tener que traer el body/gallery completos.
  "estReadingTime": round(length(pt::text(body)) / 5 / 180),
  "galleryCount": count(gallery),
  // Puntos clave (icono + texto) -- ver PostCard.tsx, que ahora los
  // usa como la fila de datos de la tarjeta en vez de datos genéricos.
  "highlights": highlights[]{ "text": select($lang == "es" => es, en), icon },
  slug,
  productMain,
  "title": title[$lang],
  author-> {
    _id,
    image,
    slug,
    name
  },
  categories[]->{
    ...,
    "title": title[$lang]
  },
}
`;
// Get all posts with 0..limit
export const limitquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [0..$limit] {
  ...,
  author->,
  categories[]->
}
`;
// [(($pageIndex - 1) * 10)...$pageIndex * 10]{
// Get subsequent paginated posts
export const paginatedquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->
}
`;

// body[]{
//   ...,
//   markDefs[]{
//     ...,
//     _type == "internalLink" => {
//       "slug": @.reference->slug
//     }
//   }
// },

// Single Post
export const singlequery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ...,
  "title": title[$lang],
  "excerpt": excerpt[$lang],
  "price": price[$lang],
  "location": location[$lang],
  "seoKeywords": seoKeywords[$lang],
  "metaTitle": metaTitle[$lang],
  "metaDescription": metaDescription[$lang],
  "ogImage": ogImage,
  "canonicalUrl": canonicalUrl,
  "noIndex": noIndex,
  "body": body[$lang][]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  author->,
  categories[]->{
    ...,
    "title": title[$lang]
  },
  "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  // "icon" no se traduce (es sólo un selector -- ver post.js), pasa
  // tal cual para que el frontend elija el ícono real correcto.
  "highlights": highlights[]{ "text": select($lang == "es" => es, en), icon },
  // Documentos descargables (ver lib/sanity/schemas/post.js -> attachments).
  // "url"/"filename" se resuelven acá porque un campo "file" de Sanity
  // sólo trae la referencia al asset -- "..." no la sigue.
  "attachments": attachments[]{
    "title": title[$lang],
    "url": file.asset->url,
    "filename": file.asset->originalFilename,
  },
  // "related": posts que comparten al menos una categoría con este,
  // excluyendo el post actual. Se proyecta con la MISMA forma que
  // espera components/posts/PostCard.tsx (_id, title, slug, fechas,
  // mainImage, categories[].title, author.name) para poder
  // reutilizar esa tarjeta tal cual en la sección de "relacionados"
  // al final de la página del post.
  "related": *[
    _type == "post" &&
    slug.current != $slug &&
    count(categories[@._ref in ^.^.categories[]._ref]) > 0
  ] | order(publishedAt desc, _createdAt desc) [0...6] {
    _id,
    _createdAt,
    publishedAt,
    "title": title[$lang],
    slug,
    mainImage,
    "price": price[$lang],
    "location": location[$lang],
    "highlights": highlights[]{ "text": select($lang == "es" => es, en), icon },
    categories[]->{ "title": title[$lang], color, slug },
    author->{ name }
  },
}
`;

// Paths for generateStaticParams
export const pathquery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;
export const catpathquery = groq`
*[_type == "category" && defined(slug.current)][].slug.current
`;
export const authorsquery = groq`
*[_type == "author" && defined(slug.current)][].slug.current
`;

// Get Posts by Authors
export const postsbyauthorquery = groq`
*[_type == "post" && $slug match author->slug.current ] {
  ...,
  author->,
  categories[]->{
    ...,
    "title": title[$lang]
  },
}
`;

// Get Posts by Category
export const postsbycatquery = groq`
*[_type == "post" && $slug in categories[]->slug.current ] {
  ...,
  "title": title[$lang],
  "excerpt": excerpt[$lang],
  "price": price[$lang],
  "location": location[$lang],
  "estReadingTime": round(length(pt::text(body)) / 5 / 180),
  "galleryCount": count(gallery),
  "highlights": highlights[]{ "text": select($lang == "es" => es, en), icon },
  author->,
  categories[]->{
    ...,
    "title": title[$lang]
    },
}
`;

// Get top 5 categories
// SEO opcional de una categoría puntual (lib/sanity/schemas/category.js
// -> metaTitle/metaDescription/noIndex), usada por
// app/(website)/[lang]/[category]/page.js para poder anular el
// título/descripción que ya arma solo a partir del nombre real de la
// categoría. Devuelve null si la categoría no existe (ej. slug "all",
// que no es una categoría real) -- el código ya maneja ese caso.
export const categorybyslugquery = groq`
*[_type == "category" && slug.current == $slug][0] {
  "seoKeywords": seoKeywords[$lang],
  "metaTitle": metaTitle[$lang],
  "metaDescription": metaDescription[$lang],
  "ogImage": ogImage,
  "canonicalUrl": canonicalUrl,
  "noIndex": noIndex,
}
`;

export const catquery = groq`*[_type == "category"] {
  ...,
  "title": title[$lang],
  "count": count(*[_type == "post" && references(^._id)])
} | order(count desc) [0...5]`;

export const searchquery = groq`
  *[_type == "post" && _score > 0]
  | score(
    title[$lang] match "*"+$query+"*" || 
    excerpt[$lang] match "*"+$query+"*" || 
    pt::text(body[$lang]) match "*"+$query+"*"
  )
  | order(_score desc)
  {
    _score,
    _id,
    _createdAt,
    mainImage,
    author->,
    categories[]->{
      ...,
      "title": title[$lang]
    },
    "title": title[$lang],
    "excerpt": excerpt[$lang],
    "price": price[$lang],
    "location": location[$lang],
    "highlights": highlights[]{ "text": select($lang == "es" => es, en), icon },
    slug
  }
`;

// Get all Authors
export const allauthorsquery = groq`
*[_type == "author"] {
 ...,
 'slug': slug.current,
 "role": role[$lang],
}
`;

// Paths for searchbyid
export const idquery = groq`
*[_type == "post" && _id == $postId][0] {
  ...,
  _id,
  "title": title[$lang],
  "excerpt": excerpt[$lang],
  "price": price[$lang],
  "location": location[$lang],
  mainImage {
    ...,
    "blurDataURL":asset->metadata.lqip,
    "ImageColor": asset->metadata.palette.dominant.background,
  },
  author-> {
    _id,
    image,
    slug,
    name
  },
  categories[]->,
}
`;


// Paths for Category searchbyid
export const categoryidquery = groq`
*[_type == "category" && _id == $categoryId][0] {
  "slug": slug.current,
}
`;

// Get all categories
export const allcatquery = groq`*[_type == "category"] {
  ...,
  "title": title[$lang],
  "count": count(*[_type == "post" && references(^._id)])
} `;

// NUEVO: categorías marcadas "featured" en Sanity (ver
// lib/sanity/schemas/category.js -> featured/featuredImage), para la
// sección de categorías del landing page. Antes esa sección armaba la
// lista sola a partir de los posts cargados; ahora el editor elige a
// mano cuáles mostrar, con su propia imagen.
export const featuredCategoriesQuery = groq`
*[_type == "category" && featured == true] | order(title[$lang] asc) {
  ...,
  "title": title[$lang],
  "count": count(*[_type == "post" && references(^._id)])
}
`;

// Get Site Config
export const configQuery = groq`
*[_type == "settings"][0] {
  ...,
}
`;

// Get all Navbar Data
// Ordenado por el campo "order" (Task: agregar indexado a los items del
// navbar para controlar su orden de aparición) -- coalesce() manda al
// final los ítems que todavía no tienen un número asignado, en vez de
// mezclarlos de forma impredecible con los que sí lo tienen.
export const allnavbarquery = groq`
*[_type == "navbarData"] | order(coalesce(order, 9999) asc) {
   ...,
  "slug": slug.current,
  "label": label[$lang],
  "order": order,
  "children": children[]{
    ...,
    "title": title[$lang],
  }
}
`;

// Get all Footer Data
export const allfooterquery = groq`
*[_type == "footerData"] {
   ...,
  "slug": slug.current,
  "title": title[$lang],
  "children": children[]{
    ...,
    "title": title[$lang],
  }
}
`;

// Get all About Us Page
export const allaboutpagequery = groq`
*[_type == "aboutPage"] {
   ...,
  "slug": slug.current,
  "title": title[$lang],
  "description": description[$lang],
  "heroStats": heroStats[]{ value, "label": label[$lang] },
  "heroImage": heroImage,
  "body": body[$lang],
  "whatWeDoHeading": whatWeDoHeading[$lang],
  "whatWeDoItems": whatWeDoItems[]{ icon, "title": title[$lang], "description": description[$lang] },
  "processImage": processImage,
  "processHeading": processHeading[$lang],
  "processDescription": processDescription[$lang],
  "processItems": processItems[]{ "text": text[$lang] },
  "teamHeading": teamHeading[$lang],
  "teamDescription": teamDescription[$lang],
  "ctaText": ctaText[$lang],
  "seoKeywords": seoKeywords[$lang],
  "metaTitle": metaTitle[$lang],
  "metaDescription": metaDescription[$lang],
  "ogImage": ogImage,
  "canonicalUrl": canonicalUrl,
  "noIndex": noIndex,
}
`;

// SEO editable de la página "Contacto" (lib/sanity/schemas/contactPage.js).
// Sólo debería existir un documento; se toma el primero (o ninguno,
// si todavía no se creó en Studio -- el código usa su propio texto
// de respaldo en ese caso).
export const contactpagequery = groq`
*[_type == "contactPage"][0] {
  ...,
  "seoKeywords": seoKeywords[$lang],
  "metaTitle": metaTitle[$lang],
  "metaDescription": metaDescription[$lang],
  "ogImage": ogImage,
  "canonicalUrl": canonicalUrl,
  "noIndex": noIndex,
}
`;

// SEO editable de la página "Búsqueda" (lib/sanity/schemas/searchPage.js).
export const searchpagequery = groq`
*[_type == "searchPage"][0] {
  ...,
  "seoKeywords": seoKeywords[$lang],
  "metaTitle": metaTitle[$lang],
  "metaDescription": metaDescription[$lang],
  "ogImage": ogImage,
  "canonicalUrl": canonicalUrl,
  "noIndex": noIndex,
}
`;

// Get all Landing Data
export const landingdataallquery = groq`
*[_type == "landingPage"] {
  ...,
  "slug": slug.current,
  "title": title[$lang],
  "description": description[$lang],
  "buttonText": buttonText[$lang],
  "buttonLink": buttonLink[$lang],
  "seoKeywords": seoKeywords[$lang],
  "metaTitle": metaTitle[$lang],
  "metaDescription": metaDescription[$lang],
  "ogImage": ogImage,
  "canonicalUrl": canonicalUrl,
  "noIndex": noIndex,
  "aboutTitle": aboutTitle[$lang],
  "aboutParagraphs": aboutParagraphs[]{ "text": text[$lang] },
  "aboutStats": aboutStats[]{ "value": value, "label": label[$lang] },
  "aboutButtonText": aboutButtonText[$lang],
  "aboutButtonLink": aboutButtonLink[$lang],
  "aboutWords": aboutWords[]{ "word": word[$lang] },
  "teamTitle": teamTitle[$lang],
  "teamDescription": teamDescription[$lang],
  "teamMembers": teamMembers[]{
    "name": name,
    "role": role[$lang],
    "email": email,
    "phone": phone,
    "image": image,
  },
  "sliders": sliders[]{
    ...,
    "sliderTitle": sliderTitle[$lang],
    "sliderDescription": sliderDescription[$lang]
  },
  "hero": hero[]{
    ...,
    "title": title[$lang],
    "description": description[$lang],
    "buttonText": buttonText[$lang],
    // NUEVO: cada slide ahora puede traer VARIAS categorías vinculadas
    // (ver lib/sanity/schemas/landingPage.js -> hero.slides.categories).
    // "..." NO sigue referencias dentro de un array anidado, así que
    // hay que proyectar "slides" a mano para resolver esas referencias
    // (slug + título + tipo de cada una) y poder armar la combinación
    // de filtros real en el Hero.
    //
    // NUEVO: slide de tipo video (mediaType == "video", ver el schema).
    // "video" llega como referencia cruda a un asset "file" de Sanity
    // (no "image" -- lib/sanity/image.js -> urlForImage() da por
    // sentado el formato de un _ref de imagen y rompe con uno de
    // archivo). Se resuelve acá mismo la URL directa del archivo
    // (mismo patrón que "attachmentUrl" en keyActivities más abajo),
    // así el frontend usa slide.videoUrl tal cual en el <video>, sin
    // tener que armar la URL a mano.
    "slides": slides[]{
      ...,
      "videoUrl": video.asset->url,
      "videoMimeType": video.asset->mimeType,
      "categories": categories[]->{
        "title": title[$lang],
        "slug": slug.current,
        categoryType
      }
    },
  },
   "comparisonCard": comparisonCard[]{
    ...,
    "title": title[$lang],
    "description": description[$lang],
    "linkText": linkText[$lang],
    "linkPath": linkPath,
    "items": items[]{
      ...,
      "title": title[$lang],
      "category": category[$lang],
      "spanColor": spanColor,
      "textColor": textColor,
      "serviceLink": serviceLink,
    }
  },
  "infinitSlider": infinitSlider[]{
    "items": items[] {
      "title": title,
      "image": image,
      "imageAlt": imageAlt
    }
  },
  "keyActivities": keyActivities[]{
    ...,
    "title": title[$lang],
    "description": description[$lang],
    "attachmentUrl": attachment.asset->url

  },
  "ServiceCards": ServiceCards[]{
    ...,
    "serviceCardTitle": serviceCardTitle[$lang],
    "serviceCarddescription": serviceCarddescription[$lang],
    "serviceCarddescription2": serviceCarddescription2[$lang],
    "serviceCardImageAlt": serviceCardImageAlt[$lang],
    "contentCardPoints": contentCardPoints[]{
      ...,
      "contentCardItemDescription": contentCardItemDescription[$lang]
    }
  },
  "ctaContentCards": ctaContentCards[]{
    ...,
    "ctaCardTitle": ctaCardTitle[$lang],
    "ctaCardSubtitle": ctaCardSubtitle[$lang],
    "ctaCardDescription": ctaCardDescription[$lang],
    "ctaCardButtonMessage": ctaCardButtonMessage[$lang],
    "ctaCardImageAlt": ctaCardImageAlt[$lang],
  },
  "testimonialSection": testimonialSection[]{
    ...,
    "title": title[$lang],
    "description": description[$lang],
    "testimonials": testimonials[]{
      ...,
      "quote": quote[$lang],
    }
 
  },

  "formSlider": formSlider[]{
    ...,
    "title": title[$lang],
    "description": description[$lang],
  },


}
`;