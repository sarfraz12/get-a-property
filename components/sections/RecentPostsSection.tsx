// components/sections/RecentPostsSection.tsx
//
// Grilla de "publicaciones recientes", con la forma de la referencia
// (property cards de EstatePro). En vez de ordenar por "popularidad"
// (la plantilla original no tenía ese dato), se ordena por fecha de
// publicación — que es exactamente lo que pidió el negocio: mostrar
// lo más reciente primero.
//
// La tarjeta en sí (imagen + insignias + título + autor, con el efecto
// de aparición al hacer scroll) vive en components/posts/PostCard.tsx,
// compartida también con el listado de "Todos los posts"/categoría
// (app/(website)/[lang]/[category]/categoryPosts.js) para no duplicar
// el mismo componente en dos lugares.
import Link from "next/link";
import PostCard, { type PostCardPost } from "@/components/posts/PostCard";

interface RecentPostsSectionProps {
  posts: PostCardPost[];
  lang: string;
  limit?: number;
  excludeId?: string; // para no repetir un post ya mostrado arriba (ej. el producto principal)
  title?: string;
}

export default function RecentPostsSection({ posts, lang, limit = 6, excludeId, title }: RecentPostsSectionProps) {
  const items = [...(posts || [])]
    .filter((post) => post._id !== excludeId)
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a._createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b._createdAt || 0).getTime();
      return dateB - dateA; // más reciente primero
    })
    .slice(0, limit);

  if (items.length === 0) return null;

  const heading = title ?? (lang === "en" ? "Latest posts" : "Publicaciones recientes");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-4xl font-extrabold sm:text-5xl">{heading}</h2>

        <Link href={`/${lang}/all`} className="group inline-flex flex-shrink-0 items-center gap-2 text-base font-bold text-black">
          {lang === "en" ? "View all" : "Ver todo"}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white">
            &rarr;
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
        {items.map((post, index) => (
          <PostCard key={post._id} post={post} lang={lang} index={index} pathPrefix="all" />
        ))}
      </div>
    </section>
  );
}
