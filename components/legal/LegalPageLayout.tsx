// components/legal/LegalPageLayout.tsx
//
// Layout compartido para las 3 páginas legales del sitio (Términos y
// Condiciones, Política de Privacidad, Política de Cookies -- ver
// app/(website)/[lang]/terms|privacy|cookies/page.js). Reutiliza
// EXACTAMENTE el mismo patrón visual que ya usa la página "Nosotros"
// para su texto largo (Container + clases "prose", ver
// app/(website)/[lang]/aboutUs/about.js) para que estas páginas se
// vean como parte del mismo sitio y no como algo pegado aparte, sin
// inventar ningún componente/estilo nuevo.
//
// "sections" es un array de { heading, body } -- "body" es HTML
// simple (ya viene escapado/controlado desde los archivos de
// contenido bilingüe de cada página, no de datos de usuario) que se
// inyecta con dangerouslySetInnerHTML para poder usar <p>/<ul>/<li>/
// <strong> reales dentro de cada sección sin tener que armar un
// parser de contenido nuevo sólo para 3 páginas de texto estático.
import Container from "@/components/generalUse/container";
import { PortableText } from "@/lib/sanity/plugins/portabletext";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageLayoutProps {
  h1: string;
  intro?: string;
  lastUpdatedLabel?: string;
  // "sections" (HTML de lib/legalContent.js) sigue existiendo para las
  // 3 páginas legales estáticas de siempre (Términos/Privacidad/
  // Cookies). "body" (NUEVO) es para las páginas legales dinámicas
  // creadas desde Sanity (lib/sanity/schemas/legalPage.js) -- ahí el
  // contenido ya viene como blockContent real, así que se renderiza
  // con el mismo <PortableText> que ya usan los posts, en vez de HTML
  // armado a mano. Se admite uno u otro (nunca los dos a la vez).
  sections?: LegalSection[];
  body?: any;
}

export default function LegalPageLayout({ h1, intro, lastUpdatedLabel, sections, body }: LegalPageLayoutProps) {
  return (
    <Container large alt className="pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">{h1}</h1>
        {lastUpdatedLabel && (
          <p className="mt-4 text-sm font-semibold text-black/50">{lastUpdatedLabel}</p>
        )}
        {intro && (
          <p className="mt-6 text-lg leading-relaxed text-black/70">{intro}</p>
        )}

        {(sections?.length || body) && (
          <div
            className="prose prose-lg mt-10 max-w-none
              prose-headings:font-extrabold prose-headings:text-black
              prose-p:leading-relaxed prose-p:text-black/70
              prose-a:font-semibold prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:font-bold prose-strong:text-black
              prose-li:text-black/70 prose-ul:list-disc prose-ol:list-decimal"
          >
            {sections?.length ? (
              sections.map((section, index) => (
                <section key={index}>
                  <h2>{section.heading}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.body }} />
                </section>
              ))
            ) : (
              <PortableText value={body} />
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
