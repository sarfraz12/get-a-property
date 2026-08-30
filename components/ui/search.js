// components/ui/search.js
//
// Input de búsqueda reutilizado en /search y en el listado de
// categorías/posts (categoryPosts.js). Restyled a la misma píldora
// clara con borde sutil que usamos en el resto del sitio nuevo (ver
// NewsletterForm), en vez del input cuadrado con borde verde de la
// plantilla original.
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchInput({
  q,
  handleChange,
  placeholder
}) {
  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={q}
        onChange={handleChange}
        placeholder={placeholder}
        name="q"
        id="q"
        className="w-full rounded-full border border-black/15 bg-white py-3 pl-5 pr-11 text-sm text-black placeholder:text-black/40 outline-none transition-colors focus:border-black"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <MagnifyingGlassIcon className="w-4 h-4 text-black/40" />
      </div>
    </div>
  );
}
