// components/navigation/navbar.tsx
//
// Barra de navegación principal. Se mantiene TODA la lógica original
// (dropdowns de escritorio/móvil, cierre al hacer click afuera o con
// Escape, detección de ruta activa, cambio de idioma, botón "shop").
// Forma: barra blanca PLANA, sin borde ni sombra, que se funde con el
// fondo blanco del hero (así se ve en la referencia EstatePro) — el
// logo a la izquierda, links centrados en semibold, y el CTA como
// píldora negra a la derecha.
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import LangSwitcher from "../generalUse/lang-switcher";
import SmartLink from "@/utils/smartLinks";

/* ------------------------------------------------------------------ */
/*  Icons (inline, no icon package dependency)                        */
/* ------------------------------------------------------------------ */

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      )}
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2.5}
      stroke="currentColor"
      className={cx("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Último respaldo, solo si Settings todavía no tiene NINGUNA imagen
// cargada (ni logo ni Open Graph Image) -- un ícono genérico de pin,
// para que la barra nunca quede sin ícono junto al título.
function PinLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-7 w-7 flex-shrink-0">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-6.1 7-11.2A7 7 0 0 0 5 9.8C5 14.9 12 21 12 21Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9.5v3M14 9.5v3M10 9.5a2 2 0 0 1 4 0" />
    </svg>
  );
}

// Ícono pequeño junto al título, tomado de una imagen real de Settings
// (favicon de modo claro -- este navbar es sobre fondo blanco -- o si
// no hay favicon cargado, el logo, o si tampoco hay logo, la Open
// Graph Image) en vez del pin genérico de arriba. Se usa cuando "Show
// in Nav Bar?" no está activado en el logo (ese toggle sigue
// controlando el logo GRANDE que reemplaza título + ícono, ver abajo).
//
// CORREGIDO (queja del usuario: "el icono... no se aprecia bien...
// mejor que salga el icono sin recortes"): antes este contenedor tenía
// `rounded-full overflow-hidden`, es decir, un recorte circular forzado
// sobre la imagen -- con un ícono que no es perfectamente circular
// (como el logo de barras doradas dentro de un cuadrado redondeado),
// eso cortaba las esquinas/bordes del diseño real. Ahora el contenedor
// NO recorta nada (sin overflow-hidden ni máscara circular): con
// `object-contain` la imagen completa siempre se ve entera, sin
// importar su forma. Se quitó también el fondo blanco/anillo forzados
// (ya no hacen falta sin el recorte circular, y este navbar ya es
// blanco) y se agrandó un poco el tamaño (de 32px a 36px) para que se
// vea mejor y quede mejor alineado en altura con el texto del título.
function BrandIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative h-9 w-9 flex-shrink-0">
      <Image src={src} alt={alt} fill sizes="36px" className="object-contain" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Cierra el dropdown al hacer click afuera o al presionar Escape. */
function useDismiss(onDismiss: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onDismiss]);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */

export default function Navbar({ lang, data, logo, logoalt, faviconLight, faviconDark, openGraphImage, title, shopLink, shopText }: any) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === `/${lang}${href}`;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Elección logo-imagen vs. ícono+texto (Settings -> fieldset "Website
  // Logo"): el editor puede activar "Show in Nav Bar?" en el logo
  // principal, o "Show in Alt Nav Bar?" en el logo alterno (pensado
  // como variación clara/oscura del mismo logo) -- si activó el
  // alterno, ese tiene prioridad. Si NO activó ninguno de los dos, el
  // navbar muestra el título en texto + el ícono de marca (favicon,
  // ver BrandIcon) en vez de una imagen grande.
  const activeLogoImage =
    logoalt?.navbarMenuAlt && urlForImage(logoalt)?.src
      ? logoalt
      : logo?.navbarMenu && urlForImage(logo)?.src
      ? logo
      : null;

  return (
    // sticky + shadow-sm + borde inferior sutil = navbar "flotante" tipo
    // real-estate template, en vez del borde superior negro grueso.
    <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex flex-shrink-0 items-center gap-3 text-black">
            {activeLogoImage ? (
              <Image
                {...(urlForImage(activeLogoImage) as ImageProps)}
                alt={activeLogoImage?.alt || title || "Logo"}
                width={120}
                height={40}
                priority
                className="h-9 w-auto object-contain"
              />
            ) : (
              <>
                {(() => {
                  // Prioridad para el ícono chico junto al título:
                  // favicon de modo claro de Settings (pensado para
                  // este uso exacto) -> favicon de modo oscuro (si sólo
                  // cargaron ese) -> logo real de Settings (aunque "Show
                  // in Nav Bar?" no esté marcado) -> Open Graph Image de
                  // Settings -> pin genérico como último respaldo. Así
                  // el ícono siempre se parece a la marca real en vez de
                  // un pin sin relación con el sitio.
                  const brandSrc =
                    urlForImage(faviconLight)?.src ||
                    urlForImage(faviconDark)?.src ||
                    urlForImage(logo)?.src ||
                    urlForImage(openGraphImage)?.src;
                  return brandSrc ? (
                    <BrandIcon src={brandSrc} alt={title || "Logo"} />
                  ) : (
                    <PinLogoIcon />
                  );
                })()}
                <span className="text-2xl font-extrabold tracking-tight text-black md:text-3xl">
                  {title}
                </span>
              </>
            )}
          </Link>

          {/* Menú de escritorio */}
          <div className="hidden flex-1 items-center justify-center gap-9 md:flex">
            {data.map((item: any, index: number) =>
              item.children?.length > 0 ? (
                <DesktopDropdown key={index} item={item} lang={lang} isActive={isActive} />
              ) : (
                <Link
                  key={index}
                  href={`/${lang}${item.href}`}
                  className={cx(
                    "text-[15px] font-semibold tracking-tight transition-colors",
                    isActive(item.href) ? "text-black" : "text-black/60 hover:text-black"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Acciones a la derecha */}
          <div className="hidden items-center gap-6 md:flex">
            <LangSwitcher locale={lang} />
            <SmartLink
              href={shopLink}
              lang={lang}
              className="rounded-full bg-black px-6 py-2.5 text-[14px] font-bold text-white transition-opacity hover:opacity-85"
            >
              {shopText}
            </SmartLink>
          </div>

          {/* Botón hamburguesa (móvil) */}
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full p-2 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black md:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Panel móvil (accordion, misma lógica de antes) */}
      <div
        className="grid overflow-hidden border-t border-black/10 bg-white transition-[grid-template-rows] duration-300 ease-in-out md:hidden"
        style={{ gridTemplateRows: mobileOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <div className="space-y-1 px-6 pb-6 pt-4">
            {data.map((item: any, index: number) =>
              item.children?.length > 0 ? (
                <MobileDropdown key={index} item={item} lang={lang} />
              ) : (
                <Link
                  key={index}
                  href={`/${lang}${item.href}`}
                  className={cx(
                    "block py-2.5 text-[17px] font-bold tracking-tight transition-colors",
                    isActive(item.href) ? "text-black" : "text-black/70 hover:text-black"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}

            <div className="pt-2">
              <LangSwitcher locale={lang} />
            </div>

            <SmartLink
              href={shopLink}
              lang={lang}
              className="mt-3 block w-full rounded-full bg-black px-6 py-3 text-center text-[15px] font-bold text-white transition-opacity hover:opacity-85"
            >
              {shopText}
            </SmartLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown de escritorio                                             */
/* ------------------------------------------------------------------ */

function DesktopDropdown({ item, lang, isActive }: any) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex items-center gap-1 text-[15px] font-semibold tracking-tight transition-colors",
          isActive(item.href) ? "text-black" : "text-black/60 hover:text-black"
        )}
      >
        {item.label}
        <ChevronIcon open={open} />
      </button>

      <div
        role="menu"
        className={cx(
          "absolute left-1/2 z-20 mt-3 w-44 -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl transition-all duration-150",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {item.children.map((child: any, idx: number) => (
          <Link
            key={idx}
            href={`/${lang}${child.path}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-bold text-black/80 transition-colors hover:bg-black/5 hover:text-black"
          >
            {child.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown móvil (accordion)                                         */
/* ------------------------------------------------------------------ */

function MobileDropdown({ item, lang }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-2.5 text-[17px] font-bold tracking-tight text-black/80 transition-colors hover:text-black"
      >
        {item.label}
        <ChevronIcon open={open} />
      </button>

      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 pl-4">
          {item.children.map((child: any, idx: number) => (
            <Link
              key={idx}
              href={`/${lang}${child.path}`}
              className="block py-2 text-[16px] font-bold text-black/70 transition-colors hover:text-black"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
