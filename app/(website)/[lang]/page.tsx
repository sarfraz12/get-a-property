import HomePage from "./home";
import { getAllPosts, getLandingData, getPostById, getFeaturedCategories } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { Suspense } from "react";
import Loading from "./loading";

export async function generateStaticParams() {
  const langs = ["en", "es"]; // Add your supported languages here
  const params = langs.map(lang => ({
    lang,
  }));
  return params;
}

// SEO de la home, tomado del grupo "SEO" de landingPage en Sanity
// (metaTitle, metaDescription, seoKeywords, ogImage, canonicalUrl,
// noIndex). A diferencia de layout.tsx -> sharedMetaData() (que sigue
// siendo la base para TODAS las páginas del sitio), esto es
// específico de la home: como esta función SÍ devuelve title/
// description/openGraph/twitter/robots, Next.js reemplaza esas claves
// puntuales -- el resto de lo que arma el layout (icons, authors,
// metadataBase, etc.) se sigue heredando igual (ver "Metadata
// merging" en los docs de Next.js). Cada campo tiene su propio
// respaldo (el mismo texto que ya usaba sharedMetaData) para que no
// haya ningún cambio visible mientras el campo no se cargue en Studio.
// Los defaults de SEO viven en lib/siteConfig.ts (perfil de marca de
// Get a Property), no hardcodeados acá.

export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const { lang } = params;
  const landingData = await getLandingData(lang);
  const landing = landingData?.[0];
  const profile = getSiteProfile(getSiteKey(landing));
  const BASE_URL = profile.baseUrl;

  const seoKeywords = landing?.seoKeywords || profile.defaultKeywords[lang as "es" | "en"] || profile.defaultKeywords.es;
  const metaTitle = landing?.metaTitle || profile.defaultTitle[lang as "es" | "en"] || profile.defaultTitle.es;
  const metaDescription =
    landing?.metaDescription || profile.defaultDescription[lang as "es" | "en"] || profile.defaultDescription.es;
  const ogImageSrc = landing?.ogImage ? urlForImage(landing.ogImage)?.src : `${BASE_URL}${profile.defaultOgImagePath}`;
  const canonical = landing?.canonicalUrl || `${BASE_URL}/${lang}`;

  return {
    // { absolute } evita que el template del layout padre
    // ("%s | " + nombre del sitio) vuelva a agregar el nombre acá --
    // metaTitle ya viene completo. Sin esto, el <title> quedaba
    // duplicado: "... | Get a Property | Get a Property".
    title: { absolute: metaTitle },
    description: metaDescription,
    keywords: seoKeywords,
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        "x-default": `${BASE_URL}/es`,
      },
    },
    // noIndex (Sanity, grupo SEO): interruptor para sacar la home de
    // los resultados de Google sin borrar contenido. Apagado = normal.
    robots: landing?.noIndex
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
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      siteName: profile.siteName,
      type: "website",
      locale: lang === "es" ? "es_PA" : "en_US",
      images: [{ url: ogImageSrc, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      ...(profile.twitterHandle ? { site: profile.twitterHandle } : {}),
      images: [ogImageSrc],
    },
  };
}

export default async function IndexPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const posts = await getAllPosts(params.lang);
  const data = await getLandingData(params.lang);
  const post = data?.[0]?.post?._ref ? await getPostById(data[0].post._ref, params.lang) : null;
  // Categorías elegidas a mano para la sección de categorías del
  // landing page (ver lib/sanity/schemas/category.js -> featured).
  const featuredCategories = await getFeaturedCategories(params.lang);

  return (
    <Suspense fallback={<Loading />}>
      <HomePage posts={posts} landingData={data} post={post} featuredCategories={featuredCategories} lang={params.lang} />
    </Suspense>
  );
}

// export const revalidate = 60;
