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
  const images = [...dataImage, ...dataImage]; // duplicate

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
    <section className="w-full bg-brand-dark dark:bg-brand-gold py-5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {images.map((item: ClientImages, index: number) => (
          <div
            key={index}
            className="inline-flex items-center justify-center px-6"
          >
            {item.image ? (
              <div className="relative w-40 h-12 inline-block">
                <Image
                  src={urlForImage(item.image) || "/"}
                  alt={item.imageAlt || "alt"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-brand-light uppercase tracking-widest text-sm md:text-base whitespace-nowrap">
                {item.title}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
