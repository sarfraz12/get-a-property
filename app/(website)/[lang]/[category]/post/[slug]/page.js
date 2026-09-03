import PostPage from "./postHome";
import { Suspense } from "react";
import  Loading from "@/app/(website)/[lang]/loading";
import { urlForOgImage } from "@/lib/sanity/image";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";

import {
  getAllPostsSlugs,
  getPostBySlug,
  getTopCategories,
  getSettings,
} from "@/lib/sanity/client";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import { buildOrganizationId } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

// BUG REAL corregido: esta función generaba metadata (title/OG/
// Twitter/JSON-LD) 100% hardcodeada a "Gold Ghee" para TODOS los
// artículos del blog, sin importar el contenido real del post -- a
// diferencia del resto de páginas del sitio (aboutUs, contact,
// [category]), que ya usaban lib/siteConfig.ts para esto. Ahora usa
// el mismo perfil de marca (Get a Property) que el resto del sitio.
export async function generateMetadata(props) {
  const params = await props.params;
  const { lang, slug } = params;
  const profile = getSiteProfile(getSiteKey());
  const baseUrl = profile.baseUrl;
  const [post, settings] = await Promise.all([getPostBySlug(slug, lang), getSettings()]);

  if (!post) {
    return {
      title: lang === "es" ? "Artículo no encontrado | Get a Property" : "Article Not Found | Get a Property",
      description: lang === "es" ? "El artículo que buscas no está disponible." : "The article you are looking for is not available.",
      icons: getFaviconIcons(settings),
    };
  }

  const canonical = `${baseUrl}/${lang}/all/post/${slug}`;

  const keywords =
    post.seoKeywords ||
    (lang === "es"
      ? "bienes raíces Panamá, propiedades en Panamá, casas en venta, apartamentos en alquiler, Get a Property"
      : "real estate Panama, properties in Panama, houses for sale, apartments for rent, Get a Property");

  // SEO editable desde Sanity (post -> grupo "SEO", opcional): si el
  // vendedor cargó un metaTitle/metaDescription distinto, se usa ese;
  // si no, se sigue armando automático a partir del título/extracto
  // real del post, como ya hacía esta página (nada cambia mientras
  // esos campos se dejen vacíos).
  const title =
    post.metaTitle ||
    post.title ||
    (lang === "es" ? "Artículo del Blog | Get a Property" : "Blog Article | Get a Property");

  const description =
    post.metaDescription ||
    post.excerpt ||
    post.description ||
    (lang === "es"
      ? "Lee sobre nuestras propiedades y novedades del mercado inmobiliario en Panamá con Get a Property."
      : "Read about our properties and real estate market news in Panama with Get a Property.");

  const image = post.ogImage
    ? urlForOgImage(post.ogImage)?.src
    : (post.mainImage ? urlForOgImage(post?.mainImage)?.src : `${baseUrl}${profile.defaultOgImagePath}`);

  const datePublished = post?._createdAt;
  const dateModified = post?._updatedAt || post._createdAt;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),

    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/all/post/${slug}`,
        es: `${baseUrl}/es/all/post/${slug}`,
        "x-default": `${baseUrl}/es/all/post/${slug}`,
      },
    },

    keywords,

    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      siteName: profile.siteName,
      publishedTime: datePublished,
      modifiedTime: dateModified,
      locale: lang === "es" ? "es_PA" : "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.mainImage?.alt || (lang === "es" ? "Artículo del Blog Get a Property" : "Get a Property blog article"),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      // Honesto: sólo se manda "site" si de verdad hay un handle real
      // de Twitter/X (siteConfig.ts -- Get a Property no tiene uno
      // confirmado todavía, así que no se inventa).
      ...(profile.twitterHandle ? { site: profile.twitterHandle } : {}),
    },

    // noIndex (Sanity, post -> SEO): interruptor para sacar este
    // artículo de los resultados de Google sin despublicarlo.
    robots: post.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },

    icons: getFaviconIcons(settings),

    category: "Real Estate",
    generator: "Next.js 16 + Sanity CMS",
  };
}

// JSON-LD real (ver components/seo/JsonLd.jsx). "author"/"publisher"
// referencian la Organization sitewide por @id en vez de repetirla
// (lib/seo/jsonld.js) -- el logo real de Sanity (settings.logo) se
// resuelve una sola vez ahí, así que acá sólo hace falta el @id.
async function buildPostJsonLd(slug, lang) {
  const profile = getSiteProfile(getSiteKey());
  const baseUrl = profile.baseUrl;
  const post = await getPostBySlug(slug, lang);
  if (!post) return null;

  const canonical = `${baseUrl}/${lang}/all/post/${slug}`;
  const title =
    post.metaTitle ||
    post.title ||
    (lang === "es" ? "Artículo del Blog | Get a Property" : "Blog Article | Get a Property");
  const description =
    post.metaDescription ||
    post.excerpt ||
    post.description ||
    (lang === "es"
      ? "Lee sobre nuestras propiedades y novedades del mercado inmobiliario en Panamá con Get a Property."
      : "Read about our properties and real estate market news in Panama with Get a Property.");
  const image = post.ogImage
    ? urlForOgImage(post.ogImage)?.src
    : (post.mainImage ? urlForOgImage(post?.mainImage)?.src : `${baseUrl}${profile.defaultOgImagePath}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [image],
    datePublished: post?._createdAt,
    dateModified: post?._updatedAt || post._createdAt,
    author: { "@id": buildOrganizationId(baseUrl) },
    publisher: { "@id": buildOrganizationId(baseUrl) },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };
}


// export async function generateMetadata({ params }) {
//   const post = await getPostBySlug(params.slug, params.lang);
//   return { title: post.title };
// }

export default async function PostDefault(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug, params.lang);
  const categories = await getTopCategories(params.lang);
  const jsonLd = await buildPostJsonLd(params.slug, params.lang);

  return (
    <Suspense fallback={<Loading />}>
      <JsonLd data={jsonLd} />
      <PostPage post={post} categories={categories} lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
