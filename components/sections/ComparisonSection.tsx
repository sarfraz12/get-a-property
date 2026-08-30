// components/sections/ComparisonSection.tsx
//
// Sección "texto a la izquierda + lista de tarjetas a la derecha".
// Se mantiene el mismo comportamiento (mostrar 3 tarjetas y expandir
// con "Ver más" / "Show all"), solo cambia la forma: encabezado con
// "eyebrow" (etiqueta chica), botón "ver más" como píldora con flecha
// en vez de texto azul suelto.
"use client";

import { useState } from "react";
import Link from "next/link";
import ComparisonCard from "@/components/cards/ComparisonCard";

interface ComparisonItem {
  title: string;
  description: string;
  linkPath: string;
  linkText: string;
  items: {
    title: string;
    category: string;
    spanColor: string;
    textColor: string;
    serviceLink: string;
  }[];
}

interface Props {
  data: ComparisonItem;
  lang: string;
}

// Copy de respaldo si Sanity trae el título/descripción vacíos.
const DEFAULT_COPY: Record<string, { title: string; description: string }> = {
  es: {
    title: "Todo lo que necesitas saber sobre nuestras propiedades",
    description: "Explora nuestras categorías: ubicación, tipo de propiedad, tipo de oferta y más.",
  },
  en: {
    title: "Everything you need to know about our properties",
    description: "Explore our categories: location, property type, offer type, and more.",
  },
};

export default function ComparisonSection({ data, lang }: Props) {
  const [showAll, setShowAll] = useState(false);
  const defaults = DEFAULT_COPY[lang] || DEFAULT_COPY.es;

  const cardsToShow = showAll ? data?.items : data?.items?.slice(0, 3);

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
      {/* Columna de texto */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
          {lang === "en" ? "What we offer" : "Lo que ofrecemos"}
        </span>
        <h2 className="mt-3 text-2xl font-extrabold md:text-4xl">{data?.title || defaults.title}</h2>
        <p className="mt-4 text-black/50 md:text-lg">{data?.description || defaults.description}</p>

        {data?.linkPath && (
          <Link
            href={data.linkPath}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-black px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            {data?.linkText} <span aria-hidden>&rarr;</span>
          </Link>
        )}
      </div>

      {/* Columna de tarjetas */}
      <div className="space-y-4">
        {cardsToShow?.map((item, index) => (
          <ComparisonCard
            key={index}
            title={item?.title}
            category={item?.category}
            color={item?.spanColor}
            link={`/${lang}/${item?.serviceLink}`}
            lang={lang}
          />
        ))}

        {data?.items?.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/5 px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-black/10"
          >
            {showAll
              ? lang === "en" ? "Show less" : "Mostrar menos"
              : lang === "en" ? "See all services" : "Mostrar más"}
          </button>
        )}
      </div>
    </section>
  );
}
