import Search from "./search";
import { Suspense } from "react";
import  Loading from "@/app/(website)/[lang]/loading";

export async function generateStaticParams() {
  const langs = ["en", "es"]; // Add your supported languages here
  const params = langs.map(lang => ({
      lang,
  }));
  return params;
}

export async function generateMetadata({ params }) {
  const { lang } = params;
  const baseUrl = "https://www.goldghee.com";
  const canonical = `${baseUrl}/${lang}/search`;

  const alternates = {
    canonical,
    languages: {
      en: `${baseUrl}/en/search`,
      es: `${baseUrl}/es/search`,
    },
  };

  const title =
    lang === "es"
      ? "Buscar | Encuentra Productos y Artículos | GoldGhee"
      : "Search | Find Products and Articles | GoldGhee";

  const description =
    lang === "es"
      ? "Encuentra rápidamente productos, recetas, beneficios del ghee y contenido especializado de GoldGhee usando nuestro buscador."
      : "Quickly find products, recipes, ghee benefits, and GoldGhee specialty content using our search tool.";

  const keywords =
    lang === "es"
      ? "ghee, goldghee, mantequilla clarificada, productos naturales, recetas con ghee, beneficios del ghee, saludable, búsqueda"
      : "ghee, goldghee, clarified butter, natural products, ghee recipes, ghee benefits, healthy, search";

  // JSON-LD SearchAction (Google rich results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    name: "GoldGhee",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${lang}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates,
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: lang === "es" ? "es_ES" : "en_US",
      siteName: "GoldGhee",
      images: [
        {
          url: `${baseUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt:
            lang === "es"
              ? "GoldGhee - Buscar productos y contenido"
              : "GoldGhee - Search products and content",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@goldghee",
      images: [`${baseUrl}/images/og-default.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    other: {
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify(jsonLd),
        },
      ],
    },
  };
}


export default async function SearchPage({ params }) {
  return (
    <Suspense fallback={<Loading />}>
      <Search lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
