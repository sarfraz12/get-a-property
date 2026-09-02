/**
 * Recibe el webhook de Sanity.io cuando se crea/edita/borra un
 * documento, y refresca el cache de Next.js para que el sitio muestre
 * el contenido nuevo sin esperar al próximo deploy.
 *
 * Reescrito para App Router: la versión anterior (pages/api/revalidate.js)
 * usaba `res.revalidate(path)`, que es la API de revalidación de
 * getStaticProps del Pages Router -- no tiene ningún efecto sobre las
 * páginas de app/(website)/[lang]/**, que es donde vive hoy todo el
 * sitio. Ese era el motivo real por el que los cambios en Sanity no se
 * reflejaban solos.
 *
 * Ahora se usa `revalidateTag` (next/cache), la API de invalidación
 * bajo demanda del App Router. Cada función de lib/sanity/client.ts
 * etiqueta su fetch con el tipo de documento que consulta (ver los
 * comentarios ahí), así que revalidar un tag alcanza sin importar en
 * qué ruta/idioma/parámetro terminó cacheado ese fetch -- no hace
 * falta mantener a mano una lista de rutas por idioma como antes.
 *
 * Setup del webhook en Sanity (sanity.io/manage -> API -> Webhooks),
 * sigue siendo el mismo que antes:
 * 1. Nombre y descripción a gusto.
 * 2. URL: https://TU_DOMINIO/api/revalidate
 * 3. Dataset: production (o el que corresponda).
 * 4. Trigger on: Create, Update, Delete.
 * 5. Filter: vacío (se quiere avisar de cualquier tipo de documento).
 * 6. Projection: vacío (se necesita el documento completo: _type, slug, etc).
 * 7. HTTP method: POST.
 * 8. API version: v2021-03-25 (o más reciente).
 * 9. Secret: el mismo valor que SANITY_REVALIDATE_SECRET en .env.local / Vercel.
 */

import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.SANITY_REVALIDATE_SECRET;

// Tipos de documento que no tienen slug propio (documentos "singleton"
// -- uno solo por dataset). Ver lib/sanity/schemas/index.ts para la
// lista completa de _type existentes.
const SINGLETON_TAGS: Record<string, string> = {
  settings: "settings",
  navbarData: "navbarData",
  footerData: "footerData",
  aboutPage: "aboutPage",
  contactPage: "contactPage",
  searchPage: "searchPage",
  landingPage: "landingPage",
};

// Determina qué tag(s) de cache (los mismos nombres usados en
// lib/sanity/client.ts) hay que invalidar según el documento que
// Sanity reporta como creado/editado/borrado. No depende del idioma:
// un mismo documento alimenta las versiones "es" y "en" de cada
// página, así que revalidar el tag ya cubre las dos.
function tagsForDocument(body: any): string[] {
  const type = body?._type;
  const slug = body?.slug?.current;

  if (type === "post") {
    // Un post afecta: el listado de posts, su propia página, las
    // categorías a las que pertenece (aparece en su listado) y el
    // landing (sección de destacados).
    const tags = ["post", "category", "landingPage"];
    if (slug) tags.push(`post:${slug}`);
    return tags;
  }

  if (type === "category") {
    const tags = ["category", "post", "landingPage"];
    if (slug) tags.push(`category:${slug}`);
    return tags;
  }

  if (type === "author") {
    const tags = ["author", "post"];
    if (slug) tags.push(`author:${slug}`);
    return tags;
  }

  if (type && SINGLETON_TAGS[type]) {
    return [SINGLETON_TAGS[type]];
  }

  // _type desconocido o ausente (ej. documento nuevo todavía sin
  // guardar del todo, o un tipo agregado a futuro en el Studio que
  // todavía no se contempló acá arriba): se revalida todo como red de
  // seguridad, en vez de no hacer nada.
  return [
    "post",
    "category",
    "author",
    "settings",
    "navbarData",
    "footerData",
    "aboutPage",
    "contactPage",
    "searchPage",
    "landingPage",
  ];
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(req, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { revalidated: false, message: "Empty body" },
        { status: 400 }
      );
    }

    const tags = tagsForDocument(body);
    // "max" es el perfil de cacheLife recomendado por Next 16 para
    // revalidateTag cuando no se usa la nueva API "use cache" (nuestros
    // fetches usan el `next: { revalidate, tags }` clasico) -- sin el
    // segundo argumento sigue funcionando pero Next tira un warning de
    // deprecación en cada llamada.
    tags.forEach((tag) => revalidateTag(tag, "max"));

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body?._type ?? null,
      slug: body?.slug?.current ?? null,
      tags,
    });
  } catch (err: any) {
    console.error("Error revalidating", err);
    return NextResponse.json(
      { revalidated: false, message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
