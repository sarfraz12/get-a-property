import { getAllAuthors, getAboutPage, getLandingData, getSettings } from "@/lib/sanity/client";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { urlForImage } from "@/lib/sanity/image";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import About from "./about";
import { Suspense } from "react";
import  Loading from "@/app/(website)/[lang]/loading";

// Copy de esta página (único negocio: Get a Property -- ver
// lib/siteConfig.ts).
const ABOUT_COPY = {
  "get-a-property": {
    es: {
      title: "Sobre Nosotros | Bienes Raíces en Panamá | Get a Property",
      description:
        "Conoce a Get a Property: nuestro enfoque para ayudarte a encontrar casas, apartamentos y terrenos en Panamá, y por qué confiar en nosotros para tu próxima propiedad.",
      keywords: "bienes raíces Panamá, agencia inmobiliaria, sobre nosotros, Get a Property",
      ogAlt: "Sobre Get a Property Panamá",
      businessDescription: "Agencia de bienes raíces en Panamá: casas, apartamentos y terrenos en venta y alquiler.",
    },
    en: {
      title: "About Us | Real Estate in Panama | Get a Property",
      description:
        "Learn about Get a Property: our approach to helping you find houses, apartments, and land in Panama, and why you can trust us for your next property.",
      keywords: "real estate Panama, real estate agency, about us, Get a Property",
      ogAlt: "About Get a Property Panama",
      businessDescription: "Real estate agency in Panama: houses, apartments, and land for sale and rent.",
    },
  },
};

export async function generateStaticParams() {
  const langs = ["en", "es"]; // Add your supported languages here
  const params = langs.map(lang => ({
      lang,
  }));
  return params;
}

// ✅ This function defines <title>, <meta description>, canonical and hreflang for the About Us page

export async function generateMetadata({ params }) {
  const { lang } = params;
  const [landingData, aboutPageData, settings] = await Promise.all([
    getLandingData(lang),
    getAboutPage(lang),
    getSettings(),
  ]);
  // aboutPageData puede venir como array (allaboutpagequery trae
  // *todos* los documentos "aboutPage") -- en la práctica sólo
  // debería existir uno, así que se toma el primero, igual que hace
  // el resto de la página (ver AboutPage() más abajo).
  const aboutSeo = Array.isArray(aboutPageData) ? aboutPageData[0] : aboutPageData;
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const copy = ABOUT_COPY[siteKey][lang] || ABOUT_COPY[siteKey].es;
  const baseUrl = profile.baseUrl;
  const canonical = aboutSeo?.canonicalUrl || `${baseUrl}/${lang}/about`;

  // SEO editable desde Sanity (aboutPage -- grupo "SEO" del schema):
  // cada campo cae de vuelta al texto de respaldo (ABOUT_COPY) si se
  // deja vacío en Studio, así que nada cambia visualmente mientras no
  // se cargue contenido nuevo.
  const { ogAlt, businessDescription } = copy;
  const title = aboutSeo?.metaTitle || copy.title;
  const description = aboutSeo?.metaDescription || copy.description;
  const keywords = aboutSeo?.seoKeywords || copy.keywords;
  const image = aboutSeo?.ogImage ? urlForImage(aboutSeo.ogImage)?.src : `${baseUrl}${profile.defaultOgImagePath}`;

  // -------- JSON-LD for AboutPage + Brand/LocalBusiness -------
  const schemaLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: canonical,
    image,
    mainEntity: {
      "@type": "RealEstateAgent",
      name: profile.organizationName,
      url: baseUrl,
      image,
      description: businessDescription,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Panamá",
        addressCountry: "PA",
      },
      ...(profile.instagramUrl ? { sameAs: [profile.instagramUrl] } : {}),
    }
  };

  return {
    // { absolute } evita que el template del layout padre
    // ("%s | " + nombre del sitio) vuelva a agregar el nombre acá --
    // este título ya viene completo (ver COPY arriba). Sin esto, el
    // <title> quedaba duplicado: "... | Get a Property | Get a Property".
    title: { absolute: title },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/about`,
        es: `${baseUrl}/es/about`,
      },
    },
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: profile.siteName,
      locale: lang === "es" ? "es_PA" : "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(profile.twitterHandle ? { site: profile.twitterHandle } : {}),
      images: [image],
    },
    // noIndex (Sanity, aboutPage -> SEO): interruptor para sacar esta
    // página de los resultados de Google sin borrar contenido.
    robots: aboutSeo?.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    icons: getFaviconIcons(settings),
    category: "Real Estate",
    generator: "Next.js 14 + Sanity CMS",
    other: {
      "script:ld+json": JSON.stringify(schemaLd),
      "theme-color": "#0b1220",
      "format-detection": "telephone=no",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": profile.appleMobileWebAppTitle,
    },
  };
}


export default async function AboutPage({ params }) {
  const authors = await getAllAuthors(params.lang);
  const data = await getAboutPage(params.lang);


  return (
    <Suspense fallback={<Loading />}>
      <About data={data[0]} authors={authors} lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
