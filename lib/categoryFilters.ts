// lib/categoryFilters.ts
//
// Lógica compartida de los filtros reales de categorías (Ubicación /
// Tipo de Propiedad / Tipo de Oferta) que pidió el cliente: que las
// opciones del Hero (carrusel) y del listado de posts se conecten con
// las categorías REALES que existan en Sanity (schema: category.js ->
// categoryType), en vez de opciones decorativas hardcodeadas.
//
// Se usa desde 2 lugares que necesitan la MISMA lógica:
//  - components/generalUse/hero.tsx (arma los 3 dropdowns del Hero y
//    NAVEGA a /{lang}/all?location=..&property=..&offer=.. al buscar)
//  - app/(website)/[lang]/[category]/categoryPosts.js (LEE esos mismos
//    query params y filtra la lista de posts ya cargada)
//
// Se mantiene todo acá para que ambos lugares queden sincronizados: si
// mañana cambia el nombre de un query param, sólo hay que tocar este
// archivo.

export type CategoryType = "location" | "propertyType" | "offerType" | "general";

// Los 3 grupos que sí arman un filtro visible. "general" existe en el
// schema (valor por defecto) pero a propósito NO tiene grupo de
// filtro: una categoría vieja o sin clasificar sigue funcionando en su
// propia página (/{lang}/{slug}), simplemente no aparece en ningún
// dropdown hasta que el editor le asigne un tipo en Sanity Studio.
export type FilterGroupKey = "location" | "propertyType" | "offerType";

export const FILTER_GROUP_ORDER: FilterGroupKey[] = ["location", "propertyType", "offerType"];

// Nombre del query param por grupo (?location=a,b&property=c&offer=d).
// Cortos y en inglés a propósito: son parte de la URL, no contenido
// visible, así que no necesitan traducción -- se mantienen iguales en
// /es/... y /en/....
export const FILTER_GROUP_PARAM: Record<FilterGroupKey, string> = {
  location: "location",
  propertyType: "property",
  offerType: "offer",
};

// Ícono (ya existen en hero.tsx -> FilterIcon) + copy bilingüe de cada
// grupo. "status" es el mismo ícono ($ con círculo) que ya se usaba en
// la píldora decorativa original -- encaja bien con "tipo de oferta"
// (venta/alquiler).
export const FILTER_GROUP_META: Record<
  FilterGroupKey,
  { icon: "location" | "property" | "status"; label: { es: string; en: string } }
> = {
  location: { icon: "location", label: { es: "Ubicación", en: "Location" } },
  propertyType: { icon: "property", label: { es: "Propiedad", en: "Property" } },
  offerType: { icon: "status", label: { es: "Oferta", en: "Status" } },
};

export type FilterCategory = {
  _id?: string;
  title?: string;
  // Puede llegar como string (ya resuelto, ej. groq "slug": slug.current)
  // o como el objeto crudo de Sanity { current, _type } (ej. cuando
  // viene de un "..." spread sin proyectar). Se soportan los dos.
  slug?: string | { current?: string } | null;
  categoryType?: CategoryType | null;
};

export function getCategorySlug(category: FilterCategory | null | undefined): string | undefined {
  const slug = category?.slug;
  if (!slug) return undefined;
  return typeof slug === "string" ? slug : slug.current;
}

function getGroupKey(category: FilterCategory | null | undefined): FilterGroupKey | null {
  const type = category?.categoryType;
  return type && type !== "general" ? (type as FilterGroupKey) : null;
}

export type CategoryGroups = Record<FilterGroupKey, FilterCategory[]>;

function emptyGroups(): CategoryGroups {
  return { location: [], propertyType: [], offerType: [] };
}

// Agrupa una lista de categorías (ya des-duplicada) por categoryType.
export function groupCategories(categories: FilterCategory[] | null | undefined): CategoryGroups {
  const groups = emptyGroups();
  for (const category of categories || []) {
    const key = getGroupKey(category);
    const slug = getCategorySlug(category);
    if (!key || !slug) continue; // sin tipo asignado o sin slug: no entra en ningún filtro
    if (groups[key].some((c) => getCategorySlug(c) === slug)) continue; // ya está
    groups[key].push(category);
  }
  return groups;
}

// Arma los grupos de categorías ÚNICAS a partir de una lista de posts
// que ya trae categories[] resuelto (mismo patrón que ya usaba
// CategoriesSection.tsx para la home) -- así el Hero no necesita una
// consulta nueva a Sanity, reusa los posts que la Home ya cargó.
export function buildCategoryGroupsFromPosts(
  posts: Array<{ categories?: FilterCategory[] }> | null | undefined
): CategoryGroups {
  const bySlug = new Map<string, FilterCategory>();
  for (const post of posts || []) {
    for (const category of post.categories || []) {
      const slug = getCategorySlug(category);
      if (!slug || bySlug.has(slug)) continue;
      bySlug.set(slug, category);
    }
  }
  return groupCategories(Array.from(bySlug.values()));
}

export function hasAnyCategoryGroups(groups: CategoryGroups): boolean {
  return FILTER_GROUP_ORDER.some((key) => groups[key].length > 0);
}

// Arma una FilterSelection a partir de una lista suelta de categorías
// (ej. las categorías vinculadas a UN slide del Hero -- ver
// lib/sanity/schemas/landingPage.js -> hero.slides.categories), en vez
// de a partir de query params. Sirve para que, al hacer click en una
// foto del carrusel con varias categorías vinculadas (una de
// Ubicación, una de Propiedad, una de Oferta), se navegue a la MISMA
// combinación de filtros que armaría el usuario eligiéndolas a mano en
// la píldora de arriba.
export function selectionFromCategories(categories: FilterCategory[] | null | undefined): FilterSelection {
  const selection = emptySelection();
  for (const category of categories || []) {
    const key = getGroupKey(category);
    const slug = getCategorySlug(category);
    if (!key || !slug) continue;
    if (!selection[key].includes(slug)) selection[key].push(slug);
  }
  return selection;
}

export type FilterSelection = Record<FilterGroupKey, string[]>;

export function emptySelection(): FilterSelection {
  return { location: [], propertyType: [], offerType: [] };
}

export function hasAnySelection(selection: FilterSelection | null | undefined): boolean {
  if (!selection) return false;
  return FILTER_GROUP_ORDER.some((key) => (selection[key]?.length || 0) > 0);
}

// Lee la selección actual desde los query params de la URL
// (?location=a,b&property=c&offer=d). Acepta tanto un URLSearchParams
// (cliente) como el objeto plano searchParams de Next (string |
// string[] | undefined por key).
export function parseFilterSelection(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined> | null | undefined
): FilterSelection {
  const selection = emptySelection();
  if (!searchParams) return selection;

  const readParam = (name: string): string | null => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(name);
    const value = (searchParams as Record<string, string | string[] | undefined>)[name];
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  };

  for (const key of FILTER_GROUP_ORDER) {
    const raw = readParam(FILTER_GROUP_PARAM[key]);
    selection[key] = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  return selection;
}

// Arma el query string (sin "?") a partir de una selección, para
// navegar con router.push(`/${lang}/all?${buildFilterQueryString(sel)}`).
export function buildFilterQueryString(selection: FilterSelection): string {
  const parts: string[] = [];
  for (const key of FILTER_GROUP_ORDER) {
    const values = selection[key];
    if (values?.length) parts.push(`${FILTER_GROUP_PARAM[key]}=${values.map(encodeURIComponent).join(",")}`);
  }
  return parts.join("&");
}

// Filtra una lista de posts (que ya traen categories[] resuelto) según
// la selección: dentro de un mismo grupo es OR (ej. Coronado O Ciudad
// de Panamá), entre grupos distintos es AND (ej. Ubicación Y Tipo de
// Propiedad Y Oferta) -- es el comportamiento estándar de un filtro de
// bienes raíces (combinás ubicación + tipo + oferta, no uno contra el
// otro). Un grupo sin selección no filtra nada (pasa todo).
export function filterPostsBySelection<T extends { categories?: FilterCategory[] }>(
  posts: T[] | null | undefined,
  selection: FilterSelection
): T[] {
  const list = posts || [];
  if (!hasAnySelection(selection)) return list;

  return list.filter((post) => {
    const postSlugs = new Set(
      (post.categories || []).map((c) => getCategorySlug(c)).filter(Boolean) as string[]
    );
    return FILTER_GROUP_ORDER.every((key) => {
      const wanted = selection[key];
      if (!wanted?.length) return true; // este grupo no se está filtrando
      return wanted.some((slug) => postSlugs.has(slug));
    });
  });
}
