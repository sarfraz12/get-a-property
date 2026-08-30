// components/generalUse/testimonialSection.tsx
//
// Carrusel de testimonios (usa Swiper, que ya era parte del proyecto:
// se mantiene, es una librería activa y gratuita, no hace falta
// reemplazarla). Se ajusta la forma de la tarjeta de cita (rounded-3xl,
// sombra más suave, comilla en color de marca) y el color de los puntos
// de paginación de Swiper vía CSS inline para que combinen con la marca.
"use client";

import React from "react";
import { urlForImage } from "@/lib/sanity/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  quote: string;
  author?: string;
}

interface TestimonialSectionProps {
  title?: string;
  backgroundImage?: any;
  testimonials: Testimonial[];
  backgroundColor?: string;
}

export default function TestimonialSection({
  title,
  backgroundImage,
  backgroundColor = "#F2F1EC",
  testimonials,
}: TestimonialSectionProps) {
  return (
    <section className="relative min-h-[70vh] w-full px-4 py-20 md:px-8">
      {/* Imagen de fondo (si el editor subió una en Sanity) */}
      {backgroundImage && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${urlForImage(backgroundImage)?.src})` }}
        />
      )}

      {/* Capa de color sobre la imagen de fondo */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor, opacity: backgroundImage ? 0.55 : 1 }} />

      <div className="mx-auto max-w-5xl text-center">
        {title && <h2 className="mb-10 text-2xl font-bold text-white md:text-3xl">{title}</h2>}

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          spaceBetween={30}
          slidesPerView={1}
          className="[--swiper-pagination-color:#EBAA20]"
        >
          {testimonials?.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
                <span className="text-4xl text-brand-gold" aria-hidden>
                  &#10077;
                </span>
                <p className="-mt-2 text-lg leading-relaxed text-gray-700">{t.quote}</p>
                {t.author && <p className="mt-4 text-sm font-bold text-gray-900">— {t.author}</p>}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
