// components/navigation/footer.js
//
// Pie de página — reescrito para calcar la referencia que enviaste:
// TODO en una sola fila (grid de 5 columnas en desktop):
//   1. Newsletter (arriba) + descripción + logo (abajo del todo)
//   2, 3, 4. Tres columnas de links, en negrita, sin encabezado
//   5. Contacto: correo / teléfono / dirección + redes sociales
// y debajo una barra negra a todo el ancho con el copyright centrado.
//
// TODA la data sigue viniendo de Sanity igual que antes, no se quitó
// ninguna función:
// - props.data     -> footerData: columnas de links (o botones sueltos)
// - props.title / props.address / props.social / props.googleLink /
//   props.location / props.copyright / props.email / props.phone /
//   props.logo -> vienen del schema "settings"
// - props.lang     -> idioma activo (rutas internas + copys bilingües)
// - El selector de tema (ThemeSwitch) se mantiene (no estaba en la
//   referencia, pero es una función que ya existía en el sitio) — se
//   dejó chiquito, pegado a la derecha de la barra negra, para no
//   competir visualmente con el copyright centrado.
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/generalUse/container";
import ThemeSwitch from "@/components/generalUse/themeSwitch";
import NewsletterForm from "@/components/navigation/NewsletterForm";
import SocialLink from "@/components/generalUse/socialIcons";
import { urlForImage } from "@/lib/sanity/image";

const COPY = {
  es: {
    description:
      "Bienes raíces en Panamá: casas, apartamentos y terrenos en venta y alquiler, con acompañamiento en cada paso.",
    rights: "@copyright Solutekpty",
  },
  en: {
    description:
      "Real estate in Panama: houses, apartments, and land for sale and rent, with support at every step.",
    rights: "@copyright Solutekpty",
  },
};

// Links legales/de cumplimiento (Términos, Privacidad, Cookies -- ver
// app/(website)/[lang]/{terms,privacy,cookies}/page.js, creadas en el
// Task #57). El usuario reportó que el link de "Términos y condiciones"
// "no lleva a ningún lugar" -- esos 3 links viven hoy como contenido
// dinámico en Sanity (footerData), así que un editor pudo haber cargado
// un href vacío o incorrecto (ej. "/" en vez de "/terms") y no hay forma
// de arreglar ESE contenido desde el código (vive en el Studio). En vez
// de depender de que el link esté bien cargado en Sanity, se hardcodean
// acá con la ruta real y siempre correcta -- así nunca pueden quedar
// rotos sin importar lo que haya (o no haya) en Sanity, y quedan
// garantizados los 3 (antes sólo existía, roto, el de Términos).
const LEGAL_LINKS = {
  es: [
    { href: "/terms", label: "Términos y Condiciones" },
    { href: "/privacy", label: "Política de Privacidad" },
    { href: "/cookies", label: "Política de Cookies" },
  ],
  en: [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

// Detecta si un link de footerData (título o href) es en realidad uno
// de estos 3 links legales, para no mostrarlo duplicado (una vez, roto,
// arriba en las columnas dinámicas de Sanity; y otra vez, correcto, en
// la barra inferior de abajo).
const LEGAL_PATTERN = /t[ée]rmino|terms?\b|privac|cookies?/i;
function isLegalLink(item) {
  const title = (item?.title || "").toString();
  const href = (item?.href || item?.path || "").toString();
  return LEGAL_PATTERN.test(title) || LEGAL_PATTERN.test(href);
}

// Quita links legales de un arreglo de footerData (nivel superior y,
// si un item trae children, también dentro de sus children), para que
// splitIntoColumns() nunca reparta uno de estos links en las columnas
// dinámicas -- sólo se muestran, siempre correctos, en LEGAL_LINKS.
function stripLegalLinks(items) {
  return (items || [])
    .filter(item => !isLegalLink(item))
    .map(item =>
      item?.children?.length > 0
        ? { ...item, children: item.children.filter(child => !isLegalLink({ title: child?.title, href: child?.path })) }
        : item
    );
}

// Reparte footerData en 3 columnas. Hay dos modos, elegidos según lo
// que realmente exista en Sanity (sin inventar contenido nuevo):
//
// 1) "Agrupado": si hay 3 o más items de nivel superior, cada uno se
//    reparte a una columna. Si alguno tiene children, se listan sus
//    children (en negrita, igual que la referencia); si no, el item
//    mismo es el link.
//
// 2) "Aplanado": si footerData sólo tiene 1 item de nivel superior
//    (con sus children), agruparlo por item dejaba 1 columna llena y
//    2 vacías -> no se veía como la referencia de 3 columnas parejas.
//    En este caso se toman todos los links "hoja"
//    (los children de ese item, o el item mismo si no tiene children)
//    y se reparten uno por uno entre las 3 columnas. En cuanto
//    agregues 2 grupos más en Sanity, el modo 1 toma el control solo.
function flattenLeafLinks(items) {
  const leaves = [];
  items.forEach(item => {
    if (item?.children?.length > 0) {
      item.children.forEach(child =>
        leaves.push({ title: child.title, href: child.path, key: child.id || child.title })
      );
    } else {
      leaves.push({ title: item?.title, href: item?.href, external: item?.external, button: item?.button, key: item?.id || item?.title });
    }
  });
  return leaves;
}

function splitIntoColumns(items, columns = 3) {
  const useFlatMode = items.length < columns;
  const source = useFlatMode ? flattenLeafLinks(items) : items;

  const buckets = Array.from({ length: columns }, () => []);
  source.forEach((entry, index) => buckets[index % columns].push(entry));
  return { buckets, flat: useFlatMode };
}

// Un link de footerData ya resuelto a string por idioma (ver
// lib/sanity/groq.js -> allfooterquery). Mantiene el caso especial
// del link a "/studio" (Sanity Studio: sin prefijo de idioma, se abre
// en pestaña nueva), igual que en la versión anterior de este archivo.
// Texto en negrita y negro sólido, igual que en la referencia (ahí
// ningún link de columna se ve gris/apagado).
function FooterLink({ href, label, lang, external, button }) {
  const isStudio = href === "/studio";
  const finalHref = external || isStudio ? href : `/${lang}${href || ""}`;

  return (
    <Link
      href={finalHref}
      target={external || isStudio ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={
        button
          ? "inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-85"
          : "text-[15px] font-bold text-black transition-opacity hover:opacity-60"
      }
    >
      {label}
    </Link>
  );
}

// Columnas de navegación: SIN encabezado de grupo, calcando la
// referencia (ahí "Home / Home 2 / About..." es una lista plana).
function FooterColumn({ items, lang, flat }) {
  if (!items?.length) return null;

  if (flat) {
    return (
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item.key || `${item.title}-${index}`}>
            <FooterLink
              href={item?.href}
              label={item?.title}
              lang={lang}
              external={item?.external}
              button={item?.button}
            />
          </li>
        ))}
      </ul>
    );
  }

  // Modo "agrupado": si un item trae children, sus children se listan
  // uno tras otro (sin repetir el título del padre, para mantener la
  // misma lista plana que la referencia).
  const flatWithinGroup = items.flatMap(item =>
    item?.children?.length > 0
      ? item.children.map(child => ({ title: child.title, href: child.path, key: child.id || child.title }))
      : [{ title: item?.title, href: item?.href, external: item?.external, button: item?.button, key: item?.id || item?.title }]
  );

  return (
    <ul className="space-y-4">
      {flatWithinGroup.map((item, index) => (
        <li key={item.key || `${item.title}-${index}`}>
          <FooterLink
            href={item?.href}
            label={item?.title}
            lang={lang}
            external={item?.external}
            button={item?.button}
          />
        </li>
      ))}
    </ul>
  );
}

export default async function Footer(props) {
  const { data = [], lang, extraLegalLinks = [] } = props;
  const t = COPY[lang] || COPY.es;
  const logoSrc = props?.logo ? urlForImage(props.logo) : null;

  const { buckets, flat } = splitIntoColumns(stripLegalLinks(data), 3);
  const [col1, col2, col3] = buckets;

  return (
    <footer className="bg-brand-light">
      <Container large alt className="py-16 md:py-20">
        {/* Una sola fila con 5 secciones. `items-start` fuerza a que
            las 5 arranquen exactamente en el mismo borde superior sin
            importar cuántos links tenga cada columna (footerData hoy
            es corto, así que dejar que el grid "estire" las celdas
            como antes generaba espacios dispares y el logo terminaba
            en una altura distinta según la columna más larga). */}
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr] lg:gap-8">
          {/* 1) Newsletter arriba, descripción, logo al final */}
          <div className="flex flex-col">
            <NewsletterForm lang={lang} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-black/50">
              {t.description}
            </p>

            {/* Logo al final de esta sección, con margen fijo (en vez
                de empujarlo con mt-auto) para que su posición sea
                siempre predecible, y más grande para que se note bien
                como cierre de marca del footer. */}
            <Link
              href={`/${lang}`}
              className="mt-10 inline-flex items-center gap-2.5 text-black"
            >
              {logoSrc?.src ? (
                <Image
                  {...logoSrc}
                  alt={props?.logo?.alt || props?.title || "Logo"}
                  width={220}
                  height={72}
                  className="h-14 w-auto object-contain md:h-16"
                />
              ) : (
                <span className="text-3xl font-extrabold tracking-tight text-black md:text-4xl">
                  {props?.title}
                </span>
              )}
            </Link>
          </div>

          {/* 2, 3, 4) Columnas de navegación (dinámicas, footerData) */}
          <FooterColumn items={col1} lang={lang} flat={flat} />
          <FooterColumn items={col2} lang={lang} flat={flat} />
          <FooterColumn items={col3} lang={lang} flat={flat} />

          {/* 5) Contacto: correo / teléfono / dirección + redes */}
          <div>
            <ul className="space-y-4 text-[15px] font-semibold text-black">
              {props?.email && (
                <li>
                  <a href={`mailto:${props.email}`} className="transition-opacity hover:opacity-60">
                    {props.email}
                  </a>
                </li>
              )}
              {props?.phone && (
                <li>
                  <a href={`tel:${props.phone}`} className="transition-opacity hover:opacity-60">
                    {props.phone}
                  </a>
                </li>
              )}
              {/* El campo "address" en Sanity a veces trae texto largo
                  tipo bio de Instagram (con emojis/hashtags) en vez de
                  una dirección corta; se recorta a 3 líneas para que
                  no rompa el layout de la columna. */}
              {props?.address && (
                <li className="line-clamp-3 max-w-[220px] font-normal text-black/70">
                  {props.address}
                </li>
              )}
              {props?.googleLink && (
                <li>
                  <Link
                    href={props.googleLink}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-black/70 transition-colors hover:text-black"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {props?.location}
                  </Link>
                </li>
              )}
            </ul>

            {props?.social?.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {props.social.map((item, index) => (
                  <li key={item.id || `${item.media}-${index}`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black hover:text-white [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]">
                      <SocialLink platform={item.media} link={item.url} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>

      {/* Barra inferior negra: una sola línea de copyright, centrada,
          igual que en la referencia (sin el crédito a la agencia de
          la plantilla, que no aplica a este sitio). El selector de
          tema se mantiene (función existente) a la derecha, chico. */}
      <div className="bg-black">
        <Container large alt className="py-5">
          <div className="relative flex flex-col items-center justify-center gap-3">
            {/* Links legales, siempre presentes y siempre correctos (ver
                LEGAL_LINKS arriba) -- resuelve la queja de "Términos y
                condiciones no lleva a ningún lugar" y agrega Privacidad
                y Cookies, que todavía no tenían link en el footer. */}
            <nav aria-label={lang === "es" ? "Enlaces legales" : "Legal links"}>
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
                {(LEGAL_LINKS[lang] || LEGAL_LINKS.es).map(item => (
                  <li key={item.href}>
                    <Link
                      href={`/${lang}${item.href}`}
                      className="text-xs font-semibold text-white/50 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* Políticas adicionales creadas desde Sanity (legalPage --
                    ver lib/sanity/schemas/legalPage.js). Se agregan DESPUÉS
                    de los 3 links de siempre, sin tocarlos, para que el
                    cliente pueda sumar las políticas que le pidan Google,
                    Facebook, etc. sin que un desarrollador toque código. */}
                {extraLegalLinks.map(item => (
                  <li key={item.slug}>
                    <Link
                      href={`/${lang}/legal/${item.slug}`}
                      className="text-xs font-semibold text-white/50 transition-colors hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="text-center text-sm text-white">
              {new Date().getFullYear()} — {props?.copyright || props?.title}. {t.rights}
            </p>
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-white/60 sm:block">
              <ThemeSwitch />
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
