// components/sections/WhatWeDoSection.tsx
//
// "What we do" de la referencia: encabezado centrado + tarjetas grises
// con ícono, título y descripción. Ícono/título/descripción de cada
// tarjeta y el encabezado ahora se cargan desde Sanity
// (aboutPage.whatWeDoHeading / aboutPage.whatWeDoItems, ver
// lib/sanity/schemas/aboutPage.js) -- si no hay nada cargado todavía,
// se usa el contenido de respaldo que ya tenía la página (adaptado a lo
// que Get a Property realmente hace), para que la sección nunca se vea
// vacía mientras se carga contenido real en el Studio.
import Container from "@/components/generalUse/container";
import { renderWhatWeDoIcon } from "@/components/sections/whatWeDoIcons";

interface WhatWeDoItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface WhatWeDoSectionProps {
  lang: string;
  heading?: string;
  items?: WhatWeDoItem[];
}

const COPY: Record<
  string,
  { heading: string; items: { icon: string; title: string; description: string }[] }
> = {
  es: {
    heading: "Qué hacemos",
    items: [
      {
        icon: "search",
        title: "Búsqueda personalizada",
        description: "Filtramos por ubicación, tipo de propiedad y tipo de oferta para mostrarte justo lo que buscas.",
      },
      {
        icon: "leaf",
        title: "Catálogo verificado",
        description: "Cada propiedad se revisa antes de publicarse -- sin información falsa ni desactualizada.",
      },
      {
        icon: "shield-check",
        title: "Acompañamiento en el proceso",
        description: "Te guiamos desde el primer contacto hasta el cierre de tu próxima propiedad.",
      },
    ],
  },
  en: {
    heading: "What we do",
    items: [
      {
        icon: "search",
        title: "Personalized search",
        description: "We filter by location, property type, and offer type to show you exactly what you're looking for.",
      },
      {
        icon: "leaf",
        title: "Verified listings",
        description: "Every property is reviewed before it's published -- no false or outdated information.",
      },
      {
        icon: "shield-check",
        title: "Support through the process",
        description: "We guide you from the first contact to closing on your next property.",
      },
    ],
  },
};

export default function WhatWeDoSection({ lang, heading, items }: WhatWeDoSectionProps) {
  const t = COPY[lang] || COPY.es;
  const finalHeading = heading || t.heading;
  const finalItems = items && items.length > 0 ? items : t.items;

  return (
    <Container large alt className="py-16 md:py-24">
      <h2 className="text-center text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
        {finalHeading}
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {finalItems.map((item, index) => (
          <div key={index} className="rounded-2xl bg-gray-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center text-black">
              {renderWhatWeDoIcon(item.icon, index)}
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-black">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">{item.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
