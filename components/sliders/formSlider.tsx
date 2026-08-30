// components/sliders/formSlider.tsx
//
// Bloque final con formulario de contacto rápido + imagen de producto.
// Se mantiene la estructura (fondo con imagen + overlay de color,
// formulario a la izquierda, imagen a la derecha) y se homologan los
// inputs y el botón con el resto del sitio: bordes redondeados grandes
// y botón en píldora dorada (color de marca) en vez del hex suelto que
// había antes.
//
// Nota: este formulario no tiene todavía una función `onSubmit` que
// envíe los datos (ni la tenía antes de este cambio) — solo se ajustó
// el estilo, no se tocó su comportamiento.
"use client";

import Image, { type ImageProps } from "next/image";
import { urlForImage } from "@/lib/sanity/image";

type FormSliderProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  backgroundImage?: any;
  productImage?: any;
};

export default function FormSlider({
  title,
  description,
  buttonText,
  backgroundColor = "#F2F1EC",
  backgroundImage,
  productImage,
}: FormSliderProps) {
  return (
    <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden">
      {/* Imagen de fondo */}
      {backgroundImage && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${urlForImage(backgroundImage)?.src})` }}
        />
      )}

      {/* Capa de color sobre la imagen */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor, opacity: backgroundImage ? 0.5 : 1 }} />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 px-4 py-16 sm:px-6 md:flex-row lg:px-8">
        {/* Texto + formulario */}
        <div className="max-w-xl flex-1">
          <h2 className="mb-6 text-3xl font-extrabold uppercase leading-tight md:text-5xl">{title}</h2>
          <p className="mb-6 text-lg">{description}</p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full rounded-2xl border border-black/15 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full rounded-2xl border border-black/15 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-black/15 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark"
              required
            />

            <button
              type="submit"
              className="w-full rounded-full bg-brand-gold px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-black transition-opacity hover:opacity-85"
            >
              {buttonText || "¡Descargar!"}
            </button>
          </form>
        </div>

        {/* Imagen del producto */}
        <div className="flex flex-1 justify-center">
          {productImage && (
            <div className="relative w-full max-w-md rotate-3 drop-shadow-lg md:h-[500px]">
              <Image {...(urlForImage(productImage) as ImageProps)} alt="Hero product" className="object-contain" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
