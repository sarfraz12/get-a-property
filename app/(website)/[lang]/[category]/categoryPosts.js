// app/(website)/[lang]/[category]/categoryPosts.js
//
// Listado de posts (usado tanto para "/all" como para una categoría
// puntual, ej. "/recetas"). Restyled para que coincida con la
// referencia que enviaste ("Our Properties"): un banner negro
// redondeado con el título grande centrado, y debajo una grilla de
// tarjetas de post (insignia de categoría + fecha sobre la imagen,
// título y autor debajo) usando el mismo PostCard que ya se usa en la
// sección "Publicaciones recientes" del home.
//
// Funciones que YA existían y se mantienen, sólo restyled:
// - Buscador (SearchInput -> /{lang}/search)
// - Paginación client-side (POSTS_PER_PAGE = 6)
//
// NUEVO (filtros reales conectados a categorías -- ver lib/categoryFilters.ts):
// - "categories" (todas las categorías de Sanity, con su categoryType)
//   se agrupan en Ubicación / Propiedad / Oferta y se muestran como
//   filtros de selección múltiple (checkboxes), sincronizados con la
//   URL (?location=..&property=..&offer=..) -- son los MISMOS query
//   params que arma el dropdown del Hero, así que un usuario puede
//   elegir "Casas" + "Coronado" en el Hero, aterrizar acá, y ver esos
//   mismos filtros ya marcados y aplicados.
// - Las categorías sin "categoryType" (o con "general") siguen
//   funcionando como antes: un link directo a su propia página
//   /{lang}/{slug}, sin entrar en el sistema de filtros nuevo.
"use client";

import Container from "@/components/generalUse/container";
import SearchInput from "@/components/ui/search";
import PostCard from "@/components/posts/PostCard";
import Pagination from "@/components/navigation/pagination";
import { notFound, useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FILTER_GROUP_ORDER,
  FILTER_GROUP_META,
  buildFilterQueryString,
  filterPostsBySelection,
  getCategorySlug,
  groupCategories,
  hasAnySelection,
  parseFilterSelection,
} from "@/lib/categoryFilters";

const POSTS_PER_PAGE = 6;

const COPY = {
  es: {
    allTitle: "Todos los Posts",
    search: "Buscar",
    searchPlaceholder: "Buscar por contenido...",
    categories: "Categorías",
    filters: "Filtros",
    clearFilters: "Limpiar filtros",
    posts: "posts",
  },
  en: {
    allTitle: "All Posts",
    search: "Search",
    searchPlaceholder: "Search content...",
    categories: "Categories",
    filters: "Filters",
    clearFilters: "Clear filters",
    posts: "posts",
  },
};

export default function CategoryPosts(props) {
  const { internalPosts, title, categories, lang } = props;
  const t = COPY[lang] || COPY.es;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!internalPosts) {
    notFound();
  }

  // "ALL" es el título centinela que arma app/(website)/[lang]/[category]/page.js
  // cuando category === "all" (no viene de Sanity); el resto de los
  // títulos sí son categorías reales y se muestran tal cual.
  const heading = title === "ALL" ? t.allTitle : title;

  // Categorías reales agrupadas por tipo (Ubicación / Propiedad / Oferta)
  // + las que no tienen tipo asignado (siguen como links simples).
  const categoryGroups = useMemo(() => groupCategories(categories), [categories]);
  const ungroupedCategories = useMemo(
    () => (categories || []).filter((c) => !c.categoryType || c.categoryType === "general"),
    [categories]
  );

  // Selección actual de filtros, leída de la URL -- así el dropdown del
  // Hero y esta página comparten el mismo estado (?location=..&property=..&offer=..).
  const selection = useMemo(() => parseFilterSelection(searchParams), [searchParams]);
  const filtersActive = hasAnySelection(selection);

  const filteredPosts = useMemo(
    () => filterPostsBySelection(internalPosts, selection),
    [internalPosts, selection]
  );

  // Paginación (misma lógica que antes, ahora sobre la lista ya filtrada)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Si cambia la categoría, la selección de filtros (o llegan menos
  // posts) y la página actual quedó fuera de rango, se vuelve a la 1
  // en vez de mostrar una grilla vacía.
  useEffect(() => {
    setCurrentPage(1);
  }, [title, searchParams]);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const applySelection = (nextSelection) => {
    const query = buildFilterQueryString(nextSelection);
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  const toggleFilter = (groupKey, slug) => {
    const current = selection[groupKey];
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    applySelection({ ...selection, [groupKey]: next });
  };

  const clearFilters = () => applySelection({ location: [], propertyType: [], offerType: [] });

  const activeGroups = FILTER_GROUP_ORDER.filter((key) => (categoryGroups[key]?.length || 0) > 0);

  return (
    <Container large alt className="py-12 md:py-20">
      {/* Banner negro con el título, igual que la referencia */}
      <div className="overflow-hidden rounded-3xl bg-black px-6 py-14 text-center sm:py-20">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {heading}
        </h1>
      </div>

      {/* Buscador */}
      <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="w-full md:max-w-xs">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t.search}</p>
          <form action={`/${lang}/search`} method="GET" className="mt-3">
            <SearchInput placeholder={t.searchPlaceholder} />
          </form>
        </div>

        {/* Categorías sin tipo asignado: siguen como links directos a su página */}
        {ungroupedCategories.length > 0 && (
          <div className="w-full md:max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t.categories}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {ungroupedCategories.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`${!lang ? "" : "/" + lang}/${getCategorySlug(item)}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
                  >
                    {item.title}
                    <span className="text-black/40 transition-colors group-hover:text-white/70">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* NUEVO: filtros reales (Ubicación / Propiedad / Oferta), selección
          múltiple con checkboxes, sincronizados con la URL. Sólo se
          muestra un grupo si hay al menos 1 categoría real con ese tipo. */}
      {activeGroups.length > 0 && (
        <div className="mt-10 rounded-3xl border border-black/10 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t.filters}</p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-black/50 underline-offset-2 hover:text-black hover:underline"
              >
                {t.clearFilters}
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {activeGroups.map((key) => {
              const meta = FILTER_GROUP_META[key];
              const options = categoryGroups[key];
              return (
                <div key={key}>
                  <p className="text-sm font-bold text-black">{meta.label[lang === "en" ? "en" : "es"]}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {options.map((category) => {
                      const slug = getCategorySlug(category);
                      if (!slug) return null;
                      const checked = selection[key].includes(slug);
                      return (
                        <li key={slug}>
                          <button
                            type="button"
                            onClick={() => toggleFilter(key, slug)}
                            aria-pressed={checked}
                            className={
                              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors " +
                              (checked ? "bg-black text-white" : "bg-black/5 text-black hover:bg-black/10")
                            }
                          >
                            {category.title || slug}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contador */}
      <p className="mt-12 text-sm font-semibold text-black/50">
        {filteredPosts.length} {t.posts}
      </p>

      {/* Grilla de tarjetas de post */}
      <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
        {posts.map((post, index) => (
          <PostCard key={post._id} post={post} lang={lang} index={index} pathPrefix="all" />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
}
