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

export default function ComparisonSection({ data, lang }: Props) {
  const [showAll, setShowAll] = useState(false);

  const cardsToShow = showAll
    ? data?.items
    : data?.items?.slice(0, 3);

  return (
    <section className="px-4 md:px-6 py-12 grid md:grid-cols-2 gap-10 max-w-7xl mx-auto">
      {/* Left Content */}
      <div>
        <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
          {data?.title}
        </h2>

        <p className="text-gray-500 mb-6 md:text-lg">
          {data?.description}
        </p>

        <Link
          href={data?.linkPath || "#"}
          className="text-blue-600 font-medium"
        >
          {data?.linkText} →
        </Link>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {cardsToShow?.map((item, index) => (
          <ComparisonCard
            key={index}
            title={item?.title}
            category={item?.category}
            color={item?.spanColor}
            textColor={item?.textColor}
            link={`/${lang}/${item?.serviceLink}`}
          />
        ))}

        <button
          onClick={() => setShowAll(!showAll)}
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
    </section>
  );
}