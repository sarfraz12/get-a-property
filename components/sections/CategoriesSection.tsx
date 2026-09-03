// components/sections/CategoriesSection.tsx
//
// Sección "explora por categoría" del landing page. Antes armaba la
// lista sola a partir de los posts ya cargados en la Home (categorías
// únicas + foto del post más reciente de cada una); ahora usa
// categorías elegidas A MANO por el editor en Sanity (campo
// "featured" en category.js) y la imagen PROPIA de cada categoría
// (campo "featuredImage"), en vez de la foto de un post cualquiera.
// Así el editor controla exactamente qué categorías destacar y con
// qué foto, sin depender de qué post se publicó más recientemente.
//
// También se mejoró la tarjeta para que se lea como una tarjeta de
// CATEGORÍA de verdad (insignia del tipo de filtro -- Ubicación /
// Propiedad / Oferta -- + conteo de publicaciones + descripción),
// no como una tarjeta de post genérica.
"use client";

import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity/image";
import { FILTER_GROUP_META, getCategorySlug, type CategoryType, type FilterGroupKey } from "@/lib/categoryFilters";

interface Category {
  _id?: string;
  title?: string;
  slug?: { current: string } | string;
  color?: string;
  description?: string;
  featuredImage?: any;
  categoryType?: CategoryType | null;
  count?: number;
}

interface CategoriesSectionProps {
  categories?: Category[];
  lang: string;
  limit?: number;
  title?: string;
  description?: string;
}

const COPY: Record<string, { title: string; description: string; posts: string }> = {
  es: {
    title: "Explora por categoría",
    description: "Recorré nuestro catálogo organizado como más te sirva.",
    posts: "publicaciones",
  },
  en: {
    title: "Explore by category",
    description: "Browse our catalog organized however's most useful to you.",
    posts: "posts",
  },
};

export default function CategoriesSection({ categories, lang, limit = 3, title, description }: CategoriesSectionProps) {
  const copy = COPY[lang] || COPY.en;
  const items = (categories || []).slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      {/* Encabezado centrado */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl">{title ?? copy.title}</h2>
        <p className="mt-4 text-black/50">{description ?? copy.description}</p>
      </div>

      {/* Tarjetas de categoría.
          CORRECCIÓN mobile (queja del cliente: "cada card es muy
          grande y estan una debajo de la otra, prefiero...3 tarjetas
          por fila cuando sea mobile"): antes esto era grid-cols-1 en
          mobile (1 tarjeta gigante por fila). Ahora son 3 columnas
          desde el celular más chico -- el breakpoint "sm" (tablet)
          sigue en 2 columnas y "lg" (escritorio) en 3, exactamente
          como antes; sólo cambió el caso mobile (<640px). El gap y el
          contenido de cada tarjeta también se achican en mobile (ver
          más abajo) para que 3 por fila se sigan leyendo bien. */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {items.map((category) => {
          const slug = getCategorySlug(category);
          // Si el editor todavía no cargó una "Imagen destacada" para
          // esta categoría, se usa una foto genérica del sitio en vez
          // de dejar la tarjeta sin fondo.
          const image = category.featuredImage ? urlForImage(category.featuredImage) : null;
          const imageSrc = image?.src || "/images/placeholder-hero-2.jpg";
          const categoryTitle = category.title || (lang === "en" ? "Category" : "Categoría");
          const groupMeta =
            category.categoryType && category.categoryType !== "general"
              ? FILTER_GROUP_META[category.categoryType as FilterGroupKey]
              : null;

          return (
            <Link
              key={category._id}
              href={slug ? `/${lang}/${slug}` : "#"}
              className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl bg-gray-100 shadow-sm sm:aspect-[4/5] sm:rounded-3xl"
            >
              <Image
                src={imageSrc}
                alt={category.featuredImage?.alt || categoryTitle}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Degradado para que el texto se lea sobre la foto */}
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Insignia del tipo de filtro (Ubicación / Propiedad / Oferta) --
                  bien chica en mobile (3 por fila, poco lugar), tamaño normal desde sm. */}
              {groupMeta && (
                <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-bold uppercase text-black shadow-sm sm:left-5 sm:top-5 sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-wide">
                  {groupMeta.label[lang === "en" ? "en" : "es"]}
                </span>
              )}

              <div className="relative z-10 p-1.5 sm:p-5">
                <span className="line-clamp-2 text-[11px] font-extrabold leading-tight text-white sm:text-xl sm:leading-normal">
                  {categoryTitle}
                </span>
                {category.description && (
                  <p className="mt-1 hidden line-clamp-2 text-sm text-white/75 sm:block">{category.description}</p>
                )}
                {typeof category.count === "number" && (
                  <p className="mt-2 hidden text-xs font-semibold uppercase tracking-wide text-white/60 sm:block">
                    {category.count} {copy.posts}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
