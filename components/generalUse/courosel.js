'use client'
import Image from 'next/image'
import { useState } from 'react'
import { urlForImage } from "@/lib/sanity/image"
import { cx } from '@/utils/all'

const Carousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const hasMultiple = images.length > 1
  const hasImages = images.length > 0

  const prevSlide = () => {
    if (!hasMultiple) return
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const nextSlide = () => {
    if (!hasMultiple) return
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  if (!hasImages) return null

  const currentImage = images[currentIndex]

  const getOverlayClass = (overlay) => {
    switch (overlay) {
      case 'white':
        return 'bg-gradient-to-br from-white/50 via-white/70 to-white/30'
      case 'black':
        return 'bg-gradient-to-br from-black/50 via-black/70 to-black/30'
      case 'none':
        return ''
      default:
        return 'bg-gradient-to-br from-black/50 via-black/70 to-black/30'
    }
  }

  return (
    <div className="relative rounded-md overflow-hidden w-full h-[80vh] md:h-[70vh] lg:h-[80vh]">

      <div
        className="relative w-full h-full bg-center bg-cover bg-fixed"
        style={{
          backgroundImage: `url(${
            currentImage?.sliderImage
              ? urlForImage(currentImage.sliderImage).src
              : ''
          })`
        }}
      >
        <div className={`absolute inset-0 ${getOverlayClass(currentImage?.overlay)}`} />

        {/* Content */}
        {currentImage && (
          <div
            role="region"
            aria-label="Carousel Slide Content"
            className="absolute left-1/2 top-0 z-20 transform -translate-x-1/2 w-full max-w-[90%] sm:max-w-4xl p-5 text-center animate-fade-in"
          >
            {currentImage?.sliderTitle && (
              <div
                className={cx(
                  "inline-block w-full sm:w-auto px-4 sm:px-6",
                  "p-5 sm:py-4 rounded-lg mb-4 transition-all duration-700 ease-in-out animate-slide-up",
                  currentImage?.titleOverlayColor === 'white'
                    ? 'bg-white/80 text-black'
                    : currentImage?.titleOverlayColor === 'black'
                    ? 'bg-black/70 text-white'
                    : currentImage?.titleTextColor === 'black'
                    ? 'text-black'
                    : 'text-white'
                )}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight leading-tight">
                  {currentImage.sliderTitle}
                </h2>
              </div>
            )}

            {currentImage?.sliderDescription && (
              <div
                style={{ whiteSpace: 'pre-line' }}
                className={cx(
                  "inline-block px-4 sm:px-6 py-5 sm:py-4 rounded-lg w-full",
                  "sm:w-auto max-w-[90%] sm:max-w-2xl mx-auto transition-all duration-700 ease-in-out",
                  "animate-slide-up delay-150",
                  currentImage?.descriptionOverlayColor === 'white'
                    ? 'bg-white/70 text-black'
                    : currentImage?.descriptionOverlayColor === 'black'
                    ? 'bg-black/60 text-white'
                    : currentImage?.overlay === 'white'
                    ? 'text-black'
                    : 'text-white'
                )}
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  {currentImage.sliderDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Only show navigation if more than 1 image */}
      {hasMultiple && (
        <>
          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute z-20 top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/75 transition"
          >
            &#10094;
          </button>

          <button
            onClick={nextSlide}
            className="absolute z-20 top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/75 transition"
          >
            &#10095;
          </button>

          {/* Dots */}
          <div className="absolute z-20 bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-110'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Carousel