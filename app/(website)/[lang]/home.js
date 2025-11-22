"use client"
import Container from "@/components/generalUse/container";
import Carousel from "@/components/generalUse/courosel";
import PostList from "@/components/posts/postlist";
import ComparisonCard from "@/components/cards/ComparisonCard"
import ClientSlider from "@/components/sliders/client"
import CtaCard from "@/components/cards/ctaCard";
import CardIcon from "@/components/cards/cardIcon";
import ServiceDescription from "@/components/cards/serviceDescription";
import SkeletonLoader from "@/components/generalUse/SkeletonLoader";//falback
import Link from "next/link";
import { useState } from 'react';
import { urlForImage } from "@/lib/sanity/image";
import Hero from "@/components/generalUse/hero";
import InfiniteSlider from "@/components/sliders/infiniteSlider";
import Featured from "@/components/sliders/featured";
import TestimonialSection from "@/components/generalUse/testimonialSection";
import FormSlider from "@/components/sliders/formSlider"

export default function Home({ posts, landingData, lang }) {

  // POSTS call
  const mainPost = posts.find(post => post.productMain === true) || null;
  const featuredPosts = posts.filter(
    post => post.featured === true && post._id !== mainPost?._id
  );
  const postTitle = "post 2"; // the title you are looking for
  const postByTitle = posts.find(post => post.title === postTitle) || null;

  // State to control how many cards are displayed
  const [showAll, setShowAll] = useState(false);

  // Function to toggle between showing the first 3 and all cards
  const toggleShowAll = () => setShowAll(!showAll);

  // this is for Activities section, add dynamic columns
  const itemCount = landingData[0]?.keyActivities?.length || 1;
  const columnCount = Math.min(Math.max(itemCount, 1), 3);

  if (!landingData?.[0]) {
    return (
      <div className="px-6 py-12">
        <SkeletonLoader lines={6} />
      </div>
    );
  }

  return (
    <>
      {/* A-HERO SECTION */}

      {/* 02-HERO-Hero Slider */}
      {landingData[0]?.hero?.[0] && (
        < div className="@container mt-0.5">
          <Hero {...landingData[0]?.hero?.[0]} />
        </div>
      )}

      {/* 03-HERO- InfiniteSlider */}
      {landingData[0]?.infinitSlider?.slice(0, 1).map((element, index) => (
        <InfiniteSlider
          lang={lang}
          dataImage={element?.items}
          key={element.id || `${element.title}-${index}`}
        />

      ))}
      {/*  04--HERO- SERVICE AND HOOK SECTION  */}
      {
        landingData[0]?.comparisonCard?.slice(0, 1).map((item, index) => {

          const cardsToShow = showAll ? item?.items : item?.items?.slice(0, 3);

          return (
            <section className="px-6 py-12 grid md:grid-cols-2" key={index}>
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

              {/* Comparison Items */}
              <div className="max-w-xl mx-auto space-y-4 w-full">
                {cardsToShow?.map((item, index) => (
                  <ComparisonCard
                    key={index}
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
        })
      }

      {/* B-SECTION OF CONTENT */}
      <Container>


        {/* 01-POST SECTION */}

        {mainPost && (
          <div>
            {/* Section title */}
            {/* <div className="flex items-center justify-center m-5">
              <h1 className="text-2xl dark:text-white text-black ">
                <strong>{landingData[0].title}</strong>
              </h1>
            </div> */}

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
              <div className="grid gap-10 mt-20 lg:gap-10 md:grid-cols-2 xl:grid-cols-3 ">
                {featuredPosts.map(post => (
                  <PostList key={post._id} post={post} aspect="square" />
                ))}
              </div>
            )}
          </div>
        )}

      </Container>

      {/* 00-FEATURED POST  */}
      {postByTitle &&
        <Featured pathPrefix="all" post={postByTitle} />
      }


      {/* 00-BODY-CTA CARD */}

      {landingData[0]?.ctaContentCards?.slice(0, 1).map((item, index) => (
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

      {/* 00-BODY - Comparison Card */}
      {landingData[0]?.comparisonCard?.slice(1, 2).map((item, index) => {

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

      {/* 01- Left / Right Descriptions with photos */}

      {landingData[0]?.ServiceCards?.map((item, index) => (
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

      {/* 02-body Slider Images Parallax */}
      {landingData[0]?.sliders?.[0] && (
        < div className="@container">
          <Carousel images={landingData[0]?.sliders} />
        </div >
      )}

      {/* Brands logo slider */}
      {landingData[0]?.infinitSlider?.slice(1, 2).map((element, index) => (

        // {/* Title aligned to the left */ }
        <InfiniteSlider
          lang={lang}
          dataImage={element?.items}
          key={element.id || `${element.title}-${index}`}
        />

      ))}

      {/* SECTION OF ACTIVITIES CARDS */}
      <Container>
        <div className={`h-full p-5`}>

          <div className={`grid p-5 md:grid-cols-${columnCount} md:gap-4 gap-2`}>

            {landingData[0]?.keyActivities && landingData[0]?.keyActivities.map((item, index) =>
              <div key={item._key || item.id || index}>
                <CardIcon data={item} key={item.id || `${item.title}-${index}`} lang={lang} />
              </div>
            )}
          </div>
        </div>

        {/* CTA CARD */}
        {landingData[0]?.ctaContentCards?.slice(0, 1).map((item, index) => (
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

      {/* BODY-Testimonials */}
      {landingData[0]?.testimonialSection?.[0] && (
        <TestimonialSection
          title={landingData[0]?.testimonialSection[0]?.title}
          backgroundImage={landingData[0]?.testimonialSection[0]?.backgroundImage}
          testimonials={landingData[0]?.testimonialSection[0]?.testimonials}
        />
      )
      }

      {/* BODY-FormSlider */}
      {landingData[0]?.formSlider?.[0] && (
        <FormSlider
          {...landingData[0]?.formSlider?.[0]}
        />
      )
      }


    </>
  );
}
