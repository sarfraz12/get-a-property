// components/generalUse/container.js
//
// Contenedor base de TODO el sitio. Antes cada sección definía su propio
// ancho máximo (max-w-screen-lg, max-w-7xl, max-w-[1920px]...) y su
// propio padding, así que las secciones no quedaban alineadas entre sí.
// Ahora hay un solo "carril" visual reutilizable, como en los templates
// de real estate: ancho máximo 1280px (7xl), padding horizontal fijo
// que crece en pantallas grandes, y un ritmo vertical consistente entre
// secciones.
//
// Props:
// - large:     usa un ancho máximo mayor (1440px), para bloques hero o
//              full-bleed que necesitan más aire
// - alt:       quita el padding vertical por defecto (para secciones que
//              ya manejan su propio spacing, ej. sliders a pantalla completa)
// - className: clases extra (se agregan al final, así que pueden
//              sobreescribir el padding/ancho si un caso lo necesita)
import { cx } from "@/utils/all";

export default function Container({ large = false, alt = false, className = "", children }) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        large ? "max-w-[1440px]" : "max-w-7xl",
        !alt && "py-12 md:py-20",
        className
      )}
    >
      {children}
    </div>
  );
}
