// components/generalUse/SkeletonLoader.jsx
//
// Placeholder de carga genérico: unas barras grises animadas
// ("skeleton") que simulan líneas de texto mientras se espera
// contenido real. Actualmente NO se usa en ninguna página del sitio
// (no tiene ningún import activo) -- se deja disponible para usarse en
// futuros estados de carga, pero no forma parte del flujo actual del
// sitio (que usa components/navigation/spinner.tsx para su loading
// global -- ver app/(website)/[lang]/loading.js).

export default function SkeletonLoader({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"
        ></div>
      ))}
    </div>
  );
}