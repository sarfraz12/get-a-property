"use client"
import Container from "@/components/generalUse/container";
import PostList from "@/components/posts/postlist";
import ComparisonCard from "@/components/cards/ComparisonCard"
import ClientSlider from "@/components/sliders/client"
import CtaCard from "@/components/cards/ctaCard";
import CardIcon from "@/components/cards/cardIcon";
import ServiceDescription from "@/components/cards/serviceDescription";
import SkeletonLoader from "@/components/generalUse/SkeletonLoader";//falback
import Link from "next/link";
import { useState, useMemo } from 'react';
import { urlForImage } from "@/lib/sanity/image";
import Hero from "@/components/generalUse/hero";
import Featured from "@/components/sliders/featured";
import ComparisonSection from "@/components/sections/ComparisonSection"

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


export default function Home({ posts, landingData, lang }) {

  const landing = landingData?.[0];

  // POSTS call
  const mainPost = useMemo(() =>
    posts.find(post => post.productMain === true) || null,
    [posts]);

  const featuredPosts = useMemo(() =>
    posts.filter(post => post.featured === true && post._id !== mainPost?._id),
    [posts, mainPost]);

  const postTitle = "post 2"; // the title for the slider to show
  const postByTitle = posts.find(post => post.title === postTitle) || null;

  // State to control how many cards are displayed
  const [showAll, setShowAll] = useState(false);

  // Function to toggle between showing the first 3 and all cards
  const toggleShowAll = () => setShowAll(!showAll);

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
        {landing?.comparisonCard && (
        <ComparisonSection
          data={landing?.comparisonCard?.[0]}
          lang={lang}
        />
        )}

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
        {postByTitle &&
          <Featured pathPrefix="all" post={postByTitle} />
        }


        {/* ===== CTA Card (first) ===== */}
        {landing?.ctaContentCards?.slice(0, 1).map((item, index) => (
          <div className="m-10" key={item.id || `${item.title}-${index}`}>
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
        {landing?.comparisonCard?.slice(1, 2).map((item, index) => {

          const cardsToShow = showAll ? item?.items : item?.items?.slice(0, 5);

          return (
            <section className="px-6 py-12 grid md:grid-cols-2" key={item.id || `${item.title}-${index}`}>
              {/* Comparison Card Title, Link and Description */}
              <div className="text-left max-w-3xl mx-10">
                <h1 className="md:text-4xl text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                  {item?.title}
                </h1>
                <p className="text-gray-500 mb-8 md:text-xl text-lg text-justify">
                  {item?.description}
                </p>
                <Link href={item?.linkPath} className="text-blue-600 font-medium mb-8 inline-block text-md">
                  {item?.linkText} &rarr;
                </Link>
              </div>

              {/* BODY-Comparison Items */}
              <div className="max-w-xl mx-auto space-y-4 w-full">
                {cardsToShow?.map((item, index) => (
                  <ComparisonCard
                    key={item.id || `${item.title}-${index}`}
                    title={item?.title}
                    category={item?.category}
                    color={item?.spanColor}
                    textColor={item?.textColor}
                    link={`/${lang}/${item?.serviceLink}`}
                  />
                ))}

                {/* Toggle Button */}
                <div className="text-left">
                  <button onClick={toggleShowAll} className="text-blue-600 font-medium mt-4">
                    {showAll
                      ? lang === "en"
                        ? "Show Less"
                        : "Mostrar Menos"
                      : lang === "en"
                        ? "See All Services"
                        : "Mostrar Más"}
                  </button>
                </div>
              </div>
            </section>
          );
        })}

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
          < div className="@container">
            <Carousel images={landing?.sliders} />
          </div >
        )}

        {/* ===== Brands logo slider (infinite) ===== */}
        {landing?.infinitSlider?.slice(1, 2).map((element, index) => (
          <InfiniteSlider
            lang={lang}
            dataImage={element?.items}
            key={element.id || `${element.title}-${index}`}
          />

        ))}

        {/* ===== Activities grid ===== */}
        <Container>
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
