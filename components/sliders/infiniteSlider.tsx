// components/sliders/infiniteSlider.tsx
//
// Cinta de logos/marcas en movimiento infinito. La lógica de animación
// (requestAnimationFrame moviendo un transform translateX) se deja
// intacta. Solo se ajusta el padding y se agrega un efecto sutil de
// blanco-y-negro -> color al pasar el mouse, como en las secciones de
// "marcas/certificaciones" de los templates real-estate.
"use client";
import React from "react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { useEffect, useRef } from "react";

interface ClientImages {
  title?: string;
  imageAlt?: string;
  image?: string;
  _key?: string;
}

interface ClientSliderProps {
  lang?: string;
  dataImage: ClientImages[];
}

export default function InfiniteSlider({ dataImage }: ClientSliderProps) {
  const images = [...dataImage, ...dataImage]; // se duplica para que el loop no se note

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animation: number;
    let position = 0;

    const animate = () => {
      position -= 0.5;
      slider.style.transform = `translateX(${position}px)`;

      if (Math.abs(position) > slider.scrollWidth / 2) {
        position = 0;
      }

      animation = requestAnimationFrame(animate);
    };

    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <section className="w-full overflow-hidden bg-brand-dark py-6 dark:bg-brand-gold">
      <div ref={sliderRef} className="flex whitespace-nowrap">
        {images.map((item: ClientImages, index: number) => (
          <div key={index} className="inline-flex items-center justify-center px-8">
            {item.image ? (
              <div className="relative inline-block h-12 w-40 grayscale transition duration-300 hover:grayscale-0">
                <Image
                  // BUG corregido: antes se pasaba el objeto completo que
                  // devuelve urlForImage() ({src,width,height}) como
                  // "src" junto con "fill" -- next/image no permite
                  // mezclar "fill" con width/height y tira en tiempo de
                  // ejecución: 'Image with src "..." has both "width"
                  // and "fill" properties'. Acá sólo hace falta el src.
                  // Además, si la imagen no existe en Sanity,
                  // urlForImage() devuelve undefined -- antes el
                  // respaldo era "/" (ruta inválida, rompe la imagen);
                  // ahora cae en un logo genérico real del sitio.
                  src={urlForImage(item.image)?.src || "/images/logo.png"}
                  alt={item.imageAlt || "Get a Property"}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <p className="whitespace-nowrap text-sm uppercase tracking-widest text-brand-light md:text-base">
                {item.title}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
