// components/navigation/pagination.js
//
// Paginación del listado de posts (categoryPosts.js). Restyled a
// píldoras redondas negro/blanco (misma paleta que el resto del sitio
// nuevo) en vez de los cuadrados azul/gris de la plantilla original.
// La lógica de páginas no cambió.
import { cx } from "@/utils/all";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-16 flex justify-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cx(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors",
            page === currentPage
              ? "bg-black text-white"
              : "bg-black/5 text-black hover:bg-black/10"
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
