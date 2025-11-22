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
  allaboutpagequery,
  categoryidquery,
  allnavbarquery,
  allfooterquery,
  landingdataallquery2,
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

export async function getAllAuthors() {
  if (client) {
    return (await client.fetch(allauthorsquery)) || [];
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

export async function getLandingData2(lang: string) {
  if (client) {
    return (await client.fetch(landingdataallquery2, {lang})) || [];
  }
  return [];

}