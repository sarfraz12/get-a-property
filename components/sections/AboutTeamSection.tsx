// components/sections/AboutTeamSection.tsx
//
// "Our expert agent" de la referencia, adaptado a "Nuestro equipo" con
// datos reales de Sanity (getAllAuthors). Sin fotos de las personas:
// cada tarjeta es una ficha de contacto elegante (tarjeta blanca con
// borde sutil) con un distintivo circular de iniciales -- más chico y
// discreto que un bloque de color grande -- y los datos de contacto
// en texto (nombre, cargo, email, teléfono) alcanzan para identificar
// a cada quien sin necesidad de su foto.
//
// (Segunda versión de este componente: la primera usaba un cuadro
// grande con degradado de marca de fondo por cada persona; se cambió
// a esta ficha más chica y minimalista a pedido.)
//
// Distinto de components/sections/TeamSection.tsx (la sección del
// home, con fotos circulares y un hover que revela el contacto): acá
// el contacto se muestra siempre, de forma estática -- no depende de
// pasar el mouse por encima.
import Container from "@/components/generalUse/container";

interface Author {
  _id: string;
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
}

interface AboutTeamSectionProps {
  lang: string;
  authors?: Author[];
  heading?: string;
  description?: string;
}

// Acentos de marca que van rotando por tarjeta (anillo del
// distintivo + iniciales), así el equipo no se ve como una fila de
// fichas idénticas. Son clases completas (no armadas con template
// strings) a propósito -- Tailwind sólo genera el CSS de las clases
// que puede leer tal cual en el código fuente.
const ACCENTS = [
  { ring: "border-brand-dark/25", bg: "bg-brand-dark/5", text: "text-brand-dark" },
  { ring: "border-brand-gold/50", bg: "bg-brand-gold/10", text: "text-brand-gold" },
  { ring: "border-black/20", bg: "bg-black/5", text: "text-black" },
  { ring: "border-brand-dark/25", bg: "bg-brand-dark/5", text: "text-brand-dark" },
];

function initialsOf(name?: string) {
  if (!name) return "GP";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
  return `${first}${second}`.toUpperCase();
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 flex-shrink-0">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" />
    </svg>
  );
}

const COPY: Record<string, { heading: string; description: string }> = {
  es: {
    heading: "Nuestro equipo",
    description: "Las personas detrás de cada propiedad que te ayudamos a encontrar.",
  },
  en: {
    heading: "Our team",
    description: "The people behind every property we help you find.",
  },
};

// Contacto por defecto: son los datos REALES de la empresa (los
// mismos que ya se muestran en el footer -- ver settings en Sanity),
// no un placeholder inventado. Se usan cuando a un autor le falta el
// email/teléfono/nombre, para que la tarjeta nunca quede con esos
// datos vacíos.
const DEFAULT_EMAIL = "admin@getaproperty.com.pa";
const DEFAULT_PHONE = "+507 6652-5238";
const DEFAULT_NAME: Record<string, string> = { es: "Equipo Get a Property", en: "Get a Property Team" };

// Si todavía no hay NINGÚN autor cargado en Sanity, se muestran estas
// 4 fichas de relleno (mismo contacto general de la empresa) sólo
// para poder ver cómo queda la sección completa. En cuanto cargues
// autores reales en el Studio, estas desaparecen solas.
const PLACEHOLDER_TEAM: Record<string, { name: string; role: string }[]> = {
  es: [
    { name: "Equipo Get a Property", role: "Fundación" },
    { name: "Equipo Get a Property", role: "Agentes" },
    { name: "Equipo Get a Property", role: "Atención al cliente" },
    { name: "Equipo Get a Property", role: "Ventas" },
  ],
  en: [
    { name: "Get a Property Team", role: "Founder" },
    { name: "Get a Property Team", role: "Agents" },
    { name: "Get a Property Team", role: "Customer care" },
    { name: "Get a Property Team", role: "Sales" },
  ],
};

export default function AboutTeamSection({ lang, authors = [], heading, description }: AboutTeamSectionProps) {
  const t = COPY[lang] || COPY.es;
  const finalHeading = heading || t.heading;
  const finalDescription = description || t.description;
  const defaultName = DEFAULT_NAME[lang] || DEFAULT_NAME.es;

  // Autores reales, completando con el contacto por defecto cualquier
  // dato que falte (nombre, email o teléfono) en vez de dejarlo vacío.
  const realTeam = authors
    .filter(a => a?.name || a?.email || a?.phone)
    .slice(0, 4)
    .map(a => ({
      _id: a._id,
      name: a.name || defaultName,
      role: a.role,
      email: a.email || DEFAULT_EMAIL,
      phone: a.phone || DEFAULT_PHONE,
    }));

  const team =
    realTeam.length > 0
      ? realTeam
      : (PLACEHOLDER_TEAM[lang] || PLACEHOLDER_TEAM.es).map((member, index) => ({
          _id: `placeholder-${index}`,
          name: member.name,
          role: member.role,
          email: DEFAULT_EMAIL,
          phone: DEFAULT_PHONE,
        }));

  return (
    <Container large alt className="pb-20 md:pb-28">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">{finalHeading}</h2>
        <p className="mt-3 text-base text-black/50">{finalDescription}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((author, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <div
              key={author._id}
              className="rounded-2xl border border-black/10 bg-white p-7 transition-shadow hover:shadow-lg"
            >
              {/* Distintivo: círculo con las iniciales, no una foto */}
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-lg font-extrabold ${accent.ring} ${accent.bg} ${accent.text}`}
              >
                {initialsOf(author.name)}
              </div>

              <p className="mt-5 truncate text-lg font-bold text-black">{author.name}</p>
              {author.role && <p className="text-sm text-black/50">{author.role}</p>}

              {(author.email || author.phone) && (
                <div className="mt-4 space-y-1.5 border-t border-black/10 pt-4">
                  {author.email && (
                    <a
                      href={`mailto:${author.email}`}
                      className="flex items-center gap-1.5 truncate text-xs text-black/50 transition-colors hover:text-black"
                    >
                      <MailIcon />
                      {author.email}
                    </a>
                  )}
                  {author.phone && (
                    <a
                      href={`tel:${author.phone}`}
                      className="flex items-center gap-1.5 text-xs text-black/50 transition-colors hover:text-black"
                    >
                      <PhoneIcon />
                      {author.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
