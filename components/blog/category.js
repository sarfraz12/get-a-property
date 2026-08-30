// components/blog/category.js
//
// "Píldoras" de categoría (CategoryLabel): un link con color propio
// por cada categoría real de Sanity a la que pertenece un post.
//
// ACTUALMENTE NO SE USA EN NINGÚN LADO: se usaba en
// components/posts/postlist.js para la insignia de categoría sobre la
// foto, pero ese uso se reemplazó por components/blog/CategoryBadge.tsx
// (misma idea -- color real de la categoría -- pero con fondo SÓLIDO en
// vez del pastel de <Label> de acá, que se ve mal directamente sobre
// una foto). Se deja el archivo por si en algún momento hace falta la
// variante pastel sobre fondo blanco (esta sí es la que usa <Label>
// normal, ver components/ui/label.js).

import Link from "next/link";
import Label from "@/components/ui/label";

export default function CategoryLabel({
  lang,
  categories,
  nomargin = false
}) {

  return (

    <div className="flex gap-3">
      {categories?.length &&
        categories.map((category, index) => (
          <Link
            href={`${!lang?"": "/" + lang}/${category.slug.current}`}
            // href={"#"}
            key={index}>
            <Label nomargin={nomargin} color={category.color}>
              {category.title}

            </Label>
          </Link>
        )) 
        // categories.map((category, index) => (
        // <Link
        //   // href={`/category/${category.slug.current}`}
        //   href={"#"}
        // >
        //   <Label nomargin={nomargin} color={category.color ? category.color : 'green'}>
        //     {category.title}
        //   </Label>
        // </Link>
        // ))
      }
    </div>
  );
}
