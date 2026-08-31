import "./globals.css";

import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Backlink } from "@/components/navigation/backlink";
import { Providers } from "./providers";
import CookieNotice from "@/components/legal/CookieNotice";
import { getSettings, getNavbarData, getFooterData, getLandingData } from "@/lib/sanity/client";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { urlForImage } from "@/lib/sanity/image";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import { Suspense } from "react";
import Loading from "./loading";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
// fonts
import { Poppins } from "next/font/google";
import { cx } from "@/utils/all";

// Poppins: geométrica redondeada, varios pesos para poder usar
// font-semibold / font-bold / font-extrabold en todo el sitio igual
// que en la referencia (títulos muy bold, texto normal en 400-500).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});


// Next sólo usa metadataBase para resolver URLs relativas de imágenes
// cuando openGraph.url ya es absoluta (como acá), así que no importa
// demasiado -- se deja apuntando al dominio de Get a Property.
export const metadataBase = new URL("https://www.getaproperty.com.pa");

export async function sharedMetaData(lang: string) {
  const [settings, landingData] = await Promise.all([getSettings(), getLandingData(lang)]);
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const baseUrl = profile.baseUrl;

  const title = settings?.title || profile.defaultTitle[lang as "es" | "en"] || profile.defaultTitle.es;

  const description =
    settings?.description || profile.defaultDescription[lang as "es" | "en"] || profile.defaultDescription.es;

  const image = settings?.openGraphImage
    ? urlForImage(settings.openGraphImage)?.src
    : `${baseUrl}${profile.defaultOgImagePath}`;

  const sameAs = [profile.instagramUrl].filter(Boolean) as string[];

  // Favicon claro/oscuro (Settings -> fieldset "Favicon"): se arma
  // acá con la misma función que ahora usan TODAS las páginas del
  // sitio (ver lib/sanity/favicon.js) -- antes esta lógica vivía sólo
  // acá, y cada página de contenido tenía su propio favicon fijo que
  // pisaba éste.
  const iconsMeta = getFaviconIcons(settings);

  return {
    metadataBase,
    title: {
      default: title,
      template: profile.titleTemplate,
    },
    description,
    keywords: profile.defaultKeywords[lang as "es" | "en"] || profile.defaultKeywords.es,
    authors: [{ name: profile.organizationName }],
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: profile.siteName,
      type: "website",
      locale: lang === "es" ? "es_PA" : "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: profile.organizationName,
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
    icons: iconsMeta,
    category: "Real Estate",
    generator: "Next.js 14 + Sanity CMS",
    other: {
      "theme-color": "#0b1220",
      "format-detection": "telephone=no",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": profile.appleMobileWebAppTitle,
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: profile.organizationName,
        url: baseUrl,
        image,
        description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Panamá",
          addressCountry: "PA",
        },
        // TODO: número de teléfono real -- no lo tengo para ninguno de
        // los dos sitios, se deja sin inventar en vez de un placeholder
        // falso (a diferencia de un número inventado, omitir el campo
        // no genera datos incorrectos en el JSON-LD).
        ...(sameAs.length ? { sameAs } : {}),
      }),
    },
  };
}

// BUG preexistente que este cambio dejó al descubierto: esta función
// tomaba el primer argumento como si fuera directamente "{ lang }",
// pero Next.js en realidad llama a generateMetadata con
// "{ params, searchParams }" -- entonces "params.lang" siempre fue
// undefined acá adentro. Antes no se notaba porque sharedMetaData()
// solo usaba lang para ternarios de texto (con respaldo en español),
// nunca para consultar Sanity. Ahora que sharedMetaData() sí llama a
// getLandingData(lang) para saber a cuál sitio pertenece la página,
// un lang=undefined rompe la consulta GROQ ("Unable to parse value of
// $lang=undefined"). Se corrige desestructurando "params" del objeto
// real que entrega Next.
export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  return await sharedMetaData(params.lang);
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }>
) {
  const params = await props.params;

  const {
    children
  } = props;

  const settings = await getSettings();
  const navData = await getNavbarData(params.lang);
  const footData = await getFooterData(params.lang);

  return (
    <html
      suppressHydrationWarning
      lang={params.lang}
      className={poppins.variable}
    >
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T2XGGLLP');`}
        </Script>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/appletouchicon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        

      </head>
      <body className={cx("font-sans","bg-white text-black dark:bg-black dark:text-white")} >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T2XGGLLP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SM5ZZYG685"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SM5ZZYG685');
            `,
          }}
        ></script>

        <Analytics />

        <Providers>
          <Navbar lang={params.lang} {...settings} data={navData}/>
          <Suspense fallback={<Loading />}>
            {children}
            <Backlink linkValue={settings.url} />
          </Suspense>
          <Footer lang={params.lang} data={footData} {...settings} />
          <CookieNotice lang={params.lang} />
        </Providers>
      </body>
    </html>
  );
}

