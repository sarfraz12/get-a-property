// components/sections/AboutSection.tsx
//
// Sección "About our company" de la referencia EstatePro: título +
// párrafo a la izquierda, estadísticas + botón a la derecha, y abajo
// una barra negra con esquinas muy redondeadas donde una lista de
// palabras con ícono se desplaza en loop infinito (mismo mecanismo que
// InfiniteSlider: un translateX animado con requestAnimationFrame que
// se reinicia apenas recorre la mitad del ancho, porque la lista está
// duplicada — así nunca se nota el "salto" del loop).
//
// Todo el contenido de esta sección ahora viene de Sanity (landingPage
// -> fieldset "aboutSection", ver lib/sanity/schemas/landingPage.js y
// home.js). Antes se armaba con copy fijo acá mismo, incluyendo
// estadísticas de EJEMPLO (99% / 15K / 5+, de la plantilla de
// referencia, no datos reales) -- ese copy fijo ya no existe: si
// Sanity todavía no tiene NINGÚN dato real cargado para esta sección,
// el componente oculta la sección COMPLETA en vez de mostrar contenido
// de relleno (pedido explícito: "en todas las secciones si el
// contenido es nulo que no aparezca la sección completa en sí").
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Stat {
  label?: string;
  value?: string;
}

interface AboutSectionProps {
  lang: string;
  title?: string;
  paragraphs?: string[];
  stats?: Stat[];
  buttonText?: string;
  buttonLink?: string;
  words?: string[];
}

// Ícono de marca (el mismo "pin" del logo del navbar) para que la barra
// de palabras se sienta parte del mismo sistema visual.
function MarkerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-7 w-7 flex-shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 10a2.5 2.5 0 0 1 5 0c0 1.5-2.5 3-2.5 3s-2.5-1.5-2.5-3Z" />
    </svg>
  );
}

// Barra negra infinita: la lista de palabras se duplica para que el
// loop no se note, y se mueve con un translateX animado por frame.
function WordsMarquee({ words }: { words: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...words, ...words];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame: number;
    let position = 0;

    const animate = () => {
      position -= 0.6;
      track.style.transform = `translateX(${position}px)`;
      if (Math.abs(position) > track.scrollWidth / 2) position = 0;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [words]);

  return (
    <div className="overflow-hidden rounded-[2.5rem] bg-black">
      <div ref={trackRef} className="flex w-max whitespace-nowrap py-7">
        {items.map((word, i) => (
          <div key={i} className="flex items-center gap-3 px-8 text-white">
            <MarkerIcon />
            <span className="text-3xl font-bold sm:text-4xl">{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutSection({
  lang,
  title,
  paragraphs,
  stats,
  buttonText,
  buttonLink,
  words,
}: AboutSectionProps) {
  const finalParagraphs = (paragraphs || []).filter(Boolean);
  const finalStats = (stats || []).filter(stat => stat?.value && stat?.label);
  const finalWords = (words || []).filter(Boolean);
  const finalButtonLink = buttonLink || `/${lang}/aboutUs`;

  // Sin título, sin párrafos y sin estadísticas cargadas en Sanity no
  // hay nada real que mostrar -- se oculta la sección completa en vez
  // de mostrar el copy/estadísticas de ejemplo de antes.
  const hasContent = Boolean(title) || finalParagraphs.length > 0 || finalStats.length > 0;
  if (!hasContent) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      {/* Título + párrafo / estadísticas + botón */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          {title && <h2 className="text-4xl font-extrabold sm:text-5xl">{title}</h2>}
          {finalParagraphs.length > 0 && (
            <div className="mt-5 max-w-xl space-y-4 text-black/50">
              {finalParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          {finalStats.length > 0 && (
            <div className="grid grid-cols-3 gap-6 sm:gap-10">
              {finalStats.map((stat, index) => (
                <div key={index}>
                  <p className="text-sm font-semibold text-black/40">{stat.label}</p>
                  <p className="mt-2 text-4xl font-extrabold sm:text-6xl">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {buttonText && (
            <Link
              href={finalButtonLink}
              className="mt-6 inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-85"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Barra infinita de palabras (sólo si hay al menos una cargada) */}
      {finalWords.length > 0 && (
        <div className="mt-14 md:mt-16">
          <WordsMarquee words={finalWords} />
        </div>
      )}
    </section>
  );
}
