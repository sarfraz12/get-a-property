// app/(website)/[lang]/[category]/post/[slug]/postHome.js
//
// Página de un post individual. Reescrita completa para que coincida
// con la referencia que enviaste (ficha de propiedad de EstatePro),
// adaptada al contenido real de un artículo de blog en vez de
// inventar datos de una propiedad que no existen:
//
//   Insignia (categoría)      -> categoría del post
//   Título + descripción      -> post.title + post.excerpt
//   Recuadro gris ($/dirección
//   + beds/baths/sqft)        -> tiempo de lectura + fecha, y una
//                                 fila de datos reales del post
//                                 (categoría / autor / fecha)
//   Recuadro negro (amenidades)-> "Puntos clave" del post (campo NUEVO
//                                 en Sanity: post.highlights, opcional
//                                 -- si no se llena, el recuadro no
//                                 aparece)
//   Foto principal             -> post.mainImage
//   Fotos secundarias (6)      -> post.gallery (campo NUEVO en Sanity,
//                                 opcional -- si está vacío, esa fila
//                                 no se muestra)
//   "About property" + texto   -> "Sobre este artículo" + post.body,
//                                 con formato enriquecido (negrita,
//                                 cursiva, títulos, listas...) vía
//                                 PortableText + tipografía de
//                                 @tailwindcss/typography. Esto YA se
//                                 puede editar así en el Sanity
//                                 Studio (ver lib/sanity/schemas/blockContent.js)
//                                 -- lo único que cambió acá es que
//                                 ahora se ve con el estilo del sitio.
//   Tarjeta del agente + form  -> tarjeta del AUTOR del post (nombre,
//                                 foto, email/teléfono si se cargaron
//                                 -- campos NUEVOS y opcionales en
//                                 lib/sanity/schemas/author.js) más un
//                                 formulario de contacto conectado al
//                                 mismo api/emailJs que el resto del
//                                 sitio (ver components/blog/PostContactForm.tsx)
//   "Recently added properties"-> "Más publicaciones", usando
//                                 post.related (ya lo calculaba la
//                                 query de Sanity) con la misma
//                                 tarjeta PostCard que el resto del
//                                 sitio.
//
// Se quitó el sidebar viejo (buscador + lista de categorías), porque
// la referencia no lo tiene y esas mismas funciones ya viven, recién
// rediseñadas, en la página "/all" (app/(website)/[lang]/[category]/categoryPosts.js).
// Si prefieres mantenerlo también acá, se puede agregar de vuelta.
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostGallery from "@/components/blog/PostGallery";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Container from "@/components/generalUse/container";
import PostCard from "@/components/posts/PostCard";
import PostContactForm from "@/components/blog/PostContactForm";
import CategoryBadge from "@/components/blog/CategoryBadge";
import { renderKeyFeatureIcon } from "@/components/blog/keyFeatureIcons";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";

const COPY = {
  es: {
    back: "Volver a todos los posts",
    readTime: "de lectura",
    category: "Categoría",
    author: "Vendedor",
    published: "Publicado",
    about: "Sobre este artículo",
    questions: "¿Tienes preguntas?",
    more: "Más publicaciones",
    viewAll: "Ver todo",
    blogFallback: "Blog",
    documents: "Documentos descargables",
    download: "Descargar",
  },
  en: {
    back: "Back to all posts",
    readTime: "read",
    category: "Category",
    author: "Seller",
    published: "Published",
    about: "About this article",
    questions: "Have questions?",
    more: "More posts",
    viewAll: "View all",
    blogFallback: "Blog",
    documents: "Downloadable documents",
    download: "Download",
  },
};

/* ------------------------------------------------------------------ */
/*  Íconos chicos (inline, misma familia que el resto del sitio)      */
/* ------------------------------------------------------------------ */

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0 6 6m-6-6 6-6" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <circle cx="12" cy="8" r="3.5" />
      <path strokeLinecap="round" d="M5 20c1.2-3.5 4.1-5.5 7-5.5s5.8 2 7 5.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path strokeLinecap="round" d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

// NUEVO: ícono de descarga para la sección de documentos (post.attachments,
// ver lib/sanity/schemas/post.js).
function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

// Los íconos de "Puntos clave" (KEY_FEATURE_ICONS) y su función de
// respaldo se movieron a components/blog/keyFeatureIcons.tsx para
// poder reutilizarlos también en components/posts/PostCard.tsx --
// pedido del usuario: que la tarjeta del listado y esta página
// muestren "estos mismos valores" con la misma cara.

function StatRow({ icon, label }) {
  if (!label) return null;
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-black/70">
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

// Contenido de relleno SOLO para poder ver cómo luce el diseño en
// posts que todavía no tienen "Puntos clave" o "Galería" cargados en
// Sanity (son campos nuevos y opcionales, así que hoy están vacíos en
// los posts existentes). En cuanto un post tenga sus propios
// highlights/gallery en el Studio, esos reemplazan automáticamente a
// este relleno -- ver más abajo "highlights.length > 0 ? ... : ...".
const PLACEHOLDER_HIGHLIGHTS = {
  es: ["Ubicación privilegiada", "Buen estado", "Cerca de vías principales", "Ideal para inversión", "Documentación al día", "Precio negociable"],
  en: ["Prime location", "Good condition", "Near main roads", "Great investment", "Up-to-date documentation", "Negotiable price"],
};

// Fotos genéricas del sitio (public/images) usadas como relleno de la
// galería cuando el post no tiene fotos secundarias propias todavía.
const PLACEHOLDER_GALLERY = ["/images/lotes-frente-playa.webp", "/images/asset.jpg", "/images/asset-2.jpg"];

export default function Post(props) {
  const { post, lang } = props;
  const t = COPY[lang] || COPY.es;
  const dateLocale = lang === "es" ? es : undefined;

  const slug = post?.slug;
  if (!slug) {
    notFound();
  }

  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const authorImageProps = post?.author?.image ? urlForImage(post.author.image) : null;
  const category = post?.categories?.[0]?.title;
  const related = (post?.related || []).slice(0, 3);
  const readTime = Math.max(1, post?.estReadingTime || 1);
  const rawDate = post?.publishedAt || post?._createdAt;
  const dateLabel = rawDate ? format(parseISO(rawDate), "d MMM yyyy", { locale: dateLocale }) : null;

  // Puntos clave reales del post si los cargaron en Sanity; si no,
  // relleno genérico de marca sólo para previsualizar el diseño (ver
  // comentario en PLACEHOLDER_HIGHLIGHTS más arriba).
  const realHighlights = post?.highlights?.filter(h => h?.text) || [];
  const highlights =
    realHighlights.length > 0
      ? realHighlights
      : (PLACEHOLDER_HIGHLIGHTS[lang] || PLACEHOLDER_HIGHLIGHTS.es).map(text => ({ text }));

  // Fotos secundarias reales si existen; si no, se rellena con fotos
  // genéricas del sitio (ver PLACEHOLDER_GALLERY) para poder ver cómo
  // queda la fila de miniaturas mientras no se cargue una galería real.
  const realGallery = (post?.gallery || [])
    .map((img, index) => {
      const galleryImage = urlForImage(img);
      return galleryImage?.src ? { src: galleryImage.src, alt: img?.alt || `${post.title} ${index + 1}`, key: img?._key || index } : null;
    })
    .filter(Boolean);
  const gallery =
    realGallery.length > 0
      ? realGallery
      : PLACEHOLDER_GALLERY.map((src, index) => ({ src, alt: `${post?.title || "Get a Property"} ${index + 1}`, key: src }));

  return (
    <Container large alt className="py-10 md:py-16">
      {/* Volver (misma función que el link "← Ver todos" de antes) */}
      <Link
        href={`/${lang}/all`}
        className="inline-flex items-center gap-2 text-sm font-bold text-black/50 transition-colors hover:text-black"
      >
        <ArrowLeftIcon />
        {t.back}
      </Link>

      {/* Insignia + título + descripción + recuadro de datos, y a la
          derecha los "puntos clave". `lg:items-stretch` (el default de
          grid, pero explícito acá para que quede claro) hace que las
          2 columnas tengan la MISMA altura -- la izquierda (texto +
          recuadro gris) y la negra a la derecha -- para que se lea
          como una sola fila de 2 columnas, no como dos bloques sueltos
          de alturas distintas. */}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
        <div>
          {/* Insignia(s) de categoría con su color real (ver
              components/blog/CategoryBadge.tsx) -- antes era siempre
              negra sin importar el color elegido en Sanity. */}
          <CategoryBadge categories={post?.categories} lang={lang} limit={3} />

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-black sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-black/60 sm:text-lg">
              {post.excerpt}
            </p>
          )}

          {/* Recuadro ancho y rectangular: si el post tiene precio
              (post.price, ver lib/sanity/schemas/post.js), ese es el
              dato grande de la izquierda con la ubicación debajo --
              igual que en la referencia ("$230 USD/month" / dirección).
              Si no tiene precio (ej. un post de blog que no es una
              propiedad), cae en el tiempo de lectura de siempre para
              no dejar ese espacio vacío. Los 3 datos de la derecha
              (categoría / autor / tiempo de lectura o fecha) se
              acomodan como fila horizontal, separados por una línea
              vertical. */}
          <div className="mt-8 w-full rounded-2xl bg-gray-50 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {post?.price ? (
                <div className="min-w-0">
                  <p className="text-3xl font-extrabold text-black sm:text-4xl">{post.price}</p>
                  {post?.location && <p className="mt-1 text-sm text-black/50">{post.location}</p>}
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-extrabold text-black sm:text-4xl">
                    {readTime} min{" "}
                    <span className="text-base font-semibold text-black/40">{t.readTime}</span>
                  </p>
                  {dateLabel && <p className="mt-1 text-sm text-black/50">{dateLabel}</p>}
                </div>
              )}

              {/* Pedido del usuario: "estos mismos valores que van en el
                  post list, también que salgan en el área gris" -- los
                  3 datos de la derecha ahora son los mismos "puntos
                  clave" (con su mismo ícono real) que muestra la
                  tarjeta del listado (PostCard.tsx) en vez de
                  categoría/autor/fecha. Si el post todavía no tiene
                  ningún punto clave cargado, se mantiene esa fila de
                  respaldo para no dejar el recuadro vacío. */}
              <div className="flex flex-col gap-4 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:gap-8 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                {realHighlights.length > 0 ? (
                  realHighlights.slice(0, 3).map((item, i) => (
                    <StatRow
                      key={i}
                      icon={renderKeyFeatureIcon(item, i, "h-5 w-5 flex-shrink-0")}
                      label={item.text}
                    />
                  ))
                ) : (
                  <>
                    <StatRow icon={<TagIcon />} label={category} />
                    <StatRow icon={<UserIcon />} label={post?.author?.name} />
                    <StatRow icon={<CalendarIcon />} label={dateLabel} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* "Puntos clave": datos reales del post si se cargaron en
            Sanity, o el relleno de marca mientras tanto (ver
            PLACEHOLDER_HIGHLIGHTS) -- siempre se muestra para poder
            ver cómo queda.
            - `h-full` + `flex flex-col` hace que el recuadro ocupe
              toda la altura que le da el grid (la misma que la
              columna izquierda).
            - La grilla de puntos usa `flex-1` (toma todo el alto que
              sobra debajo del rótulo) + `content-between`, que reparte
              las filas de arriba a abajo llenando ese espacio en vez
              de agruparse en un bloque compacto -- así el contenido
              queda distribuido en TODA el área del recuadro, no sólo
              centrado.
            - Los tamaños (rótulo, ícono, texto) y el padding del
              recuadro crecen con el ancho de pantalla (sm:/lg:), para
              que se note igual de bien en celular, tablet y desktop
              en vez de quedar chico en pantallas grandes. */}
        <div className="flex h-full flex-col rounded-3xl bg-black p-8 sm:p-10 lg:p-12">
          <p className="flex-shrink-0 text-xs font-bold uppercase tracking-widest text-brand-gold sm:text-sm">
            {lang === "es" ? "Puntos clave" : "Key highlights"}
          </p>

          <div className="mt-6 grid flex-1 grid-cols-1 content-between gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10">
            {highlights.map((h, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                  {renderKeyFeatureIcon(h, index, "h-5 w-5 flex-shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6")}
                </span>
                <span className="text-base font-bold leading-snug text-white sm:text-lg lg:text-xl">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foto principal + fotos secundarias (post.gallery si tiene
          fotos propias, si no el relleno genérico -- ver
          PLACEHOLDER_GALLERY arriba). Extraído a PostGallery (Client
          Component) para que al hacer click/tap se abra un lightbox
          con la foto maximizada, con flechas y swipe para navegar
          entre todas -- funciona igual en escritorio y en móvil. */}
      <PostGallery
        mainImage={imageProps ? { src: imageProps.src, alt: post.mainImage?.alt || post.title || "Thumbnail" } : null}
        gallery={gallery}
      />

      {/* Contenido del artículo (con formato enriquecido) + tarjeta
          del autor y formulario de contacto */}
      <div className="mt-16 grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">{t.about}</h2>

          {/* Acá se renderiza post.body: en Sanity Studio ese campo
              admite negrita, cursiva, subrayado, tachado, código,
              títulos H2/H3/H4, cita, listas con viñetas o numeradas,
              links, imágenes y tablas (ver lib/sanity/schemas/blockContent.js).
              Las clases "prose" de @tailwindcss/typography son las que
              hacen que todo eso se vea bien formateado acá (tamaños,
              negritas, espaciado de listas, etc.), ajustadas a los
              colores/fuente de la marca. */}
          <div
            className="prose prose-lg mt-6 max-w-none
              prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-black
              prose-p:leading-relaxed prose-p:text-black/70
              prose-a:font-semibold prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:font-bold prose-strong:text-black
              prose-blockquote:border-black prose-blockquote:text-black/70
              prose-li:text-black/70 prose-img:rounded-2xl"
          >
            {post.body && <PortableText value={post.body} />}
          </div>

          {/* NUEVO: documentos descargables (post.attachments -- ver
              lib/sanity/schemas/post.js). Opcional: si el post no
              tiene ningún archivo cargado, esta sección no aparece. */}
          {post?.attachments?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-extrabold text-black">{t.documents}</h3>
              <ul className="mt-4 space-y-3">
                {post.attachments.map((doc, index) => (
                  doc?.url && (
                    <li key={index}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-bold text-black transition-colors hover:border-black/30 hover:bg-gray-50"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <DownloadIcon />
                          <span className="truncate">{doc.title || doc.filename}</span>
                        </span>
                        <span className="flex-shrink-0 text-xs font-bold uppercase tracking-wide text-black/40">
                          {t.download}
                        </span>
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl bg-gray-50 p-8">
            {post.author ? (
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-black/5">
                  {authorImageProps?.src && (
                    <Image
                      src={authorImageProps.src}
                      alt={post.author.name || "Vendedor"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-black">{post.author.name}</p>
                  {post.author.email && (
                    <a href={`mailto:${post.author.email}`} className="block truncate text-sm text-black/60 hover:text-black">
                      {post.author.email}
                    </a>
                  )}
                  {post.author.phone && (
                    <a href={`tel:${post.author.phone}`} className="block text-sm text-black/60 hover:text-black">
                      {post.author.phone}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-lg font-bold text-black">{t.questions}</p>
            )}

            <PostContactForm
              lang={lang}
              postTitle={post.title}
              authorName={post?.author?.name}
              postCategory={category}
              postDate={dateLabel}
              postSlug={slug?.current}
            />
          </div>
        </div>
      </div>

      {/* Relacionados (post.related, ya calculado por la query de
          Sanity: otros posts que comparten categoría), con la misma
          tarjeta que usa el resto del sitio. */}
      {related.length > 0 && (
        <div className="mt-24">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">{t.more}</h2>
            <Link href={`/${lang}/all`} className="group inline-flex flex-shrink-0 items-center gap-2 text-base font-bold text-black">
              {t.viewAll}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white">
                &rarr;
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
            {related.map((relatedPost, index) => (
              <PostCard key={relatedPost._id} post={relatedPost} lang={lang} index={index} pathPrefix="all" />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
