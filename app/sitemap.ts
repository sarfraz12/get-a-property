import { getAllPostsSlugs, getAllCategories } from '@/lib/sanity/client';
import { MetadataRoute } from 'next'

// Cada página bilingüe se agrega como DOS entradas (una por idioma),
// y cada una lleva "alternates.languages" apuntando a AMBAS versiones
// (incluida ella misma) + "x-default" -- así Google entiende que
// "/es/x" y "/en/x" son la MISMA página en dos idiomas (hreflang) en
// vez de tratarlas como contenido duplicado/no relacionado. Antes el
// sitemap listaba "/es/x" y "/en/x" como URLs sueltas sin ninguna
// relación declarada entre ellas.
function bilingualEntry(
  baseURL: string,
  path: string,
  opts: { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }
): MetadataRoute.Sitemap {
  const esUrl = `${baseURL}/es${path}`;
  const enUrl = `${baseURL}/en${path}`;
  const languages = { es: esUrl, en: enUrl, 'x-default': esUrl };

  return [
    { url: esUrl, lastModified: new Date(), alternates: { languages }, ...opts },
    { url: enUrl, lastModified: new Date(), alternates: { languages }, ...opts },
  ];
}

export default async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL as string;

  // Get Posts
  const posts = await getAllPostsSlugs() || [];

  const postLinks: MetadataRoute.Sitemap = posts?.flatMap(({ slug }: any) =>
    bilingualEntry(baseURL, `/all/post/${slug}`, { changeFrequency: 'yearly', priority: 0.7 })
  );

  // Get Categories
  const categories = await getAllCategories() || [];

  const categoryLinks: MetadataRoute.Sitemap = categories?.flatMap(({ category }: any) =>
    bilingualEntry(baseURL, `/${category}`, { changeFrequency: 'yearly', priority: 0.7 })
  );

  const dynamicLinks = [...postLinks, ...categoryLinks];

  return [
    ...bilingualEntry(baseURL, '/', { changeFrequency: 'yearly', priority: 1 }),
    ...bilingualEntry(baseURL, '/contact/', { changeFrequency: 'yearly', priority: 1 }),
    ...bilingualEntry(baseURL, '/aboutUs/', { changeFrequency: 'yearly', priority: 1 }),
    ...bilingualEntry(baseURL, '/search/', { changeFrequency: 'yearly', priority: 1 }),
    // BUG REAL corregido (ya arreglado en una sesión anterior): este
    // sitemap incluía "/services/desktopSupport" y
    // "/services/webDevelopment" -- rutas que no existen en este
    // proyecto (leftover de una plantilla/negocio anterior). En su
    // lugar están las 3 páginas legales reales.
    ...bilingualEntry(baseURL, '/terms/', { changeFrequency: 'yearly', priority: 0.3 }),
    ...bilingualEntry(baseURL, '/privacy/', { changeFrequency: 'yearly', priority: 0.3 }),
    ...bilingualEntry(baseURL, '/cookies/', { changeFrequency: 'yearly', priority: 0.3 }),
    ...dynamicLinks,
  ];
}
