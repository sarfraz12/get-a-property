"use client";

import { useState } from "react";
import Link from "next/link";
import ComparisonCard from "@/components/cards/ComparisonCard";

export default function ComparisonServicesSection({ data, lang }) {
  const [showAll, setShowAll] = useState(false);

  if (!data) return null;

  const cardsToShow = showAll
    ? data?.items
    : data?.items?.slice(0, 5);

  const toggleShowAll = () => setShowAll(prev => !prev);

  return (
    <section className="px-6 py-12 grid md:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="text-left max-w-3xl mx-10">
        <h1 className="md:text-4xl text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
          {data?.title}
        </h1>

        <p className="text-gray-500 mb-8 md:text-xl text-lg text-justify">
          {data?.description}
        </p>

        {data?.linkPath && (
          <Link
            href={data?.linkPath}
            className="text-blue-600 font-medium mb-8 inline-block text-md"
          >
            {data?.linkText} &rarr;
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="max-w-xl mx-auto space-y-4 w-full">
        {cardsToShow?.map((card, index) => (
          <ComparisonCard
            key={card?._key || index}
            title={card?.title}
            category={card?.category}
            color={card?.spanColor}
            textColor={card?.textColor}
            link={`/${lang}/${card?.serviceLink}`}
          />
        ))}

        {/* Toggle Button */}
        {data?.items?.length > 5 && (
          <div className="text-left">
            <button
              onClick={toggleShowAll}
              className="text-blue-600 font-medium mt-4"
            >
              {showAll
                ? lang === "en"
                  ? "Show Less"
                  : "Mostrar Menos"
                : lang === "en"
                  ? "See All Services"
                  : "Mostrar Más"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}