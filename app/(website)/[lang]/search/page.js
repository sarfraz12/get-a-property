import Search from "./search";
import { Suspense } from "react";
import  Loading from "@/app/(website)/[lang]/loading";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { getSearchPage, getSettings } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { getFaviconIcons } from "@/lib/sanity/favicon";

export async function generateStaticParams() {
  const langs = ["en", "es"]; // Add your supported languages here
  const params = langs.map(lang => ({
      lang,
  }));
  return params;
}

// BUG REAL corregido: esta función generaba metadata (title/OG/
// Twitter/JSON-LD) 100% hardcodeada a "GoldGhee" para la página de
// búsqueda -- a diferencia del resto de páginas del sitio, que ya
// usaban lib/siteConfig.ts para esto. Ahora usa el mismo perfil de
// marca (Get a Property) que el resto del sitio.
export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const profile = getSiteProfile(getSiteKey());
  const baseUrl = profile.baseUrl;
  const [searchPageData, settings] = await Promise.all([getSearchPage(lang), getSettings()]);
  const canonical = searchPageData?.canonicalUrl || `${baseUrl}/${lang}/search`;

  const alternates = {
    canonical,
    languages: {
      en: `${baseUrl}/en/search`,
      es: `${baseUrl}/es/search`,
      "x-default": `${baseUrl}/es/search`,
    },
  };

  // SEO editable desde Sanity (documento searchPage -> grupo "SEO"):
  // cae de vuelta al texto de respaldo bilingüe de siempre si se deja
  // vacío o si el documento no existe todavía en Studio.
  const fallbackTitle =
    lang === "es"
      ? "Buscar | Encuentra Propiedades y Artículos | Get a Property"
      : "Search | Find Properties and Articles | Get a Property";

  const fallbackDescription =
    lang === "es"
      ? "Encuentra rápidamente casas, apartamentos, terrenos y artículos del blog de Get a Property usando nuestro buscador."
      : "Quickly find houses, apartments, land, and Get a Property blog articles using our search tool.";

  const fallbackKeywords =
    lang === "es"
      ? "bienes raíces Panamá, casas en venta, apartamentos en alquiler, terrenos en venta, búsqueda, Get a Property"
      : "real estate Panama, houses for sale, apartments for rent, land for sale, search, Get a Property";

  const title = searchPageData?.metaTitle || fallbackTitle;
  const description = searchPageData?.metaDescription || fallbackDescription;
  const keywords = searchPageData?.seoKeywords || fallbackKeywords;
  const ogImageSrc = searchPageData?.ogImage
    ? urlForImage(searchPageData.ogImage)?.src
    : `${baseUrl}${profile.defaultOgImagePath}`;

  // El JSON-LD "WebSite" + SearchAction (para el sitelinks search box
  // de Google) ya se emite sitewide desde el layout raíz
  // (app/(website)/[lang]/layout.tsx -> lib/seo/jsonld.js), así que no
  // hace falta repetirlo acá -- antes este bloque ni siquiera
  // funcionaba (ver nota en other.script más abajo, ahora eliminado).

  return {
    // { absolute } evita que el template del layout padre ("%s | " +
    // nombre del sitio) vuelva a agregar el nombre acá -- "title" ya
    // viene completo. BUG REAL preexistente corregido: sin esto el
    // <title> quedaba duplicado: "... | Get a Property | Get a Property".
    title: { absolute: title },
    description,
    metadataBase: new URL(baseUrl),
    alternates,
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: lang === "es" ? "es_PA" : "en_US",
      siteName: profile.siteName,
      images: [
        {
          url: ogImageSrc,
          width: 1200,
          height: 630,
          alt:
            lang === "es"
              ? "Get a Property - Buscar propiedades y contenido"
              : "Get a Property - Search properties and content",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // Honesto: sólo se manda "site" si de verdad hay un handle real
      // de Twitter/X (siteConfig.ts -- Get a Property no tiene uno
      // confirmado todavía, así que no se inventa).
      ...(profile.twitterHandle ? { site: profile.twitterHandle } : {}),
      images: [ogImageSrc],
    },
    // noIndex (Sanity, searchPage -> SEO): interruptor para sacar esta
    // página de los resultados de Google sin borrar contenido.
    robots: searchPageData?.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
        },
    icons: getFaviconIcons(settings),
  };
}


export default async function SearchPage(props) {
  const params = await props.params;
  return (
    <Suspense fallback={<Loading />}>
      <Search lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
