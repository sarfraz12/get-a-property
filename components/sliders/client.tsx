// components/sliders/client.tsx
//
// Carrusel horizontal en loop ("marquee") de logos/imágenes de
// clientes. Actualmente NO se usa en ninguna página del sitio (no
// tiene ningún import activo) -- se deja disponible por si se agrega
// una sección de "clientes" o "marcas confían en nosotros" más
// adelante, pero no forma parte del flujo actual del sitio.

import React from "react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

interface ClientImages {
    title?: string;
    imageAlt?: string;
    image?: string;
    _key?: string;

}

interface ClientSliderProps {
    lang: string;
    dataImage: ClientImages[];
  }

export default function ClientSlider ({lang, dataImage}:ClientSliderProps ) {

    
    return (
        <section className="px-6 py-4">
            
            <div className="overflow-hidden">
                <div className="flex space-x-8 animate-marquee">
                    {/* Duplicate the logos for infinite scroll effect */}
                    {dataImage.concat(dataImage).map((logo: ClientImages, index: number) => (
                        <div key={index} className="flex-shrink-0 w-40 h-14">
                            <div className="relative w-full h-full">
                                <Image
                                    // Mismo bug que se corrigió en infiniteSlider.tsx:
                                    // urlForImage() devuelve {src,width,height}, y
                                    // pasarlo entero como "src" junto con "fill" rompe
                                    // en tiempo de ejecución (next/image no permite
                                    // mezclar "fill" con width/height). Además, si la
                                    // imagen no existe, se cae en un logo real del sitio
                                    // en vez de la ruta inválida "/".
                                    // Nota: este componente no está importado en
                                    // ningún lado hoy (quedó reemplazado por
                                    // infiniteSlider.tsx) -- se corrige igual por si se
                                    // vuelve a usar más adelante.
                                    src={urlForImage(logo.image)?.src || "/images/logo.jpg"}
                                    alt={logo.imageAlt || "Get a Property"}
                                    fill
                                    style={{ objectFit: "cover" }} 
                                    className="grayscale brightness-0 dark:invert dark:brightness-100"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
