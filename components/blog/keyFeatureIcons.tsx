// components/blog/keyFeatureIcons.tsx
//
// Set compartido de íconos para "Puntos clave / Características"
// (post.highlights, ver lib/sanity/schemas/post.js -> highlights[].icon).
// Antes vivía sólo dentro de postHome.js (la página del post); se
// extrajo acá para poder usar EXACTAMENTE los mismos íconos también en
// components/posts/PostCard.tsx -- pedido del usuario: que la tarjeta
// del listado y el recuadro gris de la página del post muestren "estos
// mismos valores" con la misma cara.
//
// - KEY_FEATURE_ICONS: un ícono real por cada "value" del selector de
//   Sanity (bed/bath/area/etc). Debe tener una entrada por cada opción
//   de esa lista -- si se agrega una opción nueva ahí, agregarla acá
//   también.
// - renderKeyFeatureIcon(item, index, className): usa el ícono real si
//   el ítem lo tiene elegido; si no (contenido viejo cargado antes de
//   que existiera el selector de ícono), cae en una rotación
//   decorativa genérica para que ningún ítem quede sin ícono.
export const KEY_FEATURE_ICONS: Record<string, (className: string) => JSX.Element> = {
  bed: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-5.5A2.5 2.5 0 0 1 5.5 10H18a3 3 0 0 1 3 3v5M3 18v2M21 18v2M3 14.5h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 10V7.5A1.5 1.5 0 0 1 8 6h3a1.5 1.5 0 0 1 1.5 1.5V10" />
    </svg>
  ),
  bath: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h15a1 1 0 0 1 1 1v1a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-1a1 1 0 0 1 1-1Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12V6.5A2.5 2.5 0 0 1 8.5 4c1 0 1.7.5 2.2 1.3M4 22h1M19 22h1" />
    </svg>
  ),
  area: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  ),
  garage: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V10.5L12 4l9 6.5V21" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21v-8h13v8" />
    </svg>
  ),
  floors: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 9 4.5-9 4.5-9-4.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
    </svg>
  ),
  yearBuilt: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path strokeLinecap="round" d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  ),
  lotSize: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5 9 5l6 3 6-3v10.5l-6 3-6-3-6 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5v10.5M15 8v10.5" />
    </svg>
  ),
  pool: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17c1.3 1 2.6 1 4 0s2.7-1 4 0 2.6 1 4 0 2.7-1 4 0 2.6 1 4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 13V6.5A1.5 1.5 0 0 1 7.5 5h1A1.5 1.5 0 0 1 10 6.5V13M14 13V9.5A1.5 1.5 0 0 1 15.5 8h1A1.5 1.5 0 0 1 18 9.5V13" />
    </svg>
  ),
  furnished: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12.5V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5h18v4.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4.5ZM4 18v2.5M20 18v2.5" />
    </svg>
  ),
  pets: className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <circle cx="7" cy="8" r="1.6" />
      <circle cx="12" cy="6" r="1.6" />
      <circle cx="17" cy="8" r="1.6" />
      <circle cx="9.5" cy="11.5" r="1.6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5c2.8 0 5 1.7 5 4a2.5 2.5 0 0 1-4 2c-.6-.5-1.4-.5-2 0a2.5 2.5 0 0 1-4-2c0-2.3 2.2-4 5-4Z" />
    </svg>
  ),
};

// Rotación decorativa genérica -- sólo para contenido viejo sin ícono
// elegido (cargado antes de que existiera el selector de ícono).
const FALLBACK_ICONS: ((className: string) => JSX.Element)[] = [
  className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7 9.5 17.5 4 12" />
    </svg>
  ),
  className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4 3 6 6.2 6 9.5A6 6 0 0 1 6 12.5C6 9.2 8 6 12 3Z" />
    </svg>
  ),
  className => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.1 7-11.2A7 7 0 0 0 5 9.8C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  ),
];

export interface KeyFeatureItem {
  icon?: string;
  text?: string;
}

export function renderKeyFeatureIcon(item: KeyFeatureItem | undefined, index: number, className: string) {
  const iconFn = item?.icon && KEY_FEATURE_ICONS[item.icon];
  if (iconFn) return iconFn(className);
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length](className);
}
