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

// Tags de cache de Next.js para revalidación bajo demanda ------------
//
// app/api/revalidate/route.ts (webhook de Sanity) llama a
// `revalidateTag(...)` con estos mismos nombres cuando cambia contenido
// en el Studio, así que cada fetch de acá abajo se etiqueta con el/los
// tag(s) que le corresponden según qué documento(s) usa. Esto evita
// tener que mantener una lista de rutas a mano (como pasaba antes) y
// automáticamente cubre "es" y "en" con un solo revalidateTag, porque
// el tag no depende del idioma, solo del documento.
//
// El `revalidate: 60` es sólo un respaldo por si algún webhook no
// llegara a dispararse (ej. mientras se configura por primera vez): en
// el peor caso el contenido tarda hasta 60s en refrescarse solo, en
// vez de quedar desactualizado hasta el próximo deploy.
type SanityTag =
  | "post"
  | `post:${string}`
  | "category"
  | `category:${string}`
  | "author"
  | `author:${string}`
  | "settings"
  | "navbarData"
  | "footerData"
  | "aboutPage"
  | "contactPage"
  | "searchPage"
  | "landingPage";

async function sanityFetch<T = any>(
  query: string,
  params: Record<string, any> = {},
  tags: SanityTag[] = []
): Promise<T | undefined> {
  if (!client) return undefined;
  return client.fetch(query, params, { next: { revalidate: 60, tags } }) as Promise<T>;
}

export async function getAllPosts(lang: string) {
  return (await sanityFetch(postquery, { lang }, ["post"])) || [];
}

export async function getSettings() {
  return (await sanityFetch(configQuery, {}, ["settings"])) || [];
}

export async function getPostBySlug(slug: string, lang: string) {
  return (
    (await sanityFetch(singlequery, { slug, lang }, ["post", `post:${slug}`])) || {}
  );
}

export async function getAllPostsSlugs() {
  const slugs = (await sanityFetch<any[]>(pathquery, {}, ["post"])) || [];
  return slugs.map((slug: any) => ({ slug }));
}
// Author
export async function getAllAuthorsSlugs() {
  const slugs = (await sanityFetch<any[]>(authorsquery, {}, ["author"])) || [];
  return slugs.map((slug: any) => ({ author: slug }));
}

export async function getAuthorPostsBySlug(slug: string, lang: string) {
  return (
    (await sanityFetch(postsbyauthorquery, { slug, lang }, [
      "post",
      `author:${slug}`,
    ])) || {}
  );
}

export async function getAllAuthors(lang: string) {
  // Antes no se pasaba `lang` acá, así que `role[$lang]` en la query
  // (ver allauthorsquery en groq.js) siempre habría quedado undefined.
  // Se corrige para que el nuevo campo "role" del autor sí se resuelva
  // en el idioma activo, igual que el resto de los campos bilingües.
  return (await sanityFetch(allauthorsquery, { lang }, ["author"])) || [];
}

// Category

export async function getAllCategories() {
  const slugs = (await sanityFetch<any[]>(catpathquery, {}, ["category"])) || [];
  return slugs.map((slug: any) => ({ category: slug }));
}

export async function getPostsByCategory(slug: string, lang: string) {
  return (
    (await sanityFetch(postsbycatquery, { slug, lang }, [
      "post",
      `category:${slug}`,
    ])) || {}
  );
}

// SEO opcional de una categoría puntual (documento category -> grupo
// "SEO" -- ver lib/sanity/schemas/category.js). Devuelve null si no
// existe una categoría con ese slug (ej. "all", que no es una
// categoría real en Sanity), para que
// app/(website)/[lang]/[category]/page.js siga usando su SEO
// automático sin romperse.
export async function getCategoryBySlug(slug: string, lang: string) {
  return (
    (await sanityFetch(categorybyslugquery, { slug, lang }, [
      "category",
      `category:${slug}`,
    ])) || null
  );
}

export async function getTopCategories(lang: string) {
  return (await sanityFetch(catquery, { lang }, ["category"])) || [];
}

export async function getPaginatedPosts(limit: any) {
  return (
    (await sanityFetch(
      paginatedquery,
      {
        pageIndex: 0,
        limit: limit,
      },
      ["post"]
    )) || {}
  );
}


export async function getPostById(postId: string, lang: string) {
  return (await sanityFetch(idquery, { postId, lang }, ["post"])) || {};
}

export async function getCategoriesById(categoryId: string) {
  return (
    (await sanityFetch(categoryidquery, { categoryId }, ["category"])) || {}
  );
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
  return (await sanityFetch(allcatquery, { lang }, ["category"])) || [];
}

// Categorías marcadas "featured" (ver lib/sanity/schemas/category.js),
// para la sección de categorías del landing page.
export async function getFeaturedCategories(lang: string) {
  return (
    (await sanityFetch(featuredCategoriesQuery, { lang }, ["category"])) || []
  );
}

export async function getNavbarData(lang: string) {
  return (await sanityFetch(allnavbarquery, { lang }, ["navbarData"])) || [];
};


export async function getFooterData(lang: string) {
  return (await sanityFetch(allfooterquery, { lang }, ["footerData"])) || [];
};


export async function getAboutPage(lang: string) {
  return (await sanityFetch(allaboutpagequery, { lang }, ["aboutPage"])) || [];
};

// SEO editable desde Sanity para la página "Contacto" (documento
// contactPage -- ver lib/sanity/schemas/contactPage.js). Devuelve un
// objeto vacío (no un array) si todavía no se creó el documento en
// Studio, para que app/(website)/[lang]/contact/page.js pueda seguir
// usando "?." con su texto de respaldo sin romperse.
export async function getContactPage(lang: string) {
  return (await sanityFetch(contactpagequery, { lang }, ["contactPage"])) || {};
};

// SEO editable desde Sanity para la página "Búsqueda" (documento
// searchPage -- ver lib/sanity/schemas/searchPage.js). Mismo criterio
// que getContactPage: objeto vacío si aún no existe el documento.
export async function getSearchPage(lang: string) {
  return (await sanityFetch(searchpagequery, { lang }, ["searchPage"])) || {};
};

export async function getLandingData(lang: string) {
  // El landing trae posts destacados y categorías destacadas además de
  // su propio contenido, así que se etiqueta con los tres tags para
  // que revalidateTag("post") o revalidateTag("category") también lo
  // refresquen a él.
  return (
    (await sanityFetch(landingdataallquery, { lang }, [
      "landingPage",
      "post",
      "category",
    ])) || []
  );

}
