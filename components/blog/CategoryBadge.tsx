// components/blog/CategoryBadge.tsx
//
// Insignia(s) de categoría para flotar SOBRE UNA FOTO (esquina de la
// imagen de una tarjeta de post). Usa el mismo color que el editor
// eligió en Sanity para esa categoría (category.color), pero con la
// paleta SÓLIDA de components/ui/label.js (SOLID_COLORS) en vez de la
// pastel de <Label> normal -- un fondo pastel casi no se ve puesto
// directamente sobre una foto, uno sólido sí.
//
// Reemplaza dos implementaciones que antes existían por separado y no
// eran consistentes entre sí:
// - components/posts/PostCard.tsx tenía su propia insignia con fondo
//   negro fijo, ignorando el color real de la categoría.
// - components/posts/postlist.js usaba <CategoryLabel> (la variante
//   pastel de components/blog/category.js), pensada para ir sobre
//   fondo blanco, no sobre una foto.
// Ahora los dos usan este mismo componente -- pedido explícito del
// usuario: "arriba en la parte superior colocar las categorías con
// sus colores respectivos" y "todos los post list con la misma
// armonía y estilo".
import Link from "next/link";
import { SOLID_COLORS } from "@/components/ui/label";

interface CategoryBadgeCategory {
  title?: string;
  color?: string;
  slug?: { current?: string } | string;
}

interface CategoryBadgeProps {
  categories?: CategoryBadgeCategory[];
  lang: string;
  limit?: number;
  className?: string;
  // `asLink` por defecto es true (cada insignia lleva a esa categoría,
  // como ya hacía <CategoryLabel> en postlist.js). PostCard.tsx pasa
  // `asLink={false}` porque en ESE componente la tarjeta ENTERA ya es
  // un único <Link> -- un <Link> anidado adentro de otro es HTML
  // inválido (React tira un error de hidratación) y el click quedaría
  // ambiguo entre los dos. Sin `asLink`, la insignia se ve exactamente
  // igual pero como texto plano (no navega por su cuenta); igual se
  // puede llegar a esa categoría haciendo click en el resto de la
  // tarjeta, que ya lleva al post.
  asLink?: boolean;
}

export default function CategoryBadge({ categories, lang, limit = 3, className = "", asLink = true }: CategoryBadgeProps) {
  const items = (categories || []).filter(c => c?.title).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((category, index) => {
        const bg = (category.color && (SOLID_COLORS as Record<string, string>)[category.color]) || "bg-black";
        const slug = typeof category.slug === "string" ? category.slug : category.slug?.current;
        const pill = (
          <span
            className={`inline-flex items-center rounded-full ${bg} px-4 py-2 text-xs font-bold text-white shadow-sm sm:text-sm`}
          >
            {category.title}
          </span>
        );

        return asLink && slug ? (
          <Link key={slug || index} href={`/${lang}/${slug}`}>
            {pill}
          </Link>
        ) : (
          <span key={category.title || index}>{pill}</span>
        );
      })}
    </div>
  );
}
