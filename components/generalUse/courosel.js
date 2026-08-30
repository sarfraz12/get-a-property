// components/generalUse/courosel.js
//
// Carrusel a pantalla completa con overlays de color configurables desde
// Sanity (fondo, título y descripción pueden llevar su propio overlay).
// Se mantiene toda la lógica (prevSlide/nextSlide, overlays dinámicos),
// solo se ajustan esquinas/sombras y el color de los puntos de
// paginación (antes azul genérico, ahora dorado de marca).
"use client";
import Image from "next/image";
import { useState } from "react";
import { urlForImage } from "@/lib/sanity/image";
import { cx } from "@/utils/all";

const Carousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultiple = images.length > 1;
  const hasImages = images.length > 0;

  const prevSlide = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  if (!hasImages) return null;

  const currentImage = images[currentIndex];

  const getOverlayClass = (overlay) => {
    switch (overlay) {
      case "white":
        return "bg-gradient-to-br from-white/50 via-white/70 to-white/30";
      case "black":
        return "bg-gradient-to-br from-black/50 via-black/70 to-black/30";
      case "none":
        return "";
      default:
        return "bg-gradient-to-br from-black/50 via-black/70 to-black/30";
    }
  };

  return (
    <div className="relative h-[100vh] w-full overflow-hidden rounded-3xl sm:h-[65vh] md:h-[70vh] lg:h-[80vh]">
      <div
        className="relative h-full w-full bg-cover bg-center md:bg-fixed"
        style={{
          // Si el slide no tiene imagen cargada en Sanity, se usa una
          // foto genérica del sitio en vez de dejar el fondo vacío
          // (antes: url("") -> sin imagen de fondo, sólo el overlay).
          backgroundImage: `url(${
            currentImage?.sliderImage ? urlForImage(currentImage.sliderImage)?.src : "/images/placeholder-hero-1.jpg"
          })`,
        }}
      >
        <div className={`absolute inset-0 ${getOverlayClass(currentImage?.overlay)}`} />

        {currentImage && (
          <div
            role="region"
            aria-label="Carousel slide content"
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6"
          >
            {currentImage?.sliderTitle && (
              <div
                className={cx(
                  "w-full max-w-full sm:max-w-3xl",
                  "mb-4 rounded-2xl px-6 py-5",
                  "animate-slide-up transition-all duration-700 ease-in-out",
                  currentImage?.titleOverlayColor === "white"
                    ? "bg-white/85 text-black"
                    : currentImage?.titleOverlayColor === "black"
                    ? "bg-black/75 text-white"
                    : currentImage?.titleTextColor === "black"
                    ? "text-black"
                    : "text-white"
                )}
              >
                <h2 className="break-words text-center text-xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-5xl">
                  {currentImage.sliderTitle}
                </h2>
              </div>
            )}

            {currentImage?.sliderDescription && (
              <div
                style={{ whiteSpace: "pre-line" }}
                className={cx(
                  "w-full max-w-full sm:max-w-2xl",
                  "rounded-2xl px-6 py-5",
                  "delay-150 animate-slide-up transition-all duration-700 ease-in-out",
                  currentImage?.descriptionOverlayColor === "white"
                    ? "bg-white/85 text-black"
                    : currentImage?.descriptionOverlayColor === "black"
                    ? "bg-black/70 text-white"
                    : currentImage?.overlay === "white"
                    ? "text-black"
                    : "text-white"
                )}
              >
                <p className="break-words text-center text-sm leading-relaxed sm:text-base md:text-lg lg:text-xl">
                  {currentImage.sliderDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {hasMultiple && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/75 sm:left-4 sm:p-4"
          >
            &#10094;
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/75 sm:right-4 sm:p-4"
          >
            &#10095;
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 cursor-pointer rounded-full transition ${
                  index === currentIndex ? "scale-110 bg-brand-gold" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
