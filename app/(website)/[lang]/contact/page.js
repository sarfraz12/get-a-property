import { getSettings, getLandingData, getContactPage } from "@/lib/sanity/client";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { urlForImage } from "@/lib/sanity/image";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import Contact from "./contact";
import { Suspense } from "react";
import Loading from "@/app/(website)/[lang]/loading";

// Copy de esta página (único negocio: Get a Property -- ver
// lib/siteConfig.ts para lo que se comparte entre páginas -- dominio,
// nombre, imágenes, redes).
const CONTACT_COPY = {
  "get-a-property": {
    es: {
      title: "Contacto | Bienes Raíces en Panamá | Get a Property",
      description:
        "Contáctanos y conoce más sobre Get a Property: nuestro catálogo de casas, apartamentos y terrenos en Panamá, y cómo podemos ayudarte a encontrar tu próxima propiedad.",
      keywords: "bienes raíces Panamá, contacto inmobiliaria, casas en venta, apartamentos en alquiler, Get a Property",
      ogAlt: "Contacto Get a Property Panamá",
      businessDescription: "Agencia de bienes raíces en Panamá: casas, apartamentos y terrenos en venta y alquiler.",
    },
    en: {
      title: "Contact | Real Estate in Panama | Get a Property",
      description:
        "Contact us and learn more about Get a Property: our catalog of houses, apartments, and land in Panama, and how we can help you find your next property.",
      keywords: "real estate Panama, real estate contact, houses for sale, apartments for rent, Get a Property",
      ogAlt: "Contact Get a Property Panama",
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


// ✅ Esta función define el <title>, <meta description> y <link rel="canonical">
export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const [landingData, contactPageData, settings] = await Promise.all([
    getLandingData(lang),
    getContactPage(lang),
    getSettings(),
  ]);
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const copy = CONTACT_COPY[siteKey][lang] || CONTACT_COPY[siteKey].es;
  const baseUrl = profile.baseUrl;
  // BUG REAL preexistente (no de esta sesión): esta canonical apuntaba
  // a "/about" en vez de "/contact" -- se deja corregido de paso, ya
  // que se está tocando esta misma línea para el override de Sanity.
  const canonical = contactPageData?.canonicalUrl || `${baseUrl}/${lang}/contact`;

  // SEO editable desde Sanity (documento contactPage -> grupo "SEO"):
  // cae de vuelta al texto de respaldo (CONTACT_COPY) si se deja
  // vacío o si el documento no existe todavía en Studio.
  const { ogAlt, businessDescription } = copy;
  const title = contactPageData?.metaTitle || copy.title;
  const description = contactPageData?.metaDescription || copy.description;
  const keywords = contactPageData?.seoKeywords || copy.keywords;
  const image = contactPageData?.ogImage
    ? urlForImage(contactPageData.ogImage)?.src
    : `${baseUrl}${profile.defaultOgImagePath}`;

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
      // TODO: sin teléfono/email de contacto real confirmados para
      // este contactPoint -- se omite en vez de inventar uno (ver
      // notas en lib/siteConfig.ts).
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
        en: `${baseUrl}/en/contact`,
        es: `${baseUrl}/es/contact`,
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
    // noIndex (Sanity, contactPage -> SEO): interruptor para sacar
    // esta página de los resultados de Google sin borrar contenido.
    robots: contactPageData?.noIndex
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


export default async function ContactPage(props) {
  const params = await props.params;
  const settings = await getSettings();
  return (
    <Suspense fallback={<Loading />}>
      <Contact settings={settings} lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
