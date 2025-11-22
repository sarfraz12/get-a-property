// components/Hero.tsx
"use client";

import Image, { type ImageProps } from "next/image";
import { urlForImage } from "@/lib/sanity/image";

type HeroProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  backgroundImage?: any; // Sanity image
  productImage?: any; // Sanity product images
};

export default function FormSlider({
  title,
  description,
  buttonText,
  buttonLink,
  backgroundColor = "#F2F1EC",
  backgroundImage,
  productImage,
}: HeroProps) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 -z-20 bg-center bg-cover"
          style={{
            backgroundImage: `url(${urlForImage(backgroundImage)?.src})`,
          }}
        />
      )}

      {/* Overlay color */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor, opacity: backgroundImage ? 0.5 : 1 }}
      />

      {/* Content wrapper */}
      <div className="relative container mx-auto flex flex-col md:flex-row justify-between items-center gap-10 px-6 md:px-12 py-16">
        {/* LEFT (text + form) */}
        <div className="flex-1 max-w-xl md:mx-10">
          <h1 className="text-3xl md:text-5xl uppercase font-bold leading-tight  mb-6">
            {title}
          </h1>

          <p className="text-lg mb-6">{description}</p>

          {/* FORM */}
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand-dark focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand-dark focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-brand-dark focus:outline-none"
              required
            />

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#E3B57B] text-brand-black font-bold uppercase tracking-wide rounded-md hover:bg-[#d1a36a] transition"
            >
              {buttonText || "¡DESCARGAR!"}
            </button>
          </form>
        </div>

        {/* RIGHT (product image) */}
        <div className="flex-1 flex justify-center">
          {productImage && (
            <div className="relative w-full max-w-md md:h-[500px] rotate-3 drop-shadow-lg">
              <Image
                {...(urlForImage(productImage) as ImageProps)}
                alt="Hero product"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
