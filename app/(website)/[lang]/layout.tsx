import "./globals.css";

import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Backlink } from "@/components/navigation/backlink";
import { Providers } from "./providers";
import CookieNotice from "@/components/legal/CookieNotice";
import { getSettings, getNavbarData, getFooterData, getLandingData } from "@/lib/sanity/client";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { urlForOgImage } from "@/lib/sanity/image";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
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
// demasiado -- pero se arma a partir de lib/siteConfig.ts (en vez de
// repetir el dominio como string suelto acá) para que exista un único
// lugar del código donde cambiar el dominio principal del sitio (ver
// el comentario de baseUrl en siteConfig.ts).
export const metadataBase = new URL(getSiteProfile(getSiteKey()).baseUrl);

// theme-color (color de la barra de navegación del navegador en
// móvil) usa la API de "viewport" en vez del campo "other" de
// metadata -- Next.js recomienda esto explícitamente (el theme-color
// dentro de "metadata" está deprecado). Antes había 3 valores
// distintos peleando por esto: uno fijo "#ffffff" hardcodeado en el
// <head>, y otro "#0b1220" en metadata.other -- acá queda uno solo,
// consciente de modo claro/oscuro (mismo criterio que el fix de
// tema del hero de esta misma sesión).
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

async function getSiteAndProfileData(lang: string) {
  const [settings, landingData] = await Promise.all([getSettings(), getLandingData(lang)]);
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const baseUrl = profile.baseUrl;
  const image = settings?.openGraphImage
    ? urlForOgImage(settings.openGraphImage)?.src
    : `${baseUrl}${profile.defaultOgImagePath}`;
  return { settings, profile, baseUrl, image };
}

export async function sharedMetaData(lang: string) {
  const { settings, profile, baseUrl, image } = await getSiteAndProfileData(lang);

  const title = settings?.title || profile.defaultTitle[lang as "es" | "en"] || profile.defaultTitle.es;

  const description =
    settings?.description || profile.defaultDescription[lang as "es" | "en"] || profile.defaultDescription.es;

  // Twitter/X: se prefiere el handle real cargado en Sanity
  // (settings.twitterHandle) -- profile.twitterHandle queda sólo como
  // respaldo por si algún día se define ahí en vez de en Sanity.
  const twitterHandle = settings?.twitterHandle || profile.twitterHandle;

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
        // "x-default": la versión a mostrar cuando el idioma del
        // visitante no matchea ninguna de las anteriores (ej.
        // visitante de Francia) -- Google recomienda declarar esto
        // explícitamente en sitios bilingües en vez de dejar que
        // adivine cuál mostrar.
        "x-default": `${baseUrl}/es`,
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
      ...(twitterHandle ? { site: twitterHandle } : {}),
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
    // Verificación de Google Search Console por "etiqueta HTML"
    // (Settings -> "Código de verificación de Google Search Console"
    // en Sanity). Si se deja vacío, Next simplemente no renderiza la
    // etiqueta -- no hace falta tocar código para conectar Search
    // Console, sólo pegar el código en Sanity.
    ...(settings?.googleSiteVerification
      ? { verification: { google: settings.googleSiteVerification } }
      : {}),
    icons: iconsMeta,
    category: "Real Estate",
    generator: "Next.js 16 + Sanity CMS",
    other: {
      "format-detection": "telephone=no",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": profile.appleMobileWebAppTitle,
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

  // Datos estructurados (JSON-LD) sitewide: Organization/RealEstateAgent
  // + WebSite, la MISMA data en cada página (se renderiza acá, en el
  // layout raíz, para no repetirla en cada página de contenido). Cada
  // página que necesite "hablar" del negocio referencia este mismo
  // @id (lib/seo/jsonld.js) en vez de declarar su propia copia.
  const { profile, baseUrl, image } = await getSiteAndProfileData(params.lang);
  const organizationJsonLd = buildOrganizationJsonLd({ settings, profile, baseUrl, image });
  const websiteJsonLd = buildWebsiteJsonLd({ baseUrl, siteName: profile.siteName, lang: params.lang });

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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Datos estructurados sitewide -- ver lib/seo/jsonld.js y
            components/seo/JsonLd.jsx para el porqué (Next.js's
            metadata.other NO genera <script> reales, sólo <meta>). */}
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
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
