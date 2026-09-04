// app/(website)/[lang]/legal/[slug]/page.js
//
// Página dinámica para políticas/términos creados desde Sanity (ver
// lib/sanity/schemas/legalPage.js). Sigue el MISMO patrón que ya usa
// la página de un post (app/(website)/[lang]/[category]/post/[slug]/
// page.js): generateStaticParams a partir de todos los slugs reales,
// generateMetadata con SEO auto-armado (título/descripción/imagen
// reales del documento, con respaldo bilingüe si se dejan vacíos) +
// JSON-LD, y notFound() si el slug no existe. El body (rich text
// bilingüe) se renderiza con el mismo LegalPageLayout que ya usan las
// 3 páginas legales estáticas (Términos/Privacidad/Cookies), para que
// se vean como parte del mismo sitio -- ver ese componente para la
// prop nueva "body" (PortableText) que agrega esta sesión.
//
// IMPORTANTE: esto es ADITIVO, no reemplaza nada. Las 3 páginas legales
// estáticas de siempre (/terms, /privacy, /cookies) siguen intactas en
// sus propias URLs. Esta ruta (/legal/{slug}) es para políticas NUEVAS
// que se creen desde Sanity sin tocar código (ver lib/sanity/schemas/
// legalPage.js).
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Loading from "@/app/(website)/[lang]/loading";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { buildWebsiteId } from "@/lib/seo/jsonld";
import {
  getLegalPageBySlug,
  getAllLegalPageSlugs,
  getLandingData,
  getSettings,
} from "@/lib/sanity/client";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import { urlForOgImage } from "@/lib/sanity/image";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return await getAllLegalPageSlugs();
}

const FALLBACK_TITLE = { es: "Política", en: "Policy" };
const NOT_FOUND_COPY = {
  es: { title: "Página no encontrada", description: "La página que buscás no está disponible." },
  en: { title: "Page Not Found", description: "The page you are looking for is not available." },
};

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang, slug } = params;
  const [legalPage, landingData, settings] = await Promise.all([
    getLegalPageBySlug(slug, lang),
    getLandingData(lang),
    getSettings(),
  ]);
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const baseUrl = profile.baseUrl;

  if (!legalPage) {
    const nf = NOT_FOUND_COPY[lang] || NOT_FOUND_COPY.es;
    return {
      title: { absolute: `${nf.title} | ${profile.siteName}` },
      description: nf.description,
      icons: getFaviconIcons(settings),
    };
  }

  const canonical = legalPage.canonicalUrl || `${baseUrl}/${lang}/legal/${slug}`;

  // SEO editable desde Sanity (legalPage -> grupo "SEO", opcional): si
  // el editor cargó un metaTitle/metaDescription distinto, se usa ese;
  // si no, se arma automático a partir del título/descripción real del
  // documento -- nunca queda vacío.
  const pageTitle = legalPage.metaTitle || legalPage.title || FALLBACK_TITLE[lang] || FALLBACK_TITLE.es;
  const description =
    legalPage.metaDescription ||
    legalPage.description ||
    (lang === "es"
      ? `${pageTitle} de ${profile.organizationName}.`
      : `${pageTitle} of ${profile.organizationName}.`);
  const keywords = legalPage.seoKeywords || profile.defaultKeywords[lang] || profile.defaultKeywords.es;
  const image = legalPage.ogImage
    ? urlForOgImage(legalPage.ogImage)?.src
    : `${baseUrl}${profile.defaultOgImagePath}`;

  return {
    title: { absolute: `${pageTitle} | ${profile.siteName}` },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/legal/${slug}`,
        es: `${baseUrl}/es/legal/${slug}`,
        "x-default": `${baseUrl}/es/legal/${slug}`,
      },
    },
    keywords,
    openGraph: {
      title: pageTitle,
      description,
      type: "website",
      url: canonical,
      siteName: profile.siteName,
      locale: lang === "es" ? "es_PA" : "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
      // Honesto: sólo se manda "site" si de verdad hay un handle real
      // de Twitter/X (siteConfig.ts -- Get a Property no tiene uno
      // confirmado todavía, así que no se inventa).
      ...(profile.twitterHandle ? { site: profile.twitterHandle } : {}),
    },
    // noIndex (Sanity, legalPage -> SEO): interruptor para sacar esta
    // política de los resultados de Google sin despublicarla. Por
    // defecto index/follow (igual que Términos/Privacidad/Cookies --
    // tener estas páginas indexables es parte de lo que Google espera
    // de un sitio "de confianza").
    robots: legalPage.noIndex
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
    category: "Legal",
    generator: "Next.js 16 + Sanity CMS",
  };
}

// JSON-LD real (ver components/seo/JsonLd.jsx), mismo patrón que
// app/(website)/[lang]/terms/page.js -- referencia al WebSite sitewide
// por @id (lib/seo/jsonld.js) en vez de repetirlo.
async function buildLegalPageJsonLd(slug, lang) {
  const [legalPage, landingData] = await Promise.all([
    getLegalPageBySlug(slug, lang),
    getLandingData(lang),
  ]);
  if (!legalPage) return null;

  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const baseUrl = profile.baseUrl;
  const canonical = legalPage.canonicalUrl || `${baseUrl}/${lang}/legal/${slug}`;
  const pageTitle = legalPage.metaTitle || legalPage.title || FALLBACK_TITLE[lang] || FALLBACK_TITLE.es;
  const description = legalPage.metaDescription || legalPage.description || pageTitle;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description,
    url: canonical,
    inLanguage: lang === "es" ? "es" : "en",
    isPartOf: { "@id": buildWebsiteId(baseUrl) },
    ...(legalPage._updatedAt ? { dateModified: legalPage._updatedAt } : {}),
  };
}

export default async function LegalSlugPage(props) {
  const params = await props.params;
  const { lang, slug } = params;
  const legalPage = await getLegalPageBySlug(slug, lang);

  if (!legalPage) {
    notFound();
  }

  const jsonLd = await buildLegalPageJsonLd(slug, lang);
  const pageTitle = legalPage.title || FALLBACK_TITLE[lang] || FALLBACK_TITLE.es;

  // "Última actualización": la fecha que el editor eligió a mano
  // (campo "effectiveDate", opcional) si la cargó, si no la fecha real
  // del último guardado en Sanity (_updatedAt) -- nunca queda sin
  // fecha.
  const rawDate = legalPage.effectiveDate || legalPage._updatedAt;
  const dateLocale = lang === "es" ? es : undefined;
  const lastUpdatedLabel = rawDate
    ? (lang === "es"
        ? `Última actualización: ${format(parseISO(rawDate), "d 'de' MMMM 'de' yyyy", { locale: dateLocale })}`
        : `Last updated: ${format(parseISO(rawDate), "MMMM d, yyyy")}`)
    : undefined;

  return (
    <Suspense fallback={<Loading />}>
      <JsonLd data={jsonLd} />
      <LegalPageLayout
        h1={pageTitle}
        intro={legalPage.description}
        lastUpdatedLabel={lastUpdatedLabel}
        body={legalPage.body}
      />
    </Suspense>
  );
}
