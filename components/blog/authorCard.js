// components/blog/authorCard.js
//
// Tarjeta con foto + bio corta de un autor/vendedor (nombre, imagen,
// texto enriquecido). Actualmente NO se usa en ninguna página del
// sitio (no tiene ningún import activo) -- se deja tal cual por si se
// vuelve a necesitar (por ejemplo, una futura página de perfil de
// vendedor), pero no forma parte del flujo actual del sitio.

import Image from "next/image";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import Link from "next/link";

export default function AuthorCard({ author, lang }) {
  const imageProps = author?.image ? urlForImage(author.image) : null;
  return (
    <div className="px-8 py-8 mt-3 text-gray-500 rounded-2xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
      <div className="flex flex-wrap items-start sm:space-x-6 sm:flex-nowrap">
        <div className="relative flex-shrink-0 w-24 h-24 mt-1 ">
          {imageProps && (
            // <Link href={`/${lang}/author/${author.slug.current}`}>
            <Link href={`/${lang}/aboutUs`}>
              <Image
                src={imageProps.src}
                loader={imageProps.loader}
                alt={author.name}
                className="rounded-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Link>
          )}
        </div>
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300">
              About {author.name}
            </h3>
          </div>
          <div>
            {author.bio && <PortableText value={author.bio} />}
          </div>
          <div className="mt-3">
            {/* <Link
              href={`/author/${author.slug.current}`}
              className="py-2 text-sm text-blue-600 rounded-full dark:text-blue-500 bg-brand-secondary/20 ">
              View Profile
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
