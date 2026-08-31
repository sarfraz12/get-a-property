// app/(website)/[lang]/privacy/page.js
//
// Página legal "privacy" -- ver lib/legalContent.js para el texto
// bilingüe real (ya escrito a partir de la info pública del sitio:
// nombre, correo, teléfono y dirección del pie de página, y las
// integraciones reales que ya tiene el sitio -- Google Analytics/Tag
// Manager, y Facebook/Meta sólo vía Open Graph). Usa el mismo layout
// visual (Container + tipografía "prose") que ya usa la página
// "Nosotros" para su texto largo, así no se rompe ningún estilo del
// sitio.
import { Suspense } from "react";
import Loading from "@/app/(website)/[lang]/loading";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { PRIVACY_CONTENT, LAST_UPDATED } from "@/lib/legalContent";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { getLandingData, getSettings } from "@/lib/sanity/client";
import { getFaviconIcons } from "@/lib/sanity/favicon";

export async function generateStaticParams() {
  const langs = ["en", "es"];
  return langs.map(lang => ({ lang }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const [landingData, settings] = await Promise.all([getLandingData(lang), getSettings()]);
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const baseUrl = profile.baseUrl;
  const copy = PRIVACY_CONTENT[lang] || PRIVACY_CONTENT.es;
  const canonical = `${baseUrl}/${lang}/privacy`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.h1,
    description: copy.intro,
    url: canonical,
    inLanguage: lang === "es" ? "es" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: profile.siteName,
      url: baseUrl,
    },
  };

  return {
    title: { absolute: `${copy.h1} | ${profile.siteName}` },
    description: copy.intro,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/privacy`,
        es: `${baseUrl}/es/privacy`,
      },
    },
    openGraph: {
      title: copy.h1,
      description: copy.intro,
      url: canonical,
      siteName: profile.siteName,
      type: "website",
      locale: lang === "es" ? "es_PA" : "en_US",
    },
    // Páginas legales: index/follow igual que el resto del sitio (no
    // hay razón para ocultarlas de Google -- al contrario, tener
    // Términos/Privacidad/Cookies indexables es parte de lo que
    // Google espera de un sitio "de confianza").
    robots: { index: true, follow: true },
    icons: getFaviconIcons(settings),
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default async function PrivacyPage(props) {
  const params = await props.params;
  const { lang } = params;
  const copy = PRIVACY_CONTENT[lang] || PRIVACY_CONTENT.es;
  const lastUpdated = LAST_UPDATED[lang] || LAST_UPDATED.es;

  return (
    <Suspense fallback={<Loading />}>
      <LegalPageLayout
        h1={copy.h1}
        intro={copy.intro}
        lastUpdatedLabel={lastUpdated}
        sections={copy.sections}
      />
    </Suspense>
  );
}

// export const revalidate = 60;
