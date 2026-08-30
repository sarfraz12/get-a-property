import { getAllPostsSlugs, getAllCategories } from '@/lib/sanity/client';
// import post from '@/lib/sanity/schemas/post';
import { MetadataRoute } from 'next'

export default async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL as string;

  // Get Posts
  const posts = await getAllPostsSlugs() || [];


  const postLinks = posts?.flatMap(({ slug }: any) => [
    {
      url: `${baseURL}/en/all/post/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseURL}/es/all/post/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]);
  



  // Get Categories
  const categories = await getAllCategories() || [];

  // console.log(categories)

  const categoryLinks = categories?.flatMap(({ category }: any) => [
    {
      url: `${baseURL}/en/${category}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseURL}/es/${category}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]);

    // console.log(categoryLinks)

  const dynamicLinks = [...postLinks, ...categoryLinks];

  return [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/en/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/es/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
        {
      url: `${baseURL}/en/contact/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/es/contact/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
     {
      url: `${baseURL}/en/aboutUs/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/es/aboutUs/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
     {
      url: `${baseURL}/en/search/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/es/search/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // BUG REAL corregido: este sitemap incluía "/services/desktopSupport"
    // y "/services/webDevelopment" -- rutas que no existen en este
    // proyecto (leftover de una plantilla/negocio anterior). Un
    // sitemap con URLs que dan 404 es justo lo que Google penaliza al
    // rastrear el sitio, así que se quitaron. En su lugar se agregan
    // las 3 páginas legales reales (Términos, Privacidad, Cookies).
    {
      url: `${baseURL}/es/terms/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseURL}/en/terms/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseURL}/es/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseURL}/en/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseURL}/es/cookies/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseURL}/en/cookies/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...dynamicLinks,
  ];
}
