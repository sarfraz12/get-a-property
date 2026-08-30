// components/posts/postlist.js
//
// Tarjeta de post/producto. Es el componente que más se parece a una
// "property card" de un template real-estate, así que se ajusta a ese
// lenguaje: imagen con esquinas grandes (rounded-2xl/3xl), la categoría
// como insignia flotando SOBRE la imagen (como el badge "For Sale" en
// una tarjeta de propiedad) y una fila de meta-datos abajo (autor +
// fecha), separada por puntos, igual que un renglón de "beds · baths".
//
// La lógica se mantiene igual: animación de aparición con
// IntersectionObserver, layout especial cuando `isMain` es true (la
// tarjeta grande del producto principal) y layout de 2 columnas cuando
// `minimal` es true.
"use client";

import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryBadge from "@/components/blog/CategoryBadge";
import { useRef, useState, useEffect } from "react";

export default function PostList({
  post = {},
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight,
  lang,
  animation = "animate-fadeInScale",
  isMain = false,
}) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const authorImageProps = post?.author?.image ? urlForImage(post.author.image) : null;

  // Aparece con una animación suave cuando la tarjeta entra en pantalla
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const postUrl = `${!lang ? "" : "/" + lang}/${pathPrefix ? `${pathPrefix}/` : "all/"}post/${post.slug?.current}`;

  return (
    <div
      ref={sectionRef}
      className={cx(
        "group w-full transition-all duration-500",
        minimal ? "grid items-center gap-8 md:grid-cols-2" : "flex flex-col",
        isVisible ? `opacity-100 ${animation}` : "opacity-0"
      )}
    >
      {/* IMAGEN + insignia de categoría flotando encima */}
      <div
        className={cx(
          "relative w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm dark:bg-gray-800",
          isMain ? "h-[240px] sm:h-[320px] md:h-[480px] lg:h-[560px]" : "aspect-[4/3]"
        )}
      >
        <Link href={postUrl} className="block h-full w-full">
          {imageProps ? (
            <Image
              src={imageProps.src}
              alt={post.mainImage?.alt || "Thumbnail"}
              fill
              priority={preloadImage}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <PhotoIcon className="h-12 w-12" />
            </div>
          )}
        </Link>

        {/* Insignia de categoría, tipo "For Sale" sobre la foto -- ahora
            con el color real elegido en Sanity (ver
            components/blog/CategoryBadge.tsx), la misma que usa
            PostCard.tsx, en vez de la variante pastel de <CategoryLabel>
            (pensada para ir sobre fondo blanco, no sobre una foto). */}
        <CategoryBadge categories={post.categories} lang={lang} limit={3} className="absolute left-3 top-3" />

        {/* Precio, en la esquina opuesta a la categoría */}
        {post?.price && (
          <span className="absolute right-3 top-3 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white shadow-sm sm:px-4 sm:py-2 sm:text-sm">
            {post.price}
          </span>
        )}
      </div>

      {/* CONTENIDO DE TEXTO */}
      <div className="mt-5 px-1 sm:px-2">
        {/* TÍTULO */}
        <h2
          className={cx(
            isMain ? "text-xl font-bold leading-tight sm:text-2xl md:text-4xl" : "text-lg font-semibold sm:text-xl",
            "text-black dark:text-white"
          )}
        >
          <Link href={postUrl}>{post.title}</Link>
        </h2>

        {/* UBICACIÓN */}
        {post?.location && (
          <p className="mt-1 truncate text-sm font-semibold text-gray-500 dark:text-gray-400">{post.location}</p>
        )}

        {/* EXTRACTO */}
        {post.excerpt && (
          <p
            className={cx(
              "mt-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base",
              isMain ? "line-clamp-4 md:line-clamp-none" : "line-clamp-3"
            )}
          >
            {post.excerpt}
          </p>
        )}

        {/* AUTOR + FECHA (fila de "meta", como beds/baths en una property card) */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          {post.author?.name && (
            <>
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 overflow-hidden rounded-full">
                  {authorImageProps && (
                    <Image
                      src={authorImageProps.src}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  )}
                </div>
                <span>{post.author.name}</span>
              </div>
              <span>•</span>
            </>
          )}

          <time dateTime={post?.publishedAt || post._createdAt}>
            {format(parseISO(post?.publishedAt || post._createdAt), "MMMM dd, yyyy")}
          </time>
        </div>
      </div>
    </div>
  );
}
