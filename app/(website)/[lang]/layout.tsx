import "./globals.css";

import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Backlink } from "@/components/navigation/backlink";
import { Providers } from "./providers";
import { getSettings, getNavbarData, getFooterData } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { Suspense } from "react";
import Loading from "./loading";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
// fonts
import localFont from "next/font/local";
import { cx } from "@/utils/all";

// declare local fonts
const garet = localFont({
  src: [
    {
      path: "../../../public/fonts/garet/Garet-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/garet/Garet-Heavy.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-garet",
});


export const metadataBase = new URL("https://www.goldgheepty.com.pa");

export async function sharedMetaData(lang: string) {
  const settings = await getSettings();
  const baseUrl = "https://www.goldgheepty.com.pa"; // ✅ your new domain

  const title =
    lang === "es"
      ? settings?.title || "Gold Ghee | Ghee Artesanal y Orgánico en Panamá"
      : settings?.title || "Gold Ghee | Artisanal & Organic Ghee in Panama";

  const description =
    lang === "es"
      ? settings?.description ||
        "Descubre Gold Ghee, el ghee artesanal y orgánico elaborado en Panamá. Ideal para una vida saludable, cocina gourmet y nutrición consciente."
      : settings?.description ||
        "Discover Gold Ghee, artisanal and organic ghee made in Panama. Perfect for healthy living, gourmet cooking, and mindful nutrition.";

  const image = settings?.openGraphImage
    ? urlForImage(settings.openGraphImage)?.src
    : `${baseUrl}/images/ghee-banner.jpg`; // ✅ update with your ghee image

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | Gold Ghee`,
    },
    description,
    keywords:
      lang === "es"
        ? "ghee, ghee artesanal, ghee orgánico, mantequilla clarificada, Panamá, vida saludable, Gold Ghee"
        : "ghee, artisanal ghee, organic ghee, clarified butter, Panama, healthy living, Gold Ghee",
    authors: [{ name: "Gold Ghee Panama" }],
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
      siteName: "Gold Ghee",
      type: "website",
      locale: lang === "es" ? "es_PA" : "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Gold Ghee Panama",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@goldgheepty", // ✅ update if you create Twitter
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
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    category: "Food & Beverages",
    generator: "Next.js 14 + Sanity CMS",
    other: {
      "theme-color": "#fff7e6", // warm goldish theme
      "format-detection": "telephone=no",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": "Gold Ghee",
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Gold Ghee",
        url: baseUrl,
        logo: `${baseUrl}/images/logo.jpg`, // ✅ your logo
        image: `${baseUrl}/images/ghee-banner.jpg`,
        description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Panamá",
          addressCountry: "PA",
        },
        telephone: "+507 6000-0000", // ✅ update
        sameAs: [
          "https://www.instagram.com/goldgheepty/",
          "https://www.facebook.com/people/Gold-Ghee/100063788131167/", // if available
        ],
      }),
    },
  };
}

export async function generateMetadata(params: { lang: string }) {
  return await sharedMetaData(params.lang);
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const settings = await getSettings();
  const navData = await getNavbarData(params.lang);
  const footData = await getFooterData(params.lang);

  return (
    <html
      suppressHydrationWarning
      lang={params.lang}
      className={garet.variable}
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/appletouchicon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        

      </head>
      <body className={cx("font-sans","dark:bg-brand-dark bg-brand text-brand-black dark:text-brand-light")} >
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
          <Navbar lang={params.lang} {...settings} data={navData} />
          <Suspense fallback={<Loading />}>
            {children}
            <Backlink linkValue={settings.url} />
          </Suspense>
          <Footer lang={params.lang} data={footData} {...settings} />
        </Providers>
      </body>
    </html>
  );
}

