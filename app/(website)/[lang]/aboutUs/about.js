// app/(website)/[lang]/aboutUs/about.js
//
// Página "Nosotros", reescrita completa para calcar la referencia
// (página "About" de EstatePro) con el contenido y las imágenes que
// realmente tenemos hoy. Cada bloque vive en su propio componente
// (mismo patrón que el resto del sitio), conectado acá en orden:
//
//   1. AboutHeroSection   -> título + cifras reales + descripción +
//                            certificaciones + foto de banner
//   2. "Nuestra historia" -> el texto largo (aboutPage.body) que ya
//                            se podía cargar en Sanity -- se mantiene
//                            tal cual, sólo con la tipografía nueva
//   3. WhatWeDoSection    -> "Qué hacemos", 3 tarjetas
//   4. ProcessSection     -> foto + checklist de calidad/proceso
//   5. AboutTeamSection   -> "Nuestro equipo", con datos reales de
//                            Sanity (author) pero SIN fotos de las
//                            personas (a pedido: un diseño sustituto
//                            con las iniciales alcanza)
//   6. CTA final          -> el link "Ponerse en Contacto" que ya
//                            existía, restyled como botón del sitio
//
// Placeholders usados a propósito (documentados en cada componente):
// las fotos de banner/proceso usan imágenes genéricas que ya existen
// en /public/images, sólo para poder ver la interfaz completa. Se
// reemplazan cambiando el "src" en AboutHeroSection.tsx / ProcessSection.tsx
// en cuanto haya fotografía real del lugar/proceso.
import Link from "next/link";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import Container from "@/components/generalUse/container";
import AboutHeroSection from "@/components/sections/AboutHeroSection";
import WhatWeDoSection from "@/components/sections/WhatWeDoSection";
import ProcessSection from "@/components/sections/ProcessSection";
import AboutTeamSection from "@/components/sections/AboutTeamSection";

export default function About({ authors, data, lang }) {
  const ctaText = data?.ctaText || (lang === "es" ? "Ponerse en contacto" : "Get in touch");

  return (
    <>
      <AboutHeroSection
        lang={lang}
        title={data?.title}
        description={data?.description}
        stats={data?.heroStats}
        image={data?.heroImage}
      />

      {/* Texto largo editable desde Sanity (aboutPage.body): admite el
          mismo formato enriquecido (negrita, cursiva, títulos, listas,
          etc.) que el resto del sitio -- ver blockContent.js. Sólo se
          muestra si hay contenido cargado. */}
      {data?.body && (
        <Container large alt className="pb-16 md:pb-24">
          <div
            className="prose prose-lg mx-auto max-w-3xl
              prose-headings:font-extrabold prose-headings:text-black
              prose-p:leading-relaxed prose-p:text-black/70
              prose-a:font-semibold prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:font-bold prose-strong:text-black
              prose-li:text-black/70 prose-img:rounded-2xl"
          >
            <PortableText value={data.body} />
          </div>
        </Container>
      )}

      <WhatWeDoSection lang={lang} heading={data?.whatWeDoHeading} items={data?.whatWeDoItems} />
      <ProcessSection
        lang={lang}
        heading={data?.processHeading}
        description={data?.processDescription}
        items={data?.processItems}
        image={data?.processImage}
      />
      <AboutTeamSection lang={lang} authors={authors} heading={data?.teamHeading} description={data?.teamDescription} />

      {/* CTA final (misma función que el link de antes, restyled).
          Texto editable desde Sanity (aboutPage.ctaText); el link
          siempre lleva a Contacto. */}
      <Container large alt className="pb-20 text-center md:pb-28">
        <Link
          href={`/${lang}/contact`}
          className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-85"
        >
          {ctaText}
        </Link>
      </Container>
    </>
  );
}
