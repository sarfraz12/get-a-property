// components/sections/CertificationLogosSection.jsx
//
// Grilla de logos de certificación (Halal, Kosher, Hecho en Panamá...).
//
// FIX importante: la versión anterior armaba las clases de columnas así:
//   `sm:grid-cols-${smCols}`
// Tailwind analiza el código como TEXTO para saber qué clases generar en
// el build; si el nombre de la clase se arma en tiempo de ejecución con
// una variable, Tailwind nunca la "ve" en el código fuente y no la
// incluye en el CSS final. Esa grilla dinámica podía perder el layout
// en producción. Ahora se usa un mapa de clases fijas (texto literal),
// que es lo que Tailwind necesita para generarlas correctamente.
import Image from "next/image";

// Mapa fijo: cantidad de logos -> clases de columnas por breakpoint.
// Todas las clases están escritas completas para que Tailwind las detecte.
const GRID_COLS_BY_COUNT = {
  1: "sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
  2: "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
};
const GRID_COLS_DEFAULT = "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

export default function CertificationLogosSection({ title, logos = [] }) {
  if (!logos?.length) return null;

  const gridColsClass = GRID_COLS_BY_COUNT[logos.length] || GRID_COLS_DEFAULT;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        {title && <h2 className="mb-12 text-3xl font-extrabold md:text-4xl">{title}</h2>}

        <div className={`grid grid-cols-1 justify-items-center gap-8 ${gridColsClass}`}>
          {logos.map((logo, index) => (
            <div
              key={logo?._key || index}
              className="flex h-40 w-56 items-center justify-center rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-800"
            >
              <div className="relative h-full w-full">
                <Image
                  src={logo?.image}
                  alt={logo?.alt || "Certification logo"}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
