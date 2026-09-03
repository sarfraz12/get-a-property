// app/(website)/[lang]/home.js
//
// Ensamblador de la home. Cada sección de abajo viene de "landingPage"
// en Sanity (así el editor arma la página sin tocar código). Este
// archivo NO cambia esa lógica (qué se muestra, con qué datos, en qué
// orden) — solo se ordenó el espaciado alrededor de cada sección para
// que todas respiren igual (mismo padding horizontal, mismo ritmo
// vertical), en vez de que cada bloque tuviera su propio padding suelto.
"use client";
import Container from "@/components/generalUse/container";
import PostList from "@/components/posts/postlist";
import CtaCard from "@/components/cards/ctaCard";
import CardIcon from "@/components/cards/cardIcon";
import ServiceDescription from "@/components/cards/serviceDescription";
import { useState, useMemo } from "react";
import { urlForImage } from "@/lib/sanity/image";
import Hero from "@/components/generalUse/hero";
import Featured from "@/components/sliders/featured";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ComparisonServicesSection from "@/components/sections/ComparisonServicesSection";
import CertificationLogosSection from "@/components/sections/CertificationLogosSection";
import AboutSection from "@/components/sections/AboutSection";
import RecentPostsSection from "@/components/sections/RecentPostsSection";
import TeamSection from "@/components/sections/TeamSection";
import ContactCtaSection from "@/components/sections/ContactCtaSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import { buildCategoryGroupsFromPosts } from "@/lib/categoryFilters";

import dynamic from "next/dynamic";

// Estos componentes se cargan solo en el navegador (ssr: false): no son
// críticos para el primer pintado (LCP) de la home, así que se difieren.
const InfiniteSlider = dynamic(() => import("@/components/sliders/infiniteSlider"), { ssr: false });
const Carousel = dynamic(() => import("@/components/generalUse/courosel"), { ssr: false });
const FormSlider = dynamic(() => import("@/components/sliders/formSlider"), { ssr: false });
const TestimonialSection = dynamic(() => import("@/components/generalUse/testimonialSection"), { ssr: false });

export default function Home({ posts, landingData, lang, post, featuredCategories }) {
  const landing = landingData?.[0];

  // Post marcado como "producto principal" en Sanity
  const mainPost = useMemo(() => posts.find((p) => p.productMain === true) || null, [posts]);

  // BUG REAL corregido: los grupos de categorías reales (Ubicación /
  // Propiedad / Oferta) se armaban en lib/categoryFilters.ts pero
  // nunca se pasaban al Hero -- así que la píldora de filtros del
  // carrusel (HeroFilters) nunca tenía datos y no se mostraba nunca,
  // sin importar cuántas categorías reales hubiera en Sanity.
  const categoryGroups = useMemo(() => buildCategoryGroupsFromPosts(posts), [posts]);

  // Datos de "Sobre nuestra empresa" y "Nuestro equipo", resueltos acá
  // (no dentro de los componentes) porque necesitan aplanar los
  // arreglos que vienen de Sanity (párrafos/estadísticas/palabras son
  // objetos {text}/{value,label}/{word}, no strings sueltos) y resolver
  // la URL de cada foto de integrante con urlForImage. Si Sanity trae
  // el arreglo vacío o con ítems incompletos, se pasa "undefined" (no
  // un arreglo vacío) para que cada sección pueda distinguir "no hay
  // nada cargado todavía" y ocultarse por completo.
  const aboutParagraphs = landing?.aboutParagraphs?.map(p => p?.text).filter(Boolean);
  const aboutStats = landing?.aboutStats
    ?.filter(s => s?.value && s?.label)
    .map(s => ({ value: s.value, label: s.label }));
  const aboutWords = landing?.aboutWords?.map(w => w?.word).filter(Boolean);
  const teamMembers = landing?.teamMembers
    ?.filter(m => m?.name)
    .map(m => ({
      name: m.name,
      role: m.role,
      email: m.email,
      phone: m.phone,
      image: urlForImage(m.image)?.src,
    }));

  // Columnas dinámicas para la grilla de "keyActivities" (1 a 3 columnas)
  const itemCount = landing?.keyActivities?.length || 1;
  const columnCount = Math.min(Math.max(itemCount, 1), 3);
  const activitiesGridClass =
    columnCount === 1 ? "md:grid-cols-1" : columnCount === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  if (!posts || !landingData) {
    return <p>Content unavailable</p>;
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* ===== 01 - HERO =====
          Título / descripción / texto y link del botón vienen del campo
          general de "landingPage" (grupo "Generales" en el schema:
          landing.title / landing.description / landing.buttonText /
          landing.buttonLink), no del arreglo "hero" (ese arreglo sigue
          siendo sólo el carrusel de imágenes + filtros -- landing.hero[0]
          se sigue spreadeando para eso, y para el respaldo de imágenes).
          Se renderiza siempre (ya no depende de que exista landing.hero[0]):
          el componente Hero ya trae sus propios placeholders de imagen,
          botón y filtros para cuando el arreglo del carrusel está vacío. */}
      <Hero
        {...landing?.hero?.[0]}
        title={landing?.title}
        description={landing?.description}
        buttonText={landing?.buttonText}
        buttonLink={landing?.buttonLink}
        categoryGroups={categoryGroups}
        lang={lang}
      />

      {/* ===== 01.2 - Categorías (justo debajo del hero) =====
          Ahora usa las categorías marcadas "featured" en Sanity (con
          su propia imagen), no las derivadas de los posts. */}
      <CategoriesSection categories={featuredCategories} lang={lang} />

      {/* ===== 01.5 - About (título + stats + barra de palabras infinita) =====
          Todo el contenido viene de landingPage -> fieldset "aboutSection"
          en Sanity. Si no hay nada real cargado, AboutSection se oculta
          sola (ver components/sections/AboutSection.tsx). */}
      <AboutSection
        lang={lang}
        title={landing?.aboutTitle}
        paragraphs={aboutParagraphs}
        stats={aboutStats}
        buttonText={landing?.aboutButtonText}
        buttonLink={landing?.aboutButtonLink}
        words={aboutWords}
      />


      {/* ===== 03 - Comparación / gancho ===== */}
      {landing?.comparisonCard?.slice(1, 2).map((element, index) => (
        <ComparisonSection data={element} lang={lang} key={index} />
      ))}

      {/* ===== B - Producto principal ===== */}
      {mainPost && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 md:pt-20 lg:px-8">
          <PostList
            key={mainPost._id}
            post={mainPost}
            minimal
            aspect="landscape"
            fontWeight="large"
            preloadImage
            isMain
            lang={lang}
          />
        </section>
      )}

      {/* ===== B.2 - Publicaciones recientes (grilla estilo "property card")
          Máximo 3 tarjetas en el landing page. ===== */}
      <RecentPostsSection posts={posts} lang={lang} excludeId={mainPost?._id} limit={4} />

      {/* ===== Post destacado por título ===== */}
      {post && <Featured pathPrefix="all" post={post} />}

      {/* ===== CTA (primera) ===== */}
      {landing?.ctaContentCards?.slice(0, 1).map((item, index) => (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" key={item.id || `${item.title}-${index}`}>
          <CtaCard
            title={item?.ctaCardTitle}
            subTitle={item?.ctaCardSubtitle}
            description={item?.ctaCardDescription}
            buttonMessage={item?.ctaCardButtonMessage}
            buttonLink={item?.ctaCardButtonLink}
            imageAlt={item?.ctaCardImageAlt}
            image={urlForImage(item?.ctaCardImage)}
            lang={lang}
          />
        </div>
      ))}

      {/* ===== Comparación (segunda) ===== */}
      {landing?.comparisonCard?.slice(1, 2).map((item, index) => (
        <ComparisonServicesSection key={item?._key || index} data={item} lang={lang} />
      ))}

      {/* ===== Tarjetas de servicio (imagen/texto alterno) ===== */}
      {landing?.ServiceCards?.map((item, index) => (
        <div key={item.id || `${item.title}-${index}`} className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <ServiceDescription
            title={item?.serviceCardTitle}
            description={item?.serviceCarddescription}
            description2={item?.serviceCarddescription2}
            imageSrc={urlForImage(item?.serviceCardImage)}
            reverse={item?.serviceCardReverse}
            points={item?.contentCardPoints}
            animation={item?.serviceCardAnimation}
            lang={lang}
          />
        </div>
      ))}

      {/* ===== Carrusel parallax ===== */}
      {landing?.sliders?.[0] && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Carousel images={landing.sliders} />
        </div>
      )}

      {/* ===== Cinta de logos (abajo) ===== */}
      {landing?.infinitSlider?.slice(1, 2).map((element, index) => (
        <InfiniteSlider lang={lang} dataImage={element?.items} key={element.id || `${element.title}-${index}`} />
      ))}


      {/* ===== Equipo =====
          Integrantes vienen de landingPage -> fieldset "teamSection" ->
          "teamMembers" en Sanity. Si no hay ninguno cargado, TeamSection
          se oculta sola (ver components/sections/TeamSection.tsx). */}
      <TeamSection
        lang={lang}
        title={landing?.teamTitle}
        description={landing?.teamDescription}
        team={teamMembers}
      />

      {/* ===== Actividades clave + CTA (segunda) ===== */}
      <Container>
        {landing?.keyActivities && (
          <div className={`grid gap-6 md:gap-8 ${activitiesGridClass}`}>
            {landing.keyActivities.map((item, index) => (
              <CardIcon data={item} key={item._key || item.id || index} lang={lang} />
            ))}
          </div>
        )}

        {landing?.ctaContentCards?.slice(0, 1).map((item, index) => (
          <div className="mt-14" key={`cta-second-${index}`}>
            <CtaCard
              title={item?.ctaCardTitle}
              subTitle={item?.ctaCardSubtitle}
              description={item?.ctaCardDescription}
              buttonMessage={item?.ctaCardButtonMessage}
              buttonLink={item?.ctaCardButtonLink}
              imageAlt={item?.ctaCardImageAlt}
              image={urlForImage(item?.ctaCardImage)}
              lang={lang}
            />
          </div>
        ))}
      </Container>

      {/* ===== Testimonios ===== */}
      {landing?.testimonialSection?.[0] && (
        <TestimonialSection
          title={landing.testimonialSection[0]?.title}
          backgroundImage={landing.testimonialSection[0]?.backgroundImage}
          testimonials={landing.testimonialSection[0]?.testimonials}
        />
      )}

      {/* ===== Formulario final ===== */}
      {landing?.formSlider?.[0] && <FormSlider {...landing.formSlider[0]} />}

      {/* ===== Post reciente + contacto rápido =====
          BUG REAL corregido: antes no se le pasaban title/description/
          buttonText a ContactCtaSection -- la tarjeta negra ("¿Todavía
          tienes una pregunta?") siempre mostraba el copy fijo del
          componente, sin forma de editarla desde Sanity (ver los 3
          campos nuevos "contactCta*" en landingPage.js, fieldset
          "Tarjeta de contacto"). Si se dejan vacíos en Sanity, el
          componente sigue cayendo en el mismo copy de respaldo bilingüe
          de siempre. */}
      <ContactCtaSection
        lang={lang}
        post={posts?.[0]}
        title={landing?.contactCtaTitle}
        description={landing?.contactCtaDescription}
        buttonText={landing?.contactCtaButtonText}
      />
    </div>
  );
}
