import { getSettings } from "@/lib/sanity/client";
import Contact from "./contact";
import { Suspense } from "react";
import Loading from "@/app/(website)/[lang]/loading";

export async function generateStaticParams() {
  const langs = ["en", "es"]; // Add your supported languages here
  const params = langs.map(lang => ({
    lang,
  }));
  return params;
}


// ✅ Esta función define el <title>, <meta description> y <link rel="canonical">
export async function generateMetadata({ params }) {
  const { lang } = params;
  const baseUrl = "https://www.goldgheepty.com.pa";
  const canonical = `${baseUrl}/${lang}/about`;

  const title =
    lang === "es"
      ? "Contacto | Ghee Artesanal y Orgánico en Panamá | Gold Ghee"
      : "Contact | Artisanal & Organic Ghee in Panama | Gold Ghee";

  const description =
    lang === "es"
      ? "Contáctanos y conoce la historia de Gold Ghee, nuestro proceso artesanal, nuestra filosofía saludable y el compromiso con ingredientes 100% naturales en Panamá."
      : "Contact us and discover the story of Gold Ghee, our artisanal process, our healthy living philosophy, and our commitment to 100% natural ingredients made in Panama.";

  const keywords =
    lang === "es"
      ? "ghee, ghee artesanal, ghee orgánico, Gold Ghee Panamá, mantequilla clarificada, vida saludable, productos naturales"
      : "ghee, artisanal ghee, organic ghee, Gold Ghee Panama, clarified butter, healthy living, natural products";

  const image = `${baseUrl}/images/ghee-banner.jpg`;

  // -------- JSON-LD for AboutPage + Brand/LocalBusiness -------
  const schemaLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: canonical,
    image,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Gold Ghee Panama",
      url: baseUrl,
      logo: `${baseUrl}/images/logo.jpg`,
      image: image,
      description: lang === "es"
        ? "Productores de ghee artesanal y orgánico en Panamá."
        : "Producers of artisanal and organic ghee in Panama.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Panamá",
        addressCountry: "PA",
      },
      sameAs: [
        "https://www.instagram.com/goldgheepty/",
        "https://www.facebook.com/people/Gold-Ghee/100063788131167/"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+507 6000-0000",
        contactType: "Customer Service",
        areaServed: "PA",
        availableLanguage: ["Spanish", "English"]
      }
    }
  };

  return {
    title,
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
      siteName: "Gold Ghee",
      locale: lang === "es" ? "es_PA" : "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt:
            lang === "es"
              ? "Contacto Gold Ghee Panamá"
              : "Contact Gold Ghee Panama",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@goldgheepty",
      images: [image],
    },
    robots: {
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
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon.ico",
    },
    category: "Food & Beverages",
    generator: "Next.js 14 + Sanity CMS",
    other: {
      "script:ld+json": JSON.stringify(schemaLd),
      "theme-color": "#fff7e6",
      "format-detection": "telephone=no",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": "Gold Ghee",
    },
  };
}


export default async function ContactPage({ params }) {
  const settings = await getSettings();
  return (
    <Suspense fallback={<Loading />}>
      <Contact settings={settings} lang={params.lang} />
    </Suspense>

  );
}

// export const revalidate = 60;
