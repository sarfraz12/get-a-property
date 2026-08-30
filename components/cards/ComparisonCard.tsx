// components/cards/ComparisonCard.tsx
//
// Tarjeta de fila usada dentro de ComparisonSection / ComparisonServicesSection.
// Forma: tarjeta blanca redondeada con una barra de color a la izquierda
// (el color lo elige el editor en Sanity) y, a la derecha, un botón
// circular con flecha — el mismo lenguaje visual que el CTA del Hero,
// para que toda la home se sienta como un solo sistema.
import Link from "next/link";
import { cx } from "@/utils/all";

// Mapea el nombre de color guardado en Sanity a clases reales de Tailwind.
// (Tailwind no puede generar clases armadas dinámicamente tipo
// `bg-${color}-500`, por eso se necesita este mapa explícito.)
const ACCENT_BAR: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  teal: "bg-teal-400",
  orange: "bg-orange-400",
};

const ACCENT_TEXT: Record<string, string> = {
  blue: "text-blue-600",
  red: "text-red-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  teal: "text-teal-600",
  orange: "text-orange-600",
};

interface ComparisonCardProps {
  title?: string;
  category?: string;
  color?: string;
  link?: string;
  lang?: string;
}

// Si Sanity trae la tarjeta sin título (campo vacío), se muestra este
// texto por defecto en vez de dejar la tarjeta con el nombre en blanco.
const DEFAULT_TITLE: Record<string, string> = { es: "Servicio", en: "Service" };

export default function ComparisonCard({ title, category, color = "blue", link, lang = "es" }: ComparisonCardProps) {
  const finalTitle = title || DEFAULT_TITLE[lang] || DEFAULT_TITLE.es;

  return (
    <Link
      href={link || "/"}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        {/* Barra de acento */}
        <span className={cx("h-10 w-1.5 shrink-0 rounded-full", ACCENT_BAR[color] || ACCENT_BAR.blue)} />

        <div className="text-left">
          {category && (
            <p className="text-xs font-bold uppercase tracking-wide text-black/40">{category}</p>
          )}
          <p className={cx("text-base font-bold", ACCENT_TEXT[color] || ACCENT_TEXT.blue)}>{finalTitle}</p>
        </div>
      </div>

      {/* Botón flecha, mismo estilo que el CTA del Hero */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-black transition-colors group-hover:bg-black group-hover:text-white">
        &rarr;
      </span>
    </Link>
  );
}
