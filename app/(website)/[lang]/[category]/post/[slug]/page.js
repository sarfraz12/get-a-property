import PostPage from "./postHome";
import { Suspense } from "react";
import  Loading from "@/app/(website)/[lang]/loading";
import { urlForImage } from "@/lib/sanity/image";

import {
  getAllPostsSlugs,
  getPostBySlug,
  getTopCategories,
} from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const { lang, slug } = params;
  const baseUrl = "https://www.goldghee.com.pa";
  const post = await getPostBySlug(slug, lang);

  if (!post) {
    return {
      title: lang === "es" ? "Artículo no encontrado | Gold Ghee" : "Article Not Found | Gold Ghee",
      description: lang === "es" ? "El artículo que buscas no está disponible." : "The article you are looking for is not available.",
    };
  }

  const canonical = `${baseUrl}/${lang}/all/post/${slug}`;

  const keywords =
    post.keywords?.join(", ") ||
    (lang === "es"
      ? "ghee, ghee Panamá, ayurveda, cocina saludable, bienestar natural, recetas con ghee"
      : "ghee, ghee Panama, ayurveda, healthy cooking, natural wellness, ghee recipes");

  const title =
    post.title ||
    (lang === "es" ? "Artículo del Blog | Gold Ghee" : "Blog Article | Gold Ghee");

  const description =
    post.excerpt ||
    post.description ||
    (lang === "es"
      ? "Lee artículos sobre ghee, bienestar natural, ayurveda y cocina saludable en Gold Ghee."
      : "Read articles about ghee, natural wellness, Ayurveda, and healthy cooking at Gold Ghee.");

  const image = post.mainImage
    ? urlForImage(post?.mainImage)?.src
    : `${baseUrl}/images/asset-2.jpg`;

  const datePublished = post?._createdAt;
  const dateModified = post?._updatedAt || post._createdAt;

  // JSON-LD optimizado para artículo de Gold Ghee
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: [image],
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: "Gold Ghee",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Gold Ghee",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    // Opcional, si quieres incluir contacto físico
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ciudad de Panamá",
      addressLocality: "Panamá",
      addressRegion: "PA",
      addressCountry: "PA",
    },
    telephone: "+507 6000-0000",
  };

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),

    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/all/post/${slug}`,
        es: `${baseUrl}/es/all/post/${slug}`,
      },
    },

    keywords,

    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      siteName: "Gold Ghee",
      publishedTime: datePublished,
      modifiedTime: dateModified,
      locale: lang === "es" ? "es_PA" : "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.mainImage?.alt || "Artículo del Blog Gold Ghee",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: "@goldghee",
    },

    robots: {
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

    icons: {
      icon: "/favicon.ico",
      apple: "/appletouchicon.png",
    },

    category: "wellness",
    generator: "Next.js 14 + Sanity CMS",

    other: {
      "script:ld+json": JSON.stringify(structuredData),
    },
  };
}


// export async function generateMetadata({ params }) {
//   const post = await getPostBySlug(params.slug, params.lang);
//   return { title: post.title };
// }

export default async function PostDefault({ params }) {
  const post = await getPostBySlug(params.slug, params.lang);
  const categories = await getTopCategories(params.lang);

  return (
    <Suspense fallback={<Loading />}>
      <PostPage post={post} categories={categories} lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
