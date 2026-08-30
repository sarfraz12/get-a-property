// components/cards/serviceDescription.tsx
//
// Bloque alterno imagen/texto ("ServiceCards" en Sanity). Se mantiene
// la animación de aparición al hacer scroll y el prop `reverse` que
// invierte el orden imagen/texto. Cambia la forma: imagen con esquinas
// grandes y sombra, checklist con ícono en color de marca, y el texto
// alineado a la izquierda (el "text-justify" de antes se ve anticuado
// y es menos legible que un párrafo alineado a la izquierda).
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface Point {
  contentCardItemDescription: string;
}

interface SectionProps {
  title?: string;
  description?: string;
  description2?: string;
  imageSrc?: string | any;
  reverse?: boolean;
  animation?: string;
  points?: Point[];
  lang?: string;
}

// Copy y foto de respaldo si Sanity trae el bloque sin título/
// descripción/imagen (antes se veía un título en blanco y, sin
// imagen, la columna de foto simplemente desaparecía).
const DEFAULT_COPY: Record<string, { title: string; description: string }> = {
  es: {
    title: "Calidad y confianza en cada propiedad",
    description: "Cada propiedad de nuestro catálogo se verifica cuidadosamente en Panamá, con información clara y sin atajos.",
  },
  en: {
    title: "Quality and trust in every property",
    description: "Every property in our catalog is carefully vetted in Panama, with clear information and no shortcuts.",
  },
};
// Objeto con la misma forma que devuelve urlForImage() ({src,width,height}),
// para que next/image pueda inferir el tamaño sin necesitar la prop
// "fill" (este componente no la usa). Dimensiones reales del archivo.
const DEFAULT_IMAGE = { src: "/images/placeholder-hero-3.jpg", width: 1080, height: 1080 };

export default function ServiceDescription({
  title,
  description,
  description2,
  imageSrc,
  reverse = false,
  animation = "animate-slideInLeft",
  points,
  lang = "es",
}: SectionProps) {
  const defaults = DEFAULT_COPY[lang] || DEFAULT_COPY.es;
  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalImageSrc = imageSrc || DEFAULT_IMAGE;
  // Animación al entrar en pantalla (misma lógica de antes)
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) setIsVisible(true);
        });
      },
      { threshold: 0.3 }
    );

    const node = sectionRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`transition-opacity duration-700 ${isVisible ? `opacity-100 ${animation}` : "opacity-0"}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Texto */}
          <div className={`space-y-4 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
            <h2 className="text-3xl font-extrabold sm:text-4xl">{finalTitle}</h2>

            <div style={{ whiteSpace: "pre-line" }} className="space-y-4">
              <p className="text-lg leading-relaxed text-black/60">{finalDescription}</p>

              {points && points.length > 0 && (
                <ul className="space-y-3 border-t border-black/10 pt-4">
                  {points.map((item: Point, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold" />
                      <span className="text-black/70">{item?.contentCardItemDescription}</span>
                    </li>
                  ))}
                </ul>
              )}

              {description2 && <p className="text-lg leading-relaxed text-black/60">{description2}</p>}
            </div>
          </div>

          {/* Imagen (siempre presente: real de Sanity, o placeholder por defecto) */}
          <div className={`relative ${reverse ? "lg:order-1" : "lg:order-2"}`}>
            <div className="h-full max-h-[600px] overflow-hidden rounded-3xl shadow-lg">
              <Image
                src={finalImageSrc}
                alt={finalTitle}
                className="hover-grow rounded-3xl object-cover shadow-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
