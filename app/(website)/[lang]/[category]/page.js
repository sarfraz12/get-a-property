import CategoryPosts from "./categoryPosts";
import Container from "@/components/generalUse/container";
import { getAllCategories, getPostsByCategory, getAllPosts, getAllCategoriesCount } from "@/lib/sanity/client";
import { Suspense } from "react";
import Loading from "@/app/(website)/[lang]/loading";

export async function generateStaticParams() {
  return await getAllCategories();
}

export async function generateMetadata({ params }) {
  const data = await getCategoryPosts(params.category, params.lang);

  const lang = params.lang;
  const baseUrl = "https://www.goldghee.com.pa";
  const canonical = `${baseUrl}/${lang}/${data?.title || "all"}`;

  const alternates = {
    canonical,
    languages: {
      en: `${baseUrl}/en/${data?.title || "all"}`,
      es: `${baseUrl}/es/${data?.title || "all"}`,
    },
  };

  const image = data.mainImage
    ? urlForImage(data?.mainImage)?.src
    : `${baseUrl}/images/asset-2.jpg`;

  const keywordsEs =
    "ghee, ghee premium, ghee Panamá, cocina saludable, ayurveda, mantequilla clarificada, bienestar natural, recetas saludables, productos naturales Panamá";
  const keywordsEn =
    "ghee, premium ghee, ghee Panama, healthy cooking, ayurveda, clarified butter, natural wellness, healthy recipes, natural products Panama";

  // JSON-LD optimizado para Gold Ghee
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": data?.title || (lang === "es" ? "Categoría del Blog" : "Blog Category"),
    "description":
      lang === "es"
        ? "Explora artículos sobre ghee, bienestar natural, cocina saludable, Ayurveda y estilos de vida sanos en el blog de Gold Ghee."
        : "Explore articles about ghee, natural wellness, healthy cooking, Ayurveda, and healthy lifestyle on the Gold Ghee blog.",
    "url": canonical,
    "image": image,
    "publisher": {
      "@type": "Organization",
      "name": "Gold Ghee",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`
      }
    },
    "inLanguage": lang === "es" ? "es" : "en",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (data?.posts || []).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/${lang}/all/post/${post.slug.current}`,
        "name": post.title
      }))
    }
  };

  return {
    title:
      lang === "es"
        ? (data?.title || "Blog de Ghee, Ayurveda y Bienestar | Gold Ghee Panamá")
        : (data?.title || "Ghee, Ayurveda & Wellness Blog | Gold Ghee Panama"),

    description:
      lang === "es"
        ? "Artículos sobre ghee, cocina saludable, bienestar natural y Ayurveda. Aprende a mejorar tu salud con productos naturales."
        : "Articles about ghee, healthy cooking, natural wellness, and Ayurveda. Learn how to improve your health with natural products.",

    metadataBase: new URL(baseUrl),
    alternates,
    keywords: lang === "es" ? keywordsEs : keywordsEn,

    openGraph: {
      title:
        lang === "es"
          ? "Blog de Ghee, Ayurveda y Bienestar | Gold Ghee"
          : "Ghee, Ayurveda & Wellness Blog | Gold Ghee",
      description:
        lang === "es"
          ? "Contenido sobre bienestar natural, Ayurveda, cocina saludable y beneficios del ghee."
          : "Content about natural wellness, Ayurveda, healthy cooking, and the benefits of ghee.",
      url: canonical,
      siteName: "Gold Ghee",
      locale: lang === "es" ? "es_PA" : "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Gold Ghee Blog",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title:
        lang === "es"
          ? "Blog de Bienestar y Ghee | Gold Ghee"
          : "Wellness & Ghee Blog | Gold Ghee",
      description:
        lang === "es"
          ? "Consejos de salud, recetas y beneficios del ghee para tu bienestar."
          : "Health tips, recipes and the benefits of ghee for your wellness.",
      images: [image],
      site: "@goldghee",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/appletouchicon.png",
    },

    category: "wellness",

    generator: "Next.js 14 + Sanity CMS",

    // JSON-LD insertado correctamente
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}


async function getCategoryPosts(category, lang) {

  const posts = (category === "all" ? await getAllPosts(lang) : await getPostsByCategory(category, lang));
  const title = category === "all" ? "ALL" : posts[0]?.categories.filter(
    e => e.slug.current === category)[0]?.title;
  return { title, posts };
}

// export async function generateMetadata({ params }) {
//   const data = await getCategoryPosts(params.category, params.lang);
//   return { title: data.title };
// }


export default async function SearchPage({ params }) {
  const data = await getCategoryPosts(params.category, params.lang);
  const categories = await getAllCategoriesCount(params.lang)
  const { title, posts } = data;


  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <CategoryPosts internalPosts={posts} title={title} categories={categories} lang={params.lang} />
      </Container>
    </Suspense>
  );
}

// export const revalidate = 60;