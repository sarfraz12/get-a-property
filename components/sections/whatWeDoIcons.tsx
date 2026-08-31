// components/sections/whatWeDoIcons.tsx
//
// Set de íconos para las tarjetas de "Qué hacemos" (aboutPage.whatWeDoItems,
// ver lib/sanity/schemas/aboutPage.js -> whatWeDoItems[].icon). Mismo
// patrón que components/blog/keyFeatureIcons.tsx: un ícono real por cada
// "value" del selector de Sanity, más una rotación de respaldo para
// tarjetas viejas/sin ícono elegido, así ninguna tarjeta queda sin ícono.
import type { JSX } from "react";

export const WHAT_WE_DO_ICONS: Record<string, () => JSX.Element> = {
  search: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <circle cx="10.5" cy="10.5" r="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-4.8-4.8" />
    </svg>
  ),
  home: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11.5 12 4l8 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  "shield-check": () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 5 6v5.5c0 4.6 3 8 7 9.5 4-1.5 7-4.9 7-9.5V6l-7-2.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4.5" />
    </svg>
  ),
  leaf: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c9 0 14-5 14-14 0-1.1-.1-1.7-.1-1.7S17.5 4 14 4C7 4 4 8.5 4 13.5c0 2.3.7 4.1.7 4.1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c0-4 2-8 6-11" />
    </svg>
  ),
  handshake: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12.5 6 9l3 2.2M22 12.5 18 9l-3 2.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 11.2 2.3 2a1.6 1.6 0 0 0 2.2-.1l.1-.1a1.6 1.6 0 0 0-.1-2.2L11 8.5 6 12.8l3.6 3.6a1.7 1.7 0 0 0 2.4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m13 15 1.6 1.6a1.7 1.7 0 0 0 2.4 0 1.7 1.7 0 0 0 0-2.4" />
    </svg>
  ),
  chart: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V4M4 20h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.5 16 4-4.5 3 2.5 5-6" />
    </svg>
  ),
  star: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z" />
    </svg>
  ),
  clock: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-8 w-8">
      <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 2" />
    </svg>
  ),
};

// Rotación decorativa genérica -- sólo para tarjetas sin ícono elegido.
const FALLBACK_ICONS: (() => JSX.Element)[] = [
  WHAT_WE_DO_ICONS.search,
  WHAT_WE_DO_ICONS.leaf,
  WHAT_WE_DO_ICONS["shield-check"],
];

export function renderWhatWeDoIcon(icon: string | undefined, index: number) {
  const iconFn = icon && WHAT_WE_DO_ICONS[icon];
  if (iconFn) return iconFn();
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length]();
}
