// components/sections/AboutHeroSection.tsx
//
// Parte de arriba de la página "Nosotros", con la forma de la
// referencia (EstatePro "Crafting your property success story"):
// título + 3 cifras grandes a la izquierda, párrafo + una fila de
// "insignias" a la derecha, y debajo una foto grande de ancho
// completo.
//
// Adaptaciones a contenido real (nada inventado que no se pueda
// sostener):
// - El título y el párrafo vienen de Sanity (aboutPage.title /
//   aboutPage.description), con un texto por defecto si todavía no
//   se cargó nada ahí.
// - En vez de "Satisfaction rate 99% / Happy clients 15K / Expert
//   agents 45+" (métricas de negocio que no tenemos), se muestran 3
//   datos que SÍ podemos sostener hoy sin inventar cifras de negocio.
// - La foto de banner de abajo es un placeholder (una foto real ya
//   existente en /public/images) -- se reemplaza subiendo una foto
//   real de una propiedad/lote y cambiando el "src" acá.
import Image from "next/image";
import Container from "@/components/generalUse/container";
import { urlForImage } from "@/lib/sanity/image";

interface AboutHeroStat {
  value?: string;
  label?: string;
}

interface AboutHeroSectionProps {
  lang: string;
  title?: string;
  description?: string;
  stats?: AboutHeroStat[];
  image?: any;
}


const COPY: Record<string, { title: string; description: string; stats: { value: string; label: string }[] }> = {
  es: {
    title: "Nuestra historia, una propiedad a la vez",
    description:
      "En Get a Property creemos que encontrar tu próxima propiedad debe ser simple y transparente. Acompañamos cada búsqueda, en Panamá, con el mismo cuidado desde el primer día.",
    stats: [
      { value: "100%", label: "Transparencia" },
      { value: "3", label: "Tipos de Filtro" },
      { value: "0", label: "Letra pequeña" },
    ],
  },
  en: {
    title: "Our story, one property at a time",
    description:
      "At Get a Property, we believe finding your next property should be simple and transparent. We support every search in Panama with the same care since day one.",
    stats: [
      { value: "100%", label: "Transparency" },
      { value: "3", label: "Filter Types" },
      { value: "0", label: "Fine Print" },
    ],
  },
};

export default function AboutHeroSection({ lang, title, description, stats, image }: AboutHeroSectionProps) {
  const t = COPY[lang] || COPY.es;
  const finalStats = stats && stats.length > 0 ? stats : t.stats;
  const bannerImage = image ? urlForImage(image) : null;
  const bannerAlt =
    image?.alt || (lang === "es" ? "Get a Property — bienes raíces en Panamá" : "Get a Property — real estate in Panama");

  return (
    <Container large alt className="pt-10 pb-16 md:pt-14 md:pb-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Título + cifras */}
        <div>
          <h1 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
            {title || t.title}
          </h1>

          <div className="mt-10 flex flex-wrap gap-10">
            {finalStats.map((stat, index) => (
              <div key={stat.label || index}>
                <p className="text-sm font-semibold text-black/50">{stat.label}</p>
                <p className="mt-1 text-4xl font-extrabold text-black sm:text-5xl">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="lg:pt-2">
          <p className="max-w-lg text-base leading-relaxed text-black/60 sm:text-lg">
            {description || t.description}
          </p>
        </div>
      </div>

      {/* Foto de banner: real de Sanity (aboutPage.heroImage) si se
          cargó una; si no, la foto de respaldo que ya tenía la página. */}
      <div className="relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gray-100 sm:aspect-[21/9]">
        <Image
          src={bannerImage?.src || "/images/lotes-frente-playa.webp"}
          alt={bannerAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </Container>
  );
}
