import CategoryPosts from "./categoryPosts";
import Container from "@/components/generalUse/container";
import {
  getAllCategories,
  getPostsByCategory,
  getAllPosts,
  getAllCategoriesCount,
  getLandingData,
  getCategoryBySlug,
  getSettings,
} from "@/lib/sanity/client";
import { getSiteKey } from "@/lib/siteContext";
import { getSiteProfile } from "@/lib/siteConfig";
import { urlForImage } from "@/lib/sanity/image";
import { getFaviconIcons } from "@/lib/sanity/favicon";
import { buildOrganizationId } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { Suspense } from "react";
import Loading from "@/app/(website)/[lang]/loading";

export async function generateStaticParams() {
  return await getAllCategories();
}

// Copy bilingüe del listado (único negocio: Get a Property).
const LISTING_COPY = {
  "get-a-property": {
    es: {
      description:
        "Explora casas, apartamentos, terrenos y propiedades disponibles en Panamá, organizadas por ubicación, tipo y tipo de oferta.",
      ogDescription: "Catálogo de propiedades de Get a Property: casas, apartamentos y terrenos en Panamá.",
      twitterDescription: "Casas, apartamentos y terrenos en venta y alquiler en Panamá.",
      jsonLdDescription:
        "Explora el catálogo de propiedades de Get a Property: casas, apartamentos, terrenos y más, disponibles en Panamá.",
      fallbackTitle: "Propiedades en Panamá | Get a Property",
      ogAlt: "Catálogo de propiedades Get a Property",
      category: "Real Estate",
    },
    en: {
      description:
        "Explore houses, apartments, land, and properties available in Panama, organized by location, property type and offer type.",
      ogDescription: "Get a Property's catalog: houses, apartments, and land in Panama.",
      twitterDescription: "Houses, apartments, and land for sale and rent in Panama.",
      jsonLdDescription:
        "Explore Get a Property's catalog: houses, apartments, land and more, available in Panama.",
      fallbackTitle: "Properties in Panama | Get a Property",
      ogAlt: "Get a Property listings catalog",
      category: "Real Estate",
    },
  },
};

export async function generateMetadata(props) {
  const params = await props.params;
  const [data, landingData, categorySeo, settings] = await Promise.all([
    getCategoryPosts(params.category, params.lang),
    getLandingData(params.lang),
    // "all" no es una categoría real en Sanity (es el listado
    // completo) -- se evita la consulta para ese caso.
    params.category === "all" ? null : getCategoryBySlug(params.category, params.lang),
    getSettings(),
  ]);

  const lang = params.lang;
  const siteKey = getSiteKey(landingData?.[0]);
  const profile = getSiteProfile(siteKey);
  const copy = LISTING_COPY[siteKey][lang] || LISTING_COPY[siteKey].es;
  const baseUrl = profile.baseUrl;
  // BUG REAL preexistente corregido: cuando category==="all",
  // data.title vale el string literal "ALL" (mayúsculas, ver
  // getCategoryPosts() más abajo) -- eso hacía que la canonical/
  // hreflang/JSON-LD de esta página apuntaran a "/ALL" en vez de la
  // URL real y minúscula "/all" que usa el resto del sitio (navbar,
  // footer, links internos). "/ALL" ni siquiera es una ruta válida
  // (category es case-sensitive), así que Google indexaba una
  // canonical rota. urlSlug usa siempre el segmento real de la URL.
  const urlSlug = data?.title && data.title !== "ALL" ? data.title : "all";
  const canonical = `${baseUrl}/${lang}/${urlSlug}`;

  const alternates = {
    canonical,
    languages: {
      en: `${baseUrl}/en/${urlSlug}`,
      es: `${baseUrl}/es/${urlSlug}`,
      "x-default": `${baseUrl}/es/${urlSlug}`,
    },
  };

  const image = data.mainImage ? urlForImage(data?.mainImage)?.src : `${baseUrl}${profile.defaultOgImagePath}`;

  // SEO editable desde Sanity (category -> grupo "SEO", opcional):
  // si el vendedor cargó un metaTitle/metaDescription distinto para
  // esta categoría, se usa ese; si no, se sigue armando automático a
  // partir del nombre real de la categoría, como ya hacía esta
  // página.
  const title =
    categorySeo?.metaTitle ||
    (data?.title && data.title !== "ALL" ? `${data.title} | ${profile.siteName}` : copy.fallbackTitle);
  const metaDescription = categorySeo?.metaDescription || copy.description;

  return {
    // { absolute } evita que el template del layout padre ("%s | " +
    // nombre del sitio) vuelva a agregar el nombre acá -- "title" ya
    // viene completo. Sin esto, el <title> quedaba duplicado: "... |
    // Get a Property | Get a Property".
    title: { absolute: title },
    description: metaDescription,
    metadataBase: new URL(baseUrl),
    alternates,
    keywords: profile.defaultKeywords[lang] || profile.defaultKeywords.es,

    openGraph: {
      title,
      description: copy.ogDescription,
      url: canonical,
      siteName: profile.siteName,
      locale: lang === "es" ? "es_PA" : "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: copy.ogAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: copy.twitterDescription,
      images: [image],
      // Honesto: sólo se manda "site" si de verdad hay un handle real
      // de Twitter/X para este negocio (siteConfig.ts -- Get a Property
      // no tiene uno confirmado todavía, así que no se inventa).
      ...(profile.twitterHandle ? { site: profile.twitterHandle } : {}),
    },

    // noIndex (Sanity, category -> SEO): interruptor para sacar esta
    // categoría de los resultados de Google sin ocultarla del sitio.
    robots: categorySeo?.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
          },
        },

    icons: getFaviconIcons(settings),

    category: copy.category,

    generator: "Next.js 16 + Sanity CMS",
  };
}

// JSON-LD real (ver components/seo/JsonLd.jsx). "publisher" referencia
// la Organization sitewide por @id en vez de repetirla (lib/seo/jsonld.js).
async function buildCategoryJsonLd(categorySlug, lang) {
  const [data, categorySeo] = await Promise.all([
    getCategoryPosts(categorySlug, lang),
    categorySlug === "all" ? null : getCategoryBySlug(categorySlug, lang),
  ]);
  const profile = getSiteProfile(getSiteKey());
  const baseUrl = profile.baseUrl;
  const copy = LISTING_COPY["get-a-property"][lang] || LISTING_COPY["get-a-property"].es;
  const urlSlug = data?.title && data.title !== "ALL" ? data.title : "all";
  const canonical = `${baseUrl}/${lang}/${urlSlug}`;
  const image = data.mainImage ? urlForImage(data?.mainImage)?.src : `${baseUrl}${profile.defaultOgImagePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": data?.title && data.title !== "ALL" ? data.title : (lang === "es" ? "Categoría" : "Category"),
    "description": categorySeo?.metaDescription || copy.jsonLdDescription,
    "url": canonical,
    "image": image,
    "publisher": { "@id": buildOrganizationId(baseUrl) },
    "inLanguage": lang === "es" ? "es" : "en",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (data?.posts || []).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/${lang}/all/post/${post.slug.current}`,
        "name": post.title,
      })),
    },
  };
}

async function getCategoryPosts(category, lang) {
  const posts = (category === "all" ? await getAllPosts(lang) : await getPostsByCategory(category, lang));
  const title = category === "all" ? "ALL" : posts[0]?.categories.filter(
    e => e.slug.current === category)[0]?.title;
  return { title, posts };
}

export default async function SearchPage(props) {
  const params = await props.params;
  const data = await getCategoryPosts(params.category, params.lang);
  const categories = await getAllCategoriesCount(params.lang)
  const { title, posts } = data;
  const jsonLd = await buildCategoryJsonLd(params.category, params.lang);

  return (
    <Suspense fallback={<Loading />}>
      <JsonLd data={jsonLd} />
      <Container>
        <CategoryPosts internalPosts={posts} title={title} categories={categories} lang={params.lang} />
      </Container>
    </Suspense>
  );
}

// export const revalidate = 60;
