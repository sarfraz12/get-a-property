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
    {
      url: `${baseURL}/es/services/desktopSupport`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/en/services/desktopSupport`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
       {
      url: `${baseURL}/es/services/webDevelopment`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseURL}/en/services/webDevelopment`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...dynamicLinks,
  ];
}
