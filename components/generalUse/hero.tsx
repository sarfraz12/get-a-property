// components/generalUse/hero.tsx
//
// Hero de la home. Es la sección que ya más se parecía al estilo
// "real estate" de referencia (título gigante + carrusel con una
// píldora de filtros flotando encima), así que se deja la lógica tal
// cual (carrusel con autoplay, teclado, pausa on-hover, dots) y solo
// se ordena el espaciado usando el <Container> compartido, para que
// quede alineado con el resto de secciones de la página.
//
// AUDITORÍA de esta sesión (placeholders/valores por defecto para
// cuando el campo de Sanity viene vacío):
//
// 1) BUG REAL encontrado y corregido: el componente esperaba un
//    arreglo `slides` (para el carrusel), pero el schema de Sanity
//    (lib/sanity/schemas/landingPage.js -> hero) sólo tenía
//    "backgroundImage" y "productImage" (una sola imagen cada uno) --
//    el campo "slides" no existía. Es decir, el carrusel del hero
//    NUNCA podía mostrar fotos reales desde Sanity, sin importar qué
//    cargara el editor. Se agregó el campo "slides" al schema (ver
//    ese archivo) y acá se arma la lista final de slides con esta
//    prioridad:
//      a) slides[] de Sanity, si tiene al menos 1 imagen
//      b) si no, backgroundImage + productImage (los campos viejos),
//         los que existan
//      c) si tampoco hay nada, 3 fotos genéricas que ya están en
//         /public/images (mismo criterio que se usó en el resto del
//         sitio esta sesión: placeholders reales del sitio, no fotos
//         inventadas), sólo para que el carrusel nunca se vea vacío.
// 2) título / descripción / texto del botón: si vienen vacíos desde
//    Sanity, se usa un copy de respaldo en español/inglés en vez de
//    quedar en blanco.
// 3) BUG REAL encontrado y corregido: el botón del hero ignoraba por
//    completo el campo "buttonLink" de Sanity -- el link siempre
//    apuntaba a "/{lang}/all" sin importar lo que cargara el editor.
//    Ahora respeta buttonLink cuando existe, y sólo usa "/{lang}/all"
//    como respaldo.
// 4) Los filtros (Ubicación/Categoría/Certificación) del hero navegan
//    a la combinación de categorías reales elegida (ver HeroFilters
//    más abajo y lib/categoryFilters.ts).
// 6) Tipografía del H1 / descripción ajustada para calcar la referencia
//    (EstatePro "Discover your dream home with us"): mismo font-family
//    (Poppins, ya cargada en todo el sitio), pero más pesada
//    (font-black en vez de font-extrabold), más grande en pantallas
//    grandes (hasta lg:text-8xl) y con interlineado más apretado
//    (leading-[0.95] en vez de 1.05) para que las dos líneas del
//    título queden tan juntas como en la referencia. El mismo ajuste
//    (peso + interlineado apretado) se aplicó también a los otros H1
//    "banner" del sitio -- contact.js, categoryPosts.js y
//    AboutHeroSection.tsx -- para que todos los títulos grandes del
//    sitio se vean parte de la misma familia visual.
// 5) "title" / "description" / "buttonText" / "buttonLink" (las 4
//    props principales de este componente) ahora las arma
//    app/(website)/[lang]/home.js con los campos GENERALES de
//    "landingPage" (schema: grupo "Generales" -> title / description /
//    buttonText / buttonLink), no con landing.hero[0].*. buttonLink es
//    bilingüe (a diferencia del buttonLink viejo del arreglo "hero",
//    que era un solo texto para los dos idiomas) porque un link
//    interno necesita el prefijo de idioma correcto (/es/... vs
//    /en/...). Si se deja vacío, sigue aplicando el respaldo de
//    siempre: "/{lang}/all". El resto de las props (slides,
//    backgroundImage, productImage, filters) sigue viniendo del primer
//    item del arreglo "hero", igual que antes.
// 7) NUEVO: cada slide del carrusel ahora puede ser una IMAGEN o un
//    VIDEO (schema: landingPage.js -> hero.slides.mediaType). El video
//    se reproduce automático, en silencio y en loop mientras su slide
//    está visible -- ver isUsableVideo(), el <video> dentro de
//    HeroCarousel, y el useEffect que reproduce sólo el video del
//    slide activo (el resto queda pausado, aunque siga montado en el
//    DOM por el crossfade). La URL del video ya viene resuelta desde
//    Sanity (lib/sanity/groq.js -> "videoUrl": video.asset->url), acá
//    no se procesa ningún _ref de archivo.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { useRouter } from "next/navigation";
import Container from "@/components/generalUse/container";
import {
  FILTER_GROUP_ORDER,
  FILTER_GROUP_META,
  buildFilterQueryString,
  emptySelection,
  getCategorySlug,
  type CategoryGroups,
  type CategoryType,
  type FilterGroupKey,
} from "@/lib/categoryFilters";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type HeroSlide = {
  image: any; // objeto de imagen de Sanity, O un string (ruta local /images/...)
  alt?: string;
  // NUEVO: un slide puede ser una imagen (por defecto) o un video que
  // se autoreproduce en loop/silencio mientras está visible -- ver
  // lib/sanity/schemas/landingPage.js -> hero.slides.mediaType.
  // "videoUrl" ya viene resuelto desde Sanity (lib/sanity/groq.js ->
  // video.asset->url), no hace falta procesarlo acá.
  mediaType?: "image" | "video";
  videoUrl?: string;
  videoMimeType?: string;
  videoPoster?: any; // objeto de imagen de Sanity, opcional
  // NUEVO: si el slide viene de Sanity con 1 o más categorías
  // vinculadas (schema: landingPage.js -> hero.slides.categories), la
  // foto del carrusel se vuelve clickeable y lleva a esa COMBINACIÓN
  // exacta de filtros (misma lógica que la píldora de arriba -- ver
  // lib/categoryFilters.ts).
  categories?: Array<{ slug?: string; title?: string; categoryType?: CategoryType | null }>;
};

type HeroProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  slides?: any[]; // crudo desde Sanity (array de imágenes con "alt" opcional)
  backgroundImage?: any; // respaldo viejo, por si "slides" está vacío
  productImage?: any; // respaldo viejo, por si "slides" está vacío
  // NUEVO: categorías reales (agrupadas por Ubicación / Propiedad /
  // Oferta -- ver lib/categoryFilters.ts) para armar los filtros del
  // Hero. Las arma app/(website)/[lang]/home.js a partir de los posts
  // ya cargados. Si no hay ninguna categoría real todavía, el Hero
  // simplemente no muestra ningún filtro (nada decorativo/inventado).
  categoryGroups?: CategoryGroups;
  autoPlayInterval?: number; // ms, 0 desactiva el autoplay
  lang: string; // idioma activo, para armar el link "ver todo" (/{lang}/all)
};

// Copy de respaldo del hero (título / descripción / botón), sólo se
// usa si esos campos vienen vacíos desde Sanity.
const DEFAULT_COPY: Record<string, { title: string; description: string; buttonText: string }> = {
  es: {
    title: "Bienes raíces en\nPanamá",
    description:
      "Encuentra casas, apartamentos, terrenos y propiedades en venta y alquiler en Panamá. Descubre oportunidades inmobiliarias con Get a Property.",
    buttonText: "Ver propiedades",
  },
  en: {
    title: "Real estate in\nPanama",
    description:
      "Find houses, apartments, land, and properties for sale and rent in Panama. Discover real estate opportunities with Get a Property.",
    buttonText: "View properties",
  },
};

// Placeholder usado como último respaldo cuando no hay NINGUNA imagen
// cargada en Sanity (ni "slides" ni los campos viejos
// backgroundImage/productImage): una foto real ya existente en
// /public/images, lista para reemplazarse por más fotos reales en
// cuanto se suban "slides" en Sanity.
const PLACEHOLDER_SLIDES: Record<string, HeroSlide[]> = {
  es: [
    { image: "/images/lotes-frente-playa.webp", alt: "Lotes disponibles frente al mar — Get a Property" },
  ],
  en: [
    { image: "/images/lotes-frente-playa.webp", alt: "Beachfront lots available — Get a Property" },
  ],
};

// Rutas locales viejas que quedaron cargadas como texto plano en
// backgroundImage/productImage de algún documento (de una plantilla
// anterior), y que ya NO son imágenes válidas para mostrar (son un
// logo duplicado y un flyer de retailers -- ver notas de sesión en
// ctaCard.tsx). Si un documento trae alguna de estas, se tratan como
// "sin imagen" para que el Hero caiga en los placeholders de verdad.
const INVALID_LEGACY_IMAGE_PATHS = new Set([
  "/images/ghee-banner.jpg",
  "/images/asset.jpg",
  "/images/asset-2.jpg",
  "/images/logo.jpg",
]);

function isUsableImage(image: any): boolean {
  if (!image) return false;
  if (typeof image === "string") return !INVALID_LEGACY_IMAGE_PATHS.has(image);
  return true; // objeto de imagen de Sanity: se asume válido
}

// Un slide de video es "usable" si tiene mediaType "video" Y una URL
// resuelta (lib/sanity/groq.js -> "videoUrl": video.asset->url) --
// si el editor eligió "Video" pero todavía no subió el archivo, no
// hay nada que reproducir.
function isUsableVideo(raw: any): boolean {
  return Boolean(raw && typeof raw === "object" && raw.mediaType === "video" && raw.videoUrl);
}

/* ------------------------------------------------------------------ */
/*  Icons (inline, sin dependencia de un paquete de íconos)            */
/* ------------------------------------------------------------------ */

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.25} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.25} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.25} stroke="currentColor" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FilterIcon({ type }: { type: "location" | "property" | "status" }) {
  const common = { viewBox: "0 0 24 24", fill: "none", strokeWidth: 2, stroke: "currentColor", className: "h-4 w-4" };
  if (type === "location") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.1 7-11.2A7 7 0 0 0 5 9.8C5 14.9 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "property") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 10v9.5a1 1 0 0 0 1 1H9V16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4.5h2.5a1 1 0 0 0 1-1V10" />
      </svg>
    );
  }
  // status / price
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M14.5 9.3c0-1-1-1.8-2.5-1.8s-2.5.9-2.5 2 1 1.6 2.5 1.9c1.5.3 2.5.9 2.5 2s-1 2-2.5 2-2.5-.8-2.5-1.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Filtros REALES del Hero (Ubicación / Propiedad / Oferta)           */
/*                                                                      */
/*  Reemplaza la píldora decorativa que había antes (ver nota #4 vieja  */
/*  del encabezado, ya no aplica). Cada grupo sólo se muestra si hay    */
/*  al menos 1 categoría real de Sanity con ese "categoryType" -- si    */
/*  el proyecto todavía no tiene ninguna categoría cargada (caso        */
/*  actual), no se muestra NINGÚN filtro, en vez de mostrar opciones    */
/*  inventadas. Selección múltiple dentro de cada grupo (checkboxes);   */
/*  al buscar, navega a /{lang}/all con la selección como query params  */
/*  (ver lib/categoryFilters.ts), donde categoryPosts.js la vuelve a    */
/*  leer para filtrar la lista de posts.                                */
/* ------------------------------------------------------------------ */

function HeroFilters({ categoryGroups, lang }: { categoryGroups?: CategoryGroups; lang: string }) {
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState<FilterGroupKey | null>(null);
  const [selection, setSelection] = useState(emptySelection());
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cierra el dropdown abierto si se hace click afuera de la píldora.
  useEffect(() => {
    if (!openGroup) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openGroup]);

  const activeGroups = FILTER_GROUP_ORDER.filter((key) => (categoryGroups?.[key]?.length || 0) > 0);
  if (!activeGroups.length) return null; // sin categorías reales todavía: no se muestra nada

  // CORRECCIÓN del cliente: ya no hay botón de "Buscar" -- cada opción
  // que se toca navega DE INMEDIATO al filtro correspondiente (ver
  // referencia enviada). "selection" se sigue llevando en este
  // componente sólo para poder ARMAR la combinación completa en la
  // URL (ej. tocar "Coronado" y después, sin recargar, "Casa" navega
  // con los dos); una vez que la navegación ocurre, la página de
  // destino (/{lang}/all) toma la posta con sus propios chips de
  // filtro (ver categoryPosts.js), donde el usuario sigue eligiendo la
  // combinación que prefiera.
  // BUG REAL corregido: antes esto llamaba router.push(...) DENTRO
  // de la función "updater" de setSelection((prev) => {...}). React
  // puede invocar esa función updater durante el render (o más de una
  // vez), así que hacer una navegación ahí adentro es un efecto
  // secundario fuera de lugar -- disparaba la advertencia "Cannot
  // update a component (Router) while rendering a different component
  // (HeroFilters)" en la consola. Ahora se calcula la nueva selección
  // primero, se guarda con setSelection, y router.push se llama
  // después, como un evento normal del click -- mismo comportamiento
  // (navega de inmediato al tocar una opción), sin el efecto
  // secundario durante el render.
  const toggleValue = (key: FilterGroupKey, slug: string) => {
    const current = selection[key];
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    const updated = { ...selection, [key]: next };
    setSelection(updated);
    const query = buildFilterQueryString(updated);
    router.push(`/${lang}/all${query ? `?${query}` : ""}`);
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-4 top-4 z-10 hidden max-w-[calc(100%-2rem)] items-center gap-1 rounded-full bg-white/95 px-2 py-2 shadow-lg backdrop-blur-sm sm:flex md:right-8 md:top-8"
    >
      {activeGroups.map((key) => {
        const meta = FILTER_GROUP_META[key];
        const options = categoryGroups?.[key] || [];
        const count = selection[key].length;
        const isOpen = openGroup === key;
        return (
          <div key={key} className="relative">
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : key)}
              className={
                "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-black/5 " +
                (count ? "bg-black/5" : "")
              }
              aria-expanded={isOpen}
            >
              <FilterIcon type={meta.icon} />
              {meta.label[lang === "en" ? "en" : "es"]}
              {count > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
              <ChevronDownIcon />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 max-h-64 w-56 overflow-y-auto rounded-2xl bg-white p-2 text-left shadow-xl ring-1 ring-black/5">
                {options.map((category) => {
                  const slug = getCategorySlug(category);
                  if (!slug) return null;
                  const checked = selection[key].includes(slug);
                  return (
                    <label
                      key={slug}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-black hover:bg-black/5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleValue(key, slug)}
                        className="h-4 w-4 rounded border-black/30 accent-black"
                      />
                      {category.title || slug}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resuelve el src de un slide, sea imagen de Sanity o ruta local     */
/*  (los placeholders de respaldo son rutas locales tipo               */
/*  "/images/asset.jpg", que urlForImage() no sabe procesar).          */
/* ------------------------------------------------------------------ */

function resolveSlideImageProps(image: any): { src: string } {
  // OJO: acá sólo se devuelve "src" (nunca width/height). El carrusel
  // usa la prop "fill" en el <Image> de abajo (para que la foto llene
  // el contenedor de altura fija), y next/image no permite mezclar
  // "fill" con "width"/"height" al mismo tiempo -- si se le pasan los
  // dos, tira: 'Image with src "..." has both "width" and "fill"
  // properties. Only one should be used.' urlForImage() devuelve
  // {src, width, height}, así que hay que quedarse sólo con el src.
  if (typeof image === "string") return { src: image };
  const resolved = urlForImage(image);
  return { src: resolved?.src || "" };
}

/* ------------------------------------------------------------------ */
/*  Carrusel de imágenes del hero                                      */
/* ------------------------------------------------------------------ */

function HeroCarousel({
  slides,
  categoryGroups,
  lang,
  autoPlayInterval = 6000,
}: {
  slides: HeroSlide[];
  categoryGroups?: CategoryGroups;
  lang: string;
  autoPlayInterval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // NUEVO: en cuanto alguien navega el carrusel a mano (flechas,
  // puntos de paginación o teclado), el autoplay se apaga DEFINITIVO
  // para ese carrusel -- ya no debe "robarle" el slide que la persona
  // eligió ver. goTo() es la única función que mueve el índice por una
  // acción manual (el autoplay usa su propio setIndex, ver más abajo),
  // así que ahí es donde se marca la interacción.
  const [userInteracted, setUserInteracted] = useState(false);
  const count = slides?.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Un <video> por slide de tipo video (los slides de imagen dejan su
  // posición en null). Se usan para reproducir SOLO el video del slide
  // activo -- todos los slides quedan montados en el DOM a la vez
  // (crossfade por opacity, ver más abajo), así que sin esto cada
  // video de fondo estaría reproduciéndose aunque no se vea.
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const goTo = useCallback(
    (i: number) => {
      if (!count) return;
      setUserInteracted(true);
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay: avanza solo si hay más de 1 slide, el usuario no está
  // pasando el mouse encima, Y todavía no navegó el carrusel a mano
  // (ver "userInteracted" arriba) -- una vez que hace click en una
  // flecha o un punto, el carrusel queda 100% manual de ahí en más.
  useEffect(() => {
    if (!autoPlayInterval || paused || userInteracted || !count || count <= 1) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlayInterval, paused, userInteracted, count]);

  // Navegación con flechas del teclado cuando el carrusel tiene foco
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // Reproduce el video del slide activo y pausa (+ rebobina) el resto,
  // para que cada video arranque de nuevo la próxima vez que se
  // muestre su slide.
  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index) {
        const playPromise = el.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            // Autoplay bloqueado por el navegador (raro, ya que va
            // muted): no rompe nada, el video queda pausado en su
            // primer frame / poster.
          });
        }
      } else {
        el.pause();
        try {
          el.currentTime = 0;
        } catch {
          // no-op
        }
      }
    });
  }, [index, slides]);

  if (!count) return null;

  return (
    <div
      className="group relative w-full overflow-hidden rounded-3xl bg-black/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero images"
      tabIndex={0}
    >
      {/* Slides */}
      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[640px]">
        {slides?.map((slide, i) => {
          const isVideoSlide = slide.mediaType === "video" && Boolean(slide.videoUrl);
          const posterSrc = resolveSlideImageProps(slide.videoPoster)?.src || undefined;
          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
              aria-hidden={i !== index}
            >
              {isVideoSlide ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  poster={posterSrc}
                  aria-label={slide.alt || `Slide ${i + 1}`}
                >
                  <source src={slide.videoUrl} type={slide.videoMimeType || "video/mp4"} />
                </video>
              ) : (
                <Image
                  {...(resolveSlideImageProps(slide.image) as ImageProps)}
                  alt={slide.alt || `Slide ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              {/* CORRECCIÓN del cliente: la foto/video del carrusel NO
                  es un link a una categoría -- la navegación pasa
                  ÚNICA Y EXCLUSIVAMENTE por los botones de arriba
                  (HeroFilters). "categories" en el slide (Sanity:
                  hero.slides.categories) sigue existiendo como dato
                  del slide, pero ya no se usa para armar un link acá. */}
            </div>
          );
        })}
      </div>

      {/* Degradado para que la píldora de filtros se lea sobre la imagen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/25 to-transparent" />

      {/* Píldora flotante de filtros: ahora con categorías REALES de Sanity
          (Ubicación / Propiedad / Oferta), no decorativa -- ver HeroFilters arriba. */}
      <HeroFilters categoryGroups={categoryGroups} lang={lang} />

      {/* Flechas prev/next */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-md transition-all duration-200 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 md:left-5"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-md transition-all duration-200 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 md:right-5"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* Puntos de paginación */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={
                "h-2.5 rounded-full transition-all duration-300 " +
                (i === index ? "w-6 bg-black" : "w-2.5 bg-black/25 hover:bg-black/40")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero({
  title,
  description,
  buttonText,
  buttonLink,
  slides,
  backgroundImage,
  productImage,
  categoryGroups,
  autoPlayInterval = 3000,
  lang,
}: HeroProps) {
  const defaults = DEFAULT_COPY[lang] || DEFAULT_COPY.es;

  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalButtonText = buttonText || defaults.buttonText;
  const finalButtonLink = buttonLink || `/${lang}/all`;

  // Prioridad de imágenes del carrusel: slides[] real de Sanity ->
  // backgroundImage/productImage (campos viejos) -> placeholders
  // locales. Ver nota #1 en el encabezado del archivo.
  const usableBackground = isUsableImage(backgroundImage) ? backgroundImage : null;
  const usableProduct = isUsableImage(productImage) ? productImage : null;

  // Cada item de "slides" ahora es un objeto { image, alt, categories }
  // (ver lib/sanity/schemas/landingPage.js -> hero.slides -- categories
  // es un arreglo, selección múltiple). Se soporta también la forma
  // vieja (el item ES la imagen directamente) por si quedara algún
  // documento con esa forma -- no debería haber ninguno (no había
  // fotos cargadas en este campo todavía), pero así no se rompe nada
  // si llegara a existir.
  const normalizedSanitySlides = (slides || [])
    .map((raw: any) => {
      const hasImageField = raw && typeof raw === "object" && "image" in raw;
      const video = isUsableVideo(raw);
      const image = hasImageField ? raw.image : raw;
      // Un slide de video no necesita imagen -- sólo se exige
      // isUsableImage() para slides de imagen (el caso de siempre).
      if (!video && !isUsableImage(image)) return null;
      return {
        image: video ? undefined : image,
        alt: (hasImageField ? raw.alt : undefined) as string | undefined,
        categories: hasImageField ? raw.categories : undefined,
        mediaType: video ? ("video" as const) : ("image" as const),
        videoUrl: video ? raw.videoUrl : undefined,
        videoMimeType: video ? raw.videoMimeType : undefined,
        videoPoster: video ? raw.videoPoster : undefined,
      };
    })
    .filter(Boolean) as {
    image: any;
    alt?: string;
    categories?: Array<{ slug?: string; title?: string; categoryType?: CategoryType | null }>;
    mediaType?: "image" | "video";
    videoUrl?: string;
    videoMimeType?: string;
    videoPoster?: any;
  }[];

  let finalSlides: HeroSlide[] = [];
  if (normalizedSanitySlides.length) {
    finalSlides = normalizedSanitySlides.map((slide, i) => ({
      image: slide.image,
      alt: slide.alt || `${finalTitle} ${i + 1}`,
      categories: slide.categories,
      mediaType: slide.mediaType,
      videoUrl: slide.videoUrl,
      videoMimeType: slide.videoMimeType,
      videoPoster: slide.videoPoster,
    }));
  } else if (usableBackground || usableProduct) {
    finalSlides = [
      usableBackground ? { image: usableBackground, alt: finalTitle } : null,
      usableProduct ? { image: usableProduct, alt: finalTitle } : null,
    ].filter(Boolean) as HeroSlide[];
  } else {
    finalSlides = PLACEHOLDER_SLIDES[lang] || PLACEHOLDER_SLIDES.es;
  }

  return (
    <section className="w-full bg-white">
      <Container alt className="pb-8 pt-14 md:pt-20">
        {/* Encabezado: título grande a la izquierda, descripción + CTA a la derecha */}
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <h1
            style={{ whiteSpace: "pre-line" }}
            className="max-w-3xl text-[2.75rem] font-light leading-[0.95] tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {finalTitle}
          </h1>

          <div className="flex max-w-sm flex-col items-start gap-4 text-left">
            <p className="line-clamp-3 font-bold text-base leading-relaxed text-black/50 sm:text-lg">{finalDescription}</p>
            {finalButtonText && (
              <Link
                href={finalButtonLink}
                className="group inline-flex items-center gap-2 text-base font-bold text-black"
              >
                {finalButtonText}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white">
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Carrusel */}
        <HeroCarousel slides={finalSlides} categoryGroups={categoryGroups} lang={lang} autoPlayInterval={autoPlayInterval} />
      </Container>
    </section>
  );
}
