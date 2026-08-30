// components/sections/ProcessSection.tsx
//
// "Bringing your home vision to life" de la referencia: foto a la
// izquierda, título + párrafo + checklist de 2 columnas a la derecha.
// Adaptado al proceso de Get a Property / por qué elegirnos, con
// puntos honestos (no cifras de negocio inventadas).
import Image from "next/image";
import Container from "@/components/generalUse/container";
import { urlForImage } from "@/lib/sanity/image";

interface ProcessSectionProps {
  lang: string;
  heading?: string;
  description?: string;
  items?: { text?: string }[];
  image?: any;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.25} stroke="currentColor" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const COPY: Record<string, { heading: string; description: string; items: string[] }> = {
  es: {
    heading: "Calidad en cada paso",
    description:
      "Nuestro proceso es simple pero cuidadoso, pensado para que encuentres tu próxima propiedad con confianza.",
    items: [
      "Catálogo verificado",
      "Fotos y datos reales de cada propiedad",
      "Filtros por ubicación, tipo y oferta",
      "Acompañamiento en Panamá",
      "Información clara de precio",
      "Documentación al día",
      "Sin letra pequeña",
      "Atención personalizada",
    ],
  },
  en: {
    heading: "Quality in every step",
    description:
      "Our process is simple but careful, designed to help you find your next property with confidence.",
    items: [
      "Verified catalog",
      "Real photos and data for every property",
      "Filters by location, type, and offer",
      "Support across Panama",
      "Clear pricing information",
      "Up-to-date documentation",
      "No fine print",
      "Personalized attention",
    ],
  },
};

export default function ProcessSection({ lang, heading, description, items, image }: ProcessSectionProps) {
  const t = COPY[lang] || COPY.es;
  const finalHeading = heading || t.heading;
  const finalDescription = description || t.description;
  const realItems = (items || []).map(item => item?.text).filter(Boolean) as string[];
  const finalItems = realItems.length > 0 ? realItems : t.items;
  const half = Math.ceil(finalItems.length / 2);
  const columns = [finalItems.slice(0, half), finalItems.slice(half)];
  const processImage = image ? urlForImage(image) : null;

  return (
    <Container large alt className="pb-16 md:pb-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Foto: real de Sanity (aboutPage.processImage) si se cargó
            una; si no, la foto de respaldo que ya tenía la página. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={processImage?.src || "/images/asset.jpg"}
            alt={image?.alt || "Get a Property"}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            {finalHeading}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-black/60 sm:text-lg">{finalDescription}</p>

          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {columns.map((column, colIndex) => (
              <ul key={colIndex} className="space-y-3">
                {column.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-3 text-sm font-semibold text-black sm:text-base">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
