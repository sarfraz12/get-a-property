// components/sections/ComparisonServicesSection.jsx
//
// Variante de ComparisonSection (texto + tarjetas), usada más abajo en
// la home con hasta 5 tarjetas visibles. Mismo tratamiento visual:
// eyebrow + heading grande, tarjetas ComparisonCard, botón píldora.
"use client";

import { useState } from "react";
import Link from "next/link";
import ComparisonCard from "@/components/cards/ComparisonCard";

// Copy de respaldo si Sanity trae el título/descripción vacíos.
const DEFAULT_COPY = {
  es: {
    title: "Más razones para elegir Get a Property",
    description: "Catálogo verificado, acompañamiento personalizado y transparencia en cada propiedad.",
  },
  en: {
    title: "More reasons to choose Get a Property",
    description: "Verified listings, personalized support, and transparency behind every property.",
  },
};

export default function ComparisonServicesSection({ data, lang }) {
  const [showAll, setShowAll] = useState(false);
  const defaults = DEFAULT_COPY[lang] || DEFAULT_COPY.es;

  if (!data) return null;

  const cardsToShow = showAll ? data?.items : data?.items?.slice(0, 5);
  const toggleShowAll = () => setShowAll((prev) => !prev);

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
      {/* Columna de texto */}
      <div className="max-w-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
          {lang === "en" ? "More about us" : "Más sobre nosotros"}
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
          {data?.title || defaults.title}
        </h2>
        <p className="mt-4 text-lg text-black/50 md:text-xl">{data?.description || defaults.description}</p>

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
      <div className="w-full max-w-xl space-y-4">
        {cardsToShow?.map((card, index) => (
          <ComparisonCard
            key={card?._key || index}
            title={card?.title}
            category={card?.category}
            color={card?.spanColor}
            link={`/${lang}/${card?.serviceLink}`}
            lang={lang}
          />
        ))}

        {data?.items?.length > 5 && (
          <button
            onClick={toggleShowAll}
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
