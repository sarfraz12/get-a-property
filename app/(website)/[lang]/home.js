"use client"
import Container from "@/components/generalUse/container";
import PostList from "@/components/posts/postlist";
// import ComparisonCard from "@/components/cards/ComparisonCard"
// import ClientSlider from "@/components/sliders/client"
import CtaCard from "@/components/cards/ctaCard";
import CardIcon from "@/components/cards/cardIcon";
import ServiceDescription from "@/components/cards/serviceDescription";
// import SkeletonLoader from "@/components/generalUse/SkeletonLoader";//falback
// import Link from "next/link";
import { useState, useMemo } from 'react';
import { urlForImage } from "@/lib/sanity/image";
import Hero from "@/components/generalUse/hero";
import Featured from "@/components/sliders/featured";
import ComparisonSection from "@/components/sections/ComparisonSection"
import ComparisonServicesSection from "@/components/sections/ComparisonServicesSection";
import CertificationLogosSection from "@/components/sections/CertificationLogosSection";

import dynamic from "next/dynamic";

const InfiniteSlider = dynamic(
  () => import("@/components/sliders/infiniteSlider"),
  { ssr: false }
);

const Carousel = dynamic(
  () => import("@/components/generalUse/courosel"),
  { ssr: false }
);

const FormSlider = dynamic(
  () => import("@/components/sliders/formSlider"),
  { ssr: false }
);

const TestimonialSection = dynamic(
  () => import("@/components/generalUse/testimonialSection"),
  { ssr: false }
);


export default function Home({ posts, landingData, lang, post }) {

  const landing = landingData?.[0];

  // POSTS call
  const mainPost = useMemo(() =>
    posts.find(post => post.productMain === true) || null,
    [posts]);

  const featuredPosts = useMemo(() =>
    posts.filter(post => post.featured === true && post._id !== mainPost?._id),
    [posts, mainPost]);


  // this is for Activities section, add dynamic columns
  const itemCount = landing?.keyActivities?.length || 1;
  const columnCount = Math.min(Math.max(itemCount, 1), 3);

  if (!posts || !landingData) {
    return (
      <p>Content unavailable</p>

    );
  }

  return (
    <>
      {/* Top-level wrapper: allow horizontal hidden but don't clip vertical flow */}
      <div className="w-full max-w-[1920px] mx-auto overflow-x-hidden">

        {/* ===== 01 - HERO SECTION ===== */}
        {landing?.hero?.[0] && (
          <section className="w-full">
            <Hero {...landing?.hero?.[0]} />
          </section>
        )}

        {/* ===== 02 - Infinite Slider (top) ===== */}
        {landing?.infinitSlider?.slice(0, 1).map((element, index) => (
          <InfiniteSlider
            lang={lang}
            dataImage={element?.items}
            key={element.id || `${element.title}-${index}`}
          />

        ))}

        {/* ===== 03 - Comparison / Hook Section ===== */}
        {landing?.comparisonCard?.slice(1, 2).map((element, index) => (
          <ComparisonSection
            data={element}
            lang={lang}
            key={index}
          />
        ))}


        {/* ===== B - CONTENT SECTION (posts) ===== */}
        <section className="px-4 py-10 md:px-10 md:py-16 lg:px-20 lg:py-20">

          {mainPost && (
            <div>
              {/* Main Post */}
              <div className="grid ">
                <PostList
                  key={mainPost._id}
                  post={mainPost}
                  minimal={true}
                  aspect="landscape"
                  fontWeight="large"
                  preloadImage={true}
                  isMain={true} // 👈 this triggers the big version
                />
              </div>

              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="grid gap-8 mt-12 md:grid-cols-2 xl:grid-cols-3">
                  {featuredPosts.map(post => (
                    <PostList key={post._id} post={post} aspect="square" />
                  ))}
                </div>
              )}
            </div>
          )}

        </section>

        {/* ===== FEATURED SPECIFIC POST (by title) ===== */}
        {post &&
          <Featured pathPrefix="all" post={post} />
        }


        {/* ===== CTA Card (first) ===== */}
        {landing?.ctaContentCards?.slice(0, 1).map((item, index) => (
          <div className="m-5" key={item.id || `${item.title}-${index}`}>
            <CtaCard
              title={item?.ctaCardTitle}
              subTitle={item?.ctaCardSubtitle}
              description={item?.ctaCardDescription}
              buttonMessage={item?.ctaCardButtonMessage}
              buttonLink={item?.ctaCardButtonLink}
              imageAlt={item?.ctaCardImageAlt}
              image={urlForImage(item?.ctaCardImage)}
            />
          </div>
        ))}

        {/* ===== Comparison Card (slice 1,2) ===== */}
        {landing?.comparisonCard?.slice(1, 2).map((item, index) => (
          <ComparisonServicesSection
            key={item?._key || index}
            data={item}
            lang={lang}
          />
        ))}

        {/* ===== Service Cards (Left/Right description sections) ===== */}

        {landing?.ServiceCards?.map((item, index) => (
          <div key={item.id || `${item.title}-${index}`} className="  md:p-12 p-10">
            <ServiceDescription
              title={item?.serviceCardTitle}
              description={item?.serviceCarddescription}
              description2={item?.serviceCarddescription2}
              imageSrc={urlForImage(item?.serviceCardImage)}
              reverse={item?.serviceCardReverse}
              points={item?.contentCardPoints}
              animation={item?.serviceCardAnimation}
            />
          </div>
        ))}

        {/* ===== Carousel Parallax (sliders) ===== */}
        {landing?.sliders?.[0] && (

          <Carousel images={landing?.sliders} />

        )}

        {/* ===== Brands logo slider (infinite) ===== */}
        {landing?.infinitSlider?.slice(1, 2).map((element, index) => (
          <InfiniteSlider
            lang={lang}
            dataImage={element?.items}
            key={element.id || `${element.title}-${index}`}
          />

        ))}
        {/* Certification Logo */}
        <CertificationLogosSection
          className="object-contain grayscale hover:grayscale-0 transition duration-300"
          title={lang === "en" ? "Our Certifications" : "Nuestras Certificaciones"}
          logos={[
            {
              image: "/images/sticker certificado halal.png",
              alt: "Halal Certified Logo",
            },
            {
              image: "/images/kosher.png",
              alt: "Kosher Certified Logo",
            },
            {
              image: "/images/Hecho en Panama.jpg",
              alt: "Kosher Certified Logo",
            },

          ]}
        />

        {/* ===== Activities grid ===== */}
        <Container>
          {landing?.keyActivities && (
            <div className={`h-full p-5`}>

              <div className={`grid p-5 md:gap-4 gap-2 ${columnCount === 1
                ? "md:grid-cols-1"
                : columnCount === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
                }`}>

                {landing?.keyActivities && landing?.keyActivities.map((item, index) =>
                  <div key={item._key || item.id || index}>
                    <CardIcon data={item} key={item.id || `${item.title}-${index}`} lang={lang} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== CTA Card (second) ===== */}
          {landing?.ctaContentCards?.slice(0, 1).map((item, index) => (
            <CtaCard
              key={`cta-second-${index}`}
              title={item?.ctaCardTitle}
              subTitle={item?.ctaCardSubtitle}
              description={item?.ctaCardDescription}
              buttonMessage={item?.ctaCardButtonMessage}
              buttonLink={item?.ctaCardButtonLink}
              imageAlt={item?.ctaCardImageAlt}
              image={urlForImage(item?.ctaCardImage)}
            />
          ))}
        </Container>

        {/* ===== Testimonials ===== */}
        {landing?.testimonialSection?.[0] && (
          <TestimonialSection
            title={landing?.testimonialSection[0]?.title}
            backgroundImage={landing?.testimonialSection[0]?.backgroundImage}
            testimonials={landing?.testimonialSection[0]?.testimonials}
          />
        )
        }

        {/* ===== Form Slider ===== */}
        {landing?.formSlider?.[0] && (
          <FormSlider
            {...landing?.formSlider?.[0]}
          />
        )
        }

      </div>
    </>
  );
}
