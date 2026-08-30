import { apiVersion, dataset, projectId, tokenId, useCdn } from "./config";
import {
  idquery,
  postquery,
  paginatedquery,
  configQuery,
  singlequery,
  pathquery,
  allauthorsquery,
  authorsquery,
  postsbyauthorquery,
  postsbycatquery,
  catpathquery,
  catquery,
  allcatquery,
  categorybyslugquery,
  allaboutpagequery,
  categoryidquery,
  allnavbarquery,
  allfooterquery,
  landingdataallquery,
  featuredCategoriesQuery,
  contactpagequery,
  searchpagequery,
} from "./groq";
import {createClient } from "next-sanity";

if (!projectId) {
  console.error(
    "The Sanity Project ID is not set. Check your environment variables."
  );
}

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null;

export const fetcher = async ([query, params]: any) => {
  return client ? client.fetch(query, params) : [];
};

export async function getAllPosts(lang: string) {
  if (client) {
    return (await client.fetch(postquery, {lang})) || [];
  }
  return [];
}

export async function getSettings() {
  if (client) {
    return (await client.fetch(configQuery)) || [];
  }
  return [];
}

export async function getPostBySlug(slug: string, lang: string) {
  if (client) {
    return (await client.fetch(singlequery, { slug, lang })) || {};
  }
  return {};
}

export async function getAllPostsSlugs() {
  if (client) {
    const slugs = (await client.fetch(pathquery)) || [];
    return slugs.map((slug:any) => ({ slug }));
  }
  return [];
}
// Author
export async function getAllAuthorsSlugs() {
  if (client) {
    const slugs = (await client.fetch(authorsquery)) || [];
    return slugs.map((slug:any) => ({ author: slug }));
  }
  return [];
}

export async function getAuthorPostsBySlug(slug: string, lang: string) {
  if (client) {
    return (await client.fetch(postsbyauthorquery, { slug, lang })) || {};
  }
  return {};
}

export async function getAllAuthors(lang: string) {
  // Antes no se pasaba `lang` acá, así que `role[$lang]` en la query
  // (ver allauthorsquery en groq.js) siempre habría quedado undefined.
  // Se corrige para que el nuevo campo "role" del autor sí se resuelva
  // en el idioma activo, igual que el resto de los campos bilingües.
  if (client) {
    return (await client.fetch(allauthorsquery, { lang })) || [];
  }
  return [];
}

// Category

export async function getAllCategories() {
  if (client) {
    const slugs = (await client.fetch(catpathquery)) || [];
    return slugs.map((slug:any) => ({ category: slug }));
  }
  return [];
}

export async function getPostsByCategory(slug: string, lang: string) {
  if (client) {
    return (await client.fetch(postsbycatquery, { slug, lang })) || {};
  }
  return {};
}

// SEO opcional de una categoría puntual (documento category -> grupo
// "SEO" -- ver lib/sanity/schemas/category.js). Devuelve null si no
// existe una categoría con ese slug (ej. "all", que no es una
// categoría real en Sanity), para que
// app/(website)/[lang]/[category]/page.js siga usando su SEO
// automático sin romperse.
export async function getCategoryBySlug(slug: string, lang: string) {
  if (client) {
    return (await client.fetch(categorybyslugquery, { slug, lang })) || null;
  }
  return null;
}

export async function getTopCategories(lang: string) {
  if (client) {
    return (await client.fetch(catquery, {lang})) || [];
  }
  return [];
}

export async function getPaginatedPosts(limit: any) {
  if (client) {
    return (
      (await client.fetch(paginatedquery, {
        pageIndex: 0,
        limit: limit
      })) || {}
    );
  }
  return {};
}


export async function getPostById(postId: string, lang: string) {
  if (client) {
    return (await client.fetch(idquery, { postId, lang })) || {};
  }
  return {};
}

export async function getCategoriesById(categoryId: string) {
  if (client) {
    return (await client.fetch(categoryidquery, { categoryId })) || {};
  }
  return {};
}

export async function createPreRegisterUser(formData: any) {

  const clientCreate = createClient({ projectId: projectId, dataset: dataset, useCdn: false, 
    apiVersion: apiVersion, token: tokenId, ignoreBrowserTokenWarning: true })

  if (clientCreate) {
    return await clientCreate.create({
      _type: 'preRegisterForm',
      ...formData,
      slug: {
        _type: 'slug',
        current: `${formData.firstName}-${formData.lastName}-${formData.identification}`.toLowerCase().replace(/\s+/g, '-')
      },
    })
  }
}

export async function getAllCategoriesCount(lang: string) {
  if (client) {
    return (await client.fetch(allcatquery, {lang})) || [];
  }
  return [];
}

// Categorías marcadas "featured" (ver lib/sanity/schemas/category.js),
// para la sección de categorías del landing page.
export async function getFeaturedCategories(lang: string) {
  if (client) {
    return (await client.fetch(featuredCategoriesQuery, { lang })) || [];
  }
  return [];
}

export async function getNavbarData(lang: string) {
  if (client) {
    return (await client.fetch(allnavbarquery, {lang})) || [];
  }
  return [];
};


export async function getFooterData(lang: string) {
  if (client) {
    return (await client.fetch(allfooterquery, {lang})) || [];
  }
  return [];
};


export async function getAboutPage(lang: string) {
  if (client) {
    return (await client.fetch(allaboutpagequery, {lang})) || [];
  }
  return [];
};

// SEO editable desde Sanity para la página "Contacto" (documento
// contactPage -- ver lib/sanity/schemas/contactPage.js). Devuelve un
// objeto vacío (no un array) si todavía no se creó el documento en
// Studio, para que app/(website)/[lang]/contact/page.js pueda seguir
// usando "?." con su texto de respaldo sin romperse.
export async function getContactPage(lang: string) {
  if (client) {
    return (await client.fetch(contactpagequery, { lang })) || {};
  }
  return {};
};

// SEO editable desde Sanity para la página "Búsqueda" (documento
// searchPage -- ver lib/sanity/schemas/searchPage.js). Mismo criterio
// que getContactPage: objeto vacío si aún no existe el documento.
export async function getSearchPage(lang: string) {
  if (client) {
    return (await client.fetch(searchpagequery, { lang })) || {};
  }
  return {};
};

export async function getLandingData(lang: string) {
  if (client) {
    return (await client.fetch(landingdataallquery, {lang})) || [];
  }
  return [];

}