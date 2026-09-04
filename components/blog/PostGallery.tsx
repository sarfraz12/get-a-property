// components/blog/PostGallery.tsx
//
// Foto principal + galería secundaria de la página de un post
// (app/(website)/[lang]/[category]/post/[slug]/postHome.js), ahora con
// un lightbox: al hacer click/tap en cualquier foto (la principal o
// cualquiera de la fila de miniaturas) se abre esa misma foto
// maximizada en overlay, con flechas para pasar a la siguiente/
// anterior, contador "X / Y", cierre con el botón, con Escape, o
// tocando afuera de la foto, y swipe horizontal en móvil para navegar.
//
// Se extrajo a su propio Client Component ("use client") en vez de
// convertir todo postHome.js (que es un Server Component grande) --
// así el resto de la página sigue renderizando en el servidor igual
// que antes, y sólo esta pieza puntual necesita interactividad.
//
// Mantiene EXACTAMENTE el mismo layout/estilos que ya tenía esta
// sección (foto principal aspect-[16/10] sm:aspect-[21/9] con esquinas
// grandes, galería grid-cols-3 sm:grid-cols-6 con miniaturas
// cuadradas) -- lo único nuevo es que ahora son clickeables y abren el
// lightbox.
"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface GalleryImage {
  // NUEVO: cada ítem de la galería ahora puede ser una foto (de
  // siempre) o un video (ver lib/sanity/schemas/post.js -> gallery,
  // mismo patrón que el carrusel del Hero -- hero.tsx). "src" es la
  // foto en sí para mediaType "image", o la portada OPCIONAL para
  // mediaType "video" (puede no venir -- ver renderMediaThumb más
  // abajo, que ahí usa el propio <video> como miniatura).
  mediaType?: "image" | "video";
  src?: string;
  videoUrl?: string;
  videoMimeType?: string;
  alt?: string;
  key?: string | number;
}

interface PostGalleryProps {
  mainImage?: GalleryImage | null;
  gallery?: GalleryImage[];
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-7 sm:w-7">
      <path d="M8 5.14v13.72c0 .8.87 1.29 1.56.87l10.99-6.86a1 1 0 0 0 0-1.7L9.56 4.27A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

// Miniatura de un ítem de galería, foto O video (grilla y foto
// principal comparten esta misma lógica). Un video sin portada
// cargada usa el video mismo como miniatura (pausado, silencioso,
// primer frame) en vez de quedar sin imagen -- siempre con el ícono
// de "play" encima para que quede claro que es un video y no una foto.
function MediaThumb({ item, className }: { item: GalleryImage; className: string }) {
  const isVideo = item.mediaType === "video";

  if (isVideo) {
    return (
      <>
        {item.src ? (
          <Image src={item.src} alt={item.alt || "Video"} fill sizes="(max-width: 640px) 33vw, 16vw" className={className} />
        ) : item.videoUrl ? (
          <video
            src={item.videoUrl}
            muted
            playsInline
            preload="metadata"
            className={`h-full w-full ${className}`}
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white transition-colors group-hover:bg-black/35">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <PlayIcon />
          </span>
        </span>
      </>
    );
  }

  return item.src ? (
    <Image src={item.src} alt={item.alt || ""} fill sizes="(max-width: 640px) 33vw, 16vw" className={className} />
  ) : null;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
      />
    </svg>
  );
}

// Distancia mínima de swipe (px) para contar como "pasar de foto" en
// vez de un toque/scroll accidental.
const SWIPE_THRESHOLD = 40;

export default function PostGallery({ mainImage, gallery = [] }: PostGalleryProps) {
  // Una sola lista combinada (principal + secundarias) para que el
  // lightbox pueda navegar entre TODAS las fotos del post con las
  // mismas flechas, sin importar desde cuál se abrió.
  const allImages: GalleryImage[] = [
    ...(mainImage ? [mainImage] : []),
    ...gallery,
  ].filter((item) => item?.src || item?.videoUrl);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current - 1 + allImages.length) % allImages.length));
  }, [allImages.length]);
  const showNext = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current + 1) % allImages.length));
  }, [allImages.length]);

  // Bloquea el scroll del body mientras el lightbox está abierto
  // (mismo recurso que ya usa el menú móvil del navbar), y agrega
  // soporte de teclado: Escape cierra, flechas izq/der navegan.
  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [openIndex, close, showPrev, showNext]);

  if (allImages.length === 0) return null;

  const activeImage = openIndex !== null ? allImages[openIndex] : null;

  return (
    <>
      {/* Foto principal -- mismo tamaño/estilo de siempre, ahora clickeable */}
      {mainImage && (
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          aria-label={mainImage.alt || "Ampliar foto"}
          className="group relative mt-12 aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-gray-100 sm:aspect-[21/9]"
        >
          <MediaThumb item={mainImage} className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        </button>
      )}

      {/* Fotos secundarias -- mismo grid de siempre, cada una clickeable */}
      {gallery.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {gallery.map((img, index) => (
            <button
              type="button"
              key={img.key ?? index}
              onClick={() => setOpenIndex(index + (mainImage ? 1 : 0))}
              aria-label={img.alt || "Ampliar foto"}
              className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-gray-100"
            >
              <MediaThumb item={img} className="object-cover transition-transform duration-300 group-hover:scale-105" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox: overlay a pantalla completa, funciona igual en
          desktop (flechas + click afuera + Escape) y en móvil (mismos
          botones más grandes al tacto, + swipe horizontal).
          BUG REAL encontrado y corregido: con "fixed inset-0" a secas
          esto se veía cortado/mal posicionado, porque esta página usa
          animaciones de scroll (translate-y + opacity) en varios
          ancestros -- un elemento con "transform" crea su propio
          "containing block", así que cualquier descendiente con
          position:fixed queda atado a ESE ancestro en vez de a la
          ventana real del navegador. La solución estándar es un
          portal: renderizar el overlay directo en document.body, fuera
          del árbol de esos ancestros, para que "fixed" sí cubra toda
          la pantalla sin importar qué tenga transform más arriba. */}
      {activeImage && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const deltaX = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
            if (deltaX > SWIPE_THRESHOLD) showPrev();
            else if (deltaX < -SWIPE_THRESHOLD) showNext();
            setTouchStartX(null);
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <CloseIcon />
          </button>

          {allImages.length > 1 && (
            <p className="absolute left-1/2 top-4 z-10 -translate-x-1/2 text-sm font-semibold text-white/70 sm:top-6">
              {openIndex! + 1} / {allImages.length}
            </p>
          )}

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronIcon direction="left" />
            </button>
          )}

          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Siguiente foto"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronIcon direction="right" />
            </button>
          )}

          {/* relative + onClick stopPropagation: tocar la FOTO no cierra
              el lightbox, sólo tocar el fondo oscuro alrededor. */}
          <div
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {activeImage.mediaType === "video" && activeImage.videoUrl ? (
              <video
                key={activeImage.videoUrl}
                src={activeImage.videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              >
                {activeImage.videoMimeType && <source src={activeImage.videoUrl} type={activeImage.videoMimeType} />}
              </video>
            ) : (
              activeImage.src && (
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt || ""}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              )
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
