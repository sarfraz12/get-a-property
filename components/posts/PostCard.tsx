// components/posts/PostCard.tsx
//
// Tarjeta de post/propiedad -- rediseñada a pedido del usuario para
// que coincida con su referencia ("Serenity heights apartment" /
// "Maple haven house"): tarjeta más ANCHA (antes aspect-[4/5], vertical
// y angosta; ahora aspect-[4/3], más horizontal), con estos cambios
// puntuales sobre la versión anterior:
//
// - El VALOR GRANDE de la derecha (antes la fecha) ahora es el
//   PRECIO cuando el post lo tiene cargado (post.price) -- la fecha
//   sólo se sigue mostrando ahí como respaldo para posts sin precio
//   (mismo criterio que el recuadro gris de la página del post
//   individual, ver postHome.js, para que ambos lugares se vean
//   coherentes entre sí).
// - La fila de 3 íconos de abajo ahora muestra los "Puntos clave"
//   reales del post (post.highlights -- el editor los elige a mano en
//   Sanity, con su propio ícono: cama/baño/área/etc., ver
//   lib/sanity/schemas/post.js) en vez de datos genéricos de blog
//   (categoría/tiempo de lectura/fotos). Si el post todavía no tiene
//   ningún "punto clave" cargado, esos 3 datos genéricos siguen
//   apareciendo como respaldo, para que la tarjeta nunca se vea con
//   un hueco vacío mientras se carga contenido real.
// - La insignia de categoría (arriba a la izquierda, sobre la foto)
//   ahora usa el COLOR real que el editor eligió para esa categoría en
//   Sanity (antes era siempre negra) -- ver components/blog/CategoryBadge.tsx.
// - Se sacó la insignia de precio que flotaba sobre la foto (arriba a
//   la derecha): ahora el precio vive en el lugar de la fecha, adentro
//   de la caja blanca, para no repetirlo dos veces.
// - Se sacó el extracto (excerpt) de la tarjeta: la referencia no lo
//   tiene, y con precio + ubicación + 3 puntos clave ya hay suficiente
//   información para decidir de un vistazo (el texto completo sigue
//   estando en la página del post).
//
// De dónde sale cada dato (todo real, resuelto desde lib/sanity/groq.js
// -> postquery / postsbycatquery / searchquery / singlequery.related):
// - post.price / post.location -> lib/sanity/schemas/post.js
// - post.highlights[].icon/text -> lib/sanity/schemas/post.js (mismo
//   selector de ícono que la página del post, ver
//   components/blog/keyFeatureIcons.tsx)
// - post.categories[].color    -> lib/sanity/schemas/category.js
//
// Se sacó de components/sections/RecentPostsSection.tsx (donde vivía
// como componente interno, sólo para esa sección) para poder
// reutilizarla también en el listado de "Todos los posts"/categoría
// (app/(website)/[lang]/[category]/categoryPosts.js), en "relacionados"
// (postHome.js) y en los resultados de búsqueda (search.js).
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { urlForImage } from "@/lib/sanity/image";
import { cx } from "@/utils/all";
import CategoryBadge from "@/components/blog/CategoryBadge";
import { renderKeyFeatureIcon, type KeyFeatureItem } from "@/components/blog/keyFeatureIcons";

export interface PostCardPost {
  _id: string;
  _createdAt?: string;
  publishedAt?: string;
  title?: string;
  excerpt?: string;
  estReadingTime?: number;
  galleryCount?: number;
  slug?: { current: string };
  mainImage?: any;
  author?: { name?: string };
  categories?: { title?: string; color?: string; slug?: { current?: string } | string }[];
  price?: string;
  location?: string;
  // Puntos clave elegidos a mano en Sanity (icono + texto). Ver
  // lib/sanity/schemas/post.js -> highlights.
  highlights?: KeyFeatureItem[];
}

interface PostCardProps {
  post: PostCardPost;
  lang: string;
  index?: number;
  pathPrefix?: string; // ej. "all" -> /{lang}/all/post/{slug}
}

const COPY: Record<string, { minRead: string; photos: string }> = {
  es: { minRead: "min", photos: "fotos" },
  en: { minRead: "min", photos: "photos" },
};

// Cantidad de fotos de galería a mostrar cuando el post todavía no
// tiene ninguna cargada en Sanity (ver comentario arriba).
const PLACEHOLDER_PHOTO_COUNT = 3;

/* ------------------------------------------------------------------ */
/*  Íconos de línea simple, usados sólo en la fila de respaldo (sin    */
/*  "puntos clave" reales cargados todavía)                            */
/* ------------------------------------------------------------------ */

function TagIcon({ className = "h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5V5a2 2 0 0 1 2-2h6.5a2 2 0 0 1 1.41.59l8 8a2 2 0 0 1 0 2.82l-6.5 6.5a2 2 0 0 1-2.82 0l-8-8A2 2 0 0 1 3 11.5Z" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClockIcon({ className = "h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 2" />
    </svg>
  );
}

function PhotoIcon({ className = "h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="10" r="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 16.5 4.5-4.5a2 2 0 0 1 2.8 0L15 15.5m2-2 .8-.8a2 2 0 0 1 2.8 0l.4.4" />
    </svg>
  );
}

export default function PostCard({ post, lang, index = 0, pathPrefix = "all" }: PostCardProps) {
  const t = COPY[lang] || COPY.es;

  // Aparece con fade + subida cuando la tarjeta entra en pantalla
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const image = post?.mainImage ? urlForImage(post.mainImage) : null;
  const category = post?.categories?.[0]?.title;
  const rawDate = post?.publishedAt || post?._createdAt;
  const dateLabel = rawDate ? format(parseISO(rawDate), "dd MMM", { locale: lang === "es" ? es : undefined }) : null;
  const postUrl = `/${lang}/${pathPrefix}/post/${post.slug?.current}`;

  const readTime = Math.max(1, post?.estReadingTime || 0) || 3;
  const photoCount = post?.galleryCount && post.galleryCount > 0 ? post.galleryCount : PLACEHOLDER_PHOTO_COUNT;

  // Hasta 3 "puntos clave" elegidos a mano en Sanity. Si no hay
  // ninguno cargado todavía, se usa la fila de respaldo de siempre
  // (categoría / tiempo de lectura / fotos) para que la tarjeta nunca
  // se vea con un hueco vacío.
  const keyItems = (post?.highlights || []).filter(h => h?.text).slice(0, 3);
  const hasKeyItems = keyItems.length > 0;

  return (
    <Link
      href={postUrl}
      ref={cardRef}
      style={{ transitionDelay: `${index * 75}ms` }}
      className={cx(
        "group relative block overflow-hidden rounded-3xl border border-black/10 shadow-lg shadow-black/10 transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      {/* La imagen ES la tarjeta completa (fondo a todo lo alto/ancho).
          aspect-[4/3] (antes 4/5) -- pedido del usuario: tarjeta más
          ancha, menos vertical. */}
      <div className="relative aspect-[3/2] w-full bg-gray-100">
        {image && (
          <Image
            src={image.src}
            alt={post.mainImage?.alt || post.title || "Thumbnail"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}

        {/* Insignia(s) de categoría con su color real (ver
            components/blog/CategoryBadge.tsx). asLink={false}: esta
            tarjeta ENTERA ya es un <Link> (ver el <Link> que envuelve
            todo el componente) -- un <Link> anidado adentro de otro
            es HTML inválido, así que acá la insignia es texto plano en
            vez de un link propio (el click en cualquier parte de la
            tarjeta, insignia incluida, ya lleva al post). */}
        <CategoryBadge
          categories={post?.categories}
          lang={lang}
          limit={1}
          asLink={false}
          className="absolute left-4 top-4 sm:left-5 sm:top-5"
        />

        {/* Caja blanca flotando ADENTRO de la imagen, pegada abajo */}
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white p-6 shadow-xl sm:inset-x-6 sm:bottom-6 sm:p-8">
          {/* Fila superior: izquierda (título + ubicación) / derecha
              separada -- precio si el post lo tiene, si no la fecha
              (mismo criterio que el recuadro gris de la página del
              post individual, ver postHome.js). */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-lg font-extrabold text-black transition-colors group-hover:text-brand-gold sm:text-2xl">
                {post.title}
              </h3>
              {post?.location && (
                <p className="mt-2 text-sm font-semibold leading-snug text-black/50 sm:text-base">{post.location}</p>
              )}
            </div>

            {(post?.price || dateLabel) && (
              <div className="flex-shrink-0 border-l border-black/10 pl-5 text-right sm:pl-6">
                {post?.price ? (
                  <span className="text-2xl font-extrabold text-black sm:text-3xl">{post.price}</span>
                ) : (
                  <span className="text-2xl font-extrabold text-black sm:text-3xl">{dateLabel}</span>
                )}
              </div>
            )}
          </div>

          {/* Fila inferior: 3 puntos clave reales (con su ícono real)
              si el post los tiene, o -- de respaldo -- categoría /
              tiempo de lectura / fotos. */}
          <div className="mt-5 flex items-center gap-4 overflow-hidden border-t border-black/10 pt-5 text-sm font-semibold text-black/70 sm:gap-6 sm:pt-6 sm:text-base">
            {hasKeyItems ? (
              keyItems.map((item, i) => (
                <span key={i} className="flex min-w-0 flex-1 items-center gap-1.5">
                  {renderKeyFeatureIcon(item, i, "h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6")}
                  <span className="truncate">{item.text}</span>
                </span>
              ))
            ) : (
              <>
                {category && (
                  <span className="flex min-w-0 flex-1 items-center gap-1.5">
                    <TagIcon />
                    <span className="truncate">{category}</span>
                  </span>
                )}
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                  <ClockIcon />
                  <span className="truncate">{readTime} {t.minRead}</span>
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                  <PhotoIcon />
                  <span className="truncate">{photoCount} {t.photos}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
