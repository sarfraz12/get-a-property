// components/ui/label.js
//
// "Label" = insignia / badge reutilizado en todo el sitio (categoría de
// producto, estado, "Featured", etc). Antes existían dos variantes con
// estilos distintos y un bug: la variante normal solo pintaba el fondo
// y no el color de texto. Ahora es UNA sola forma visual (chip
// redondeado, típico de las tarjetas de un template real-estate) con
// un mapa de color→(fondo,texto) para que siempre haya buen contraste.
//
// Props:
// - color:   'green' | 'blue' | 'orange' | 'purple' | 'pink' | 'red' |
//            'yellow' | 'teal' | 'indigo' | 'gray'
// - pill:    variante compacta (h-6), pensada para ir SOBRE una imagen
// - nomargin: quita el margen superior por defecto (para usarlo pegado
//             a otro elemento, ej. dentro de una tarjeta de post)
//
// Esta lista TIENE que tener una entrada por cada "value" del campo
// "color" en lib/sanity/schemas/category.js -- si se agrega un color
// nuevo ahí, hay que agregarlo acá también (o cae en el respaldo
// "pink" de abajo, que sigue siendo válido pero no es el elegido).
import { cx } from "@/utils/all";

const COLORS = {
  green: { bg: "bg-emerald-50", text: "text-emerald-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  pink: { bg: "bg-pink-50", text: "text-pink-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
};

// SOLID_COLORS: la misma paleta de arriba pero en versión sólida y de
// alto contraste, pensada para una insignia que flota SOBRE UNA FOTO
// (donde el fondo pastel de COLORS casi no se ve) -- ej. la insignia
// de categoría en las tarjetas de post (components/blog/CategoryBadge.tsx,
// usado por PostCard.tsx y postlist.js). Mismos "value" que COLORS y
// que category.color en Sanity -- si se agrega un color nuevo ahí, hay
// que agregarlo en LAS DOS listas.
export const SOLID_COLORS = {
  green: "bg-emerald-600",
  blue: "bg-blue-600",
  orange: "bg-orange-600",
  purple: "bg-purple-600",
  pink: "bg-pink-600",
  red: "bg-red-600",
  yellow: "bg-yellow-500",
  teal: "bg-teal-600",
  indigo: "bg-indigo-600",
  gray: "bg-gray-800",
};

export default function Label({ color, pill, nomargin, children }) {
  const palette = COLORS[color] || COLORS.pink;

  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        palette.bg,
        palette.text,
        pill ? "h-6" : "",
        !nomargin && "mt-4"
      )}
    >
      {children}
    </span>
  );
}
