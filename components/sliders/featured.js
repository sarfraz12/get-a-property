// components/sliders/featured.js
//
// Banner del post/producto destacado (por título, no por flag), entre
// el bloque de posts y las CTA cards. Se conserva la lógica (color de
// fondo tomado de la paleta dominante de la imagen vía Sanity) y se le
// da el mismo lenguaje visual del resto: bloque envuelto en el ancho
// máximo del sitio, esquinas grandes y tipografía en línea con el Hero.
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { cx } from "@/utils/all";
import Link from "next/link";

export default function Featured({ post, pathPrefix }) {
  const imageProps = post?.mainImage ? urlForImage(post?.mainImage) : null;
  const authorImageProps = post?.author?.image ? urlForImage(post.author.image) : null;
  const postUrl = `/${pathPrefix ? `${pathPrefix}/post/` : ""}${post.slug.current}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div
        className={cx("grid overflow-hidden rounded-3xl md:min-h-[560px] md:grid-cols-2")}
        style={{ backgroundColor: post?.mainImage?.ImageColor || "black" }}
      >
        {imageProps && (
          <div className="relative aspect-video md:aspect-auto">
            <Link href={postUrl} className="block h-full w-full">
              <div className="relative h-full w-full">
                <Image
                  src={imageProps.src}
                  {...(post.mainImage.blurDataURL && {
                    placeholder: "blur",
                    blurDataURL: post.mainImage.blurDataURL,
                  })}
                  alt={post.mainImage?.alt || "Thumbnail"}
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Precio, esquina superior derecha de la foto */}
            {post?.price && (
              <span className="absolute right-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-sm sm:text-sm">
                {post.price}
              </span>
            )}
          </div>
        )}

        <div className="self-center px-6 py-10 md:px-10">
          <Link href={postUrl}>
            <div className="max-w-2xl">
              <h2 className="mb-3 mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
                {post.title}
              </h2>
              {post?.location && (
                <p className="-mt-1 mb-3 truncate text-sm font-semibold text-white/60">{post.location}</p>
              )}
              <p style={{ whiteSpace: "pre-line" }} className="text-white/80 lg:text-lg">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-col gap-3 text-sm text-white/70 md:flex-row md:items-center md:gap-4">
                {post.author?.name && (
                  <div className="flex items-center gap-3">
                    <div className="relative h-6 w-6 flex-shrink-0">
                      {authorImageProps && (
                        <Image
                          src={authorImageProps.src}
                          alt={post?.author?.name}
                          className="rounded-full object-cover"
                          fill
                          sizes="24px"
                        />
                      )}
                    </div>
                    <span className="text-white/90">{post.author.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <time dateTime={post?.publishedAt || post._createdAt}>
                    {format(parseISO(post?.publishedAt || post._createdAt), "MMMM dd, yyyy")}
                  </time>
                  <span>· {post.estReadingTime || "5"} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
