// components/cards/ctaCard.tsx
//
// Tarjeta de llamado a la acción (imagen + texto + botón), usada dos
// veces en la home. Antes usaba colores índigo que no pertenecían a la
// paleta de marca; ahora usa el dorado de marca para el "eyebrow" y un
// botón negro en píldora, igual al resto de botones primarios del sitio.
//
// Placeholders agregados esta sesión:
// - BUG REAL corregido: si Sanity no traía imagen, el componente hacía
//   `src={image || "/"}` -- "/" NO es una imagen válida para
//   next/image (rompe en tiempo de ejecución / 404). Ahora cae en un
//   panel de marca genérico (/images/placeholder-hero-1.jpg; no es
//   foto de producto real -- no había ninguna disponible en el sitio
//   sin inventar contenido, ver nota en hero.tsx).
// - title / subTitle / description / buttonMessage: si vienen vacíos
//   desde Sanity, se usa un copy de respaldo en español/inglés (antes
//   quedaban en blanco: un "eyebrow" vacío, un link sin texto, etc.).
//   Para poder mostrar ese copy bilingüe se agregó la prop `lang`
//   (antes este componente no la recibía).
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface CtaCardProps {
  title?: string;
  subTitle?: string;
  description?: string;
  buttonMessage?: string;
  buttonLink?: string;
  imageAlt?: string;
  image?: string | any;
  lang?: string;
}

const DEFAULT_COPY: Record<
  string,
  { title: string; subTitle: string; description: string; buttonMessage: string }
> = {
  es: {
    title: "Get a Property",
    subTitle: "Descubre más sobre nuestras propiedades en Panamá",
    description: "Conoce nuestro catálogo, nuestro proceso y todo lo que hace especial a Get a Property.",
    buttonMessage: "Conocer más",
  },
  en: {
    title: "Get a Property",
    subTitle: "Discover more about our properties in Panama",
    description: "Learn about our catalog, our process, and everything that makes Get a Property special.",
    buttonMessage: "Learn more",
  },
};

const DEFAULT_IMAGE = "/images/placeholder-hero-1.jpg";

export default function CtaCard({
  title,
  subTitle,
  description,
  buttonMessage,
  buttonLink,
  imageAlt,
  image,
  lang = "es",
}: CtaCardProps) {
  const defaults = DEFAULT_COPY[lang] || DEFAULT_COPY.es;

  const finalTitle = title || defaults.title;
  const finalSubTitle = subTitle || defaults.subTitle;
  const finalDescription = description || defaults.description;
  const finalButtonMessage = buttonMessage || defaults.buttonMessage;
  const finalImage = image || DEFAULT_IMAGE;

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:bg-gray-900">
      <div className="md:flex">
        {/* Imagen */}
        <div className="relative h-48 md:h-auto md:w-56 md:flex-shrink-0">
          <Image className="object-cover" fill src={finalImage} alt={imageAlt || finalTitle || "CTA image"} />
        </div>

        {/* Texto + botón */}
        <div className="p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{finalTitle}</p>
          <Link
            href={buttonLink || "#"}
            className="mt-1 block text-lg font-bold leading-tight text-black hover:underline dark:text-white"
          >
            {finalSubTitle}
          </Link>
          <p className="mt-2 text-sm text-gray-500">{finalDescription}</p>

          <Link
            href={buttonLink || "#"}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-85"
          >
            {finalButtonMessage}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
