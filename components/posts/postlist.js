"use client";

import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";
import { useRef, useState, useEffect } from "react";

export default function PostList({
  post = {},
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight,
  lang,
  animation = "animate-fadeInScale",
  isMain = false,
}) {
  const imageProps = post?.mainImage
    ? urlForImage(post.mainImage)
    : null;

  const authorImageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;

  // Animation visibility
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const postUrl = `${!lang ? "" : "/" + lang}/${
    pathPrefix ? `${pathPrefix}/` : "all/"
  }post/${post.slug?.current}`;

  return (
    <div
      ref={sectionRef}
      className={cx(
        "group w-full transition-all duration-500",
        minimal ? "grid gap-8 md:grid-cols-2 items-center" : "flex flex-col",
        isVisible ? `opacity-100 ${animation}` : "opacity-0"
      )}
    >
      {/* IMAGE */}
      <div
        className={cx(
          "relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800",
          isMain
            ? "h-[240px] sm:h-[320px] md:h-[480px] lg:h-[560px]"
            : "aspect-[4/3]"
        )}
      >
        <Link href={postUrl} className="block h-full w-full">
          {imageProps ? (
            <Image
              src={imageProps.src}
              alt={post.mainImage?.alt || "Thumbnail"}
              fill
              priority={preloadImage}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <PhotoIcon className="h-12 w-12" />
            </div>
          )}
        </Link>
      </div>

      {/* TEXT CONTENT */}
      <div className="mt-6 md:mt-0 px-2 sm:px-4">
        <CategoryLabel
          lang={lang}
          categories={post.categories}
          nomargin={minimal}
        />

        {/* TITLE */}
        <h2
          className={cx(
            isMain
              ? "text-xl sm:text-2xl md:text-4xl font-bold leading-tight"
              : "text-lg sm:text-xl font-semibold",
            "mt-3 text-black dark:text-white"
          )}
        >
          <Link href={postUrl}>{post.title}</Link>
        </h2>

        {/* EXCERPT */}
        {post.excerpt && (
          <p
            className={cx(
              "mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400",
              isMain ? "line-clamp-4 md:line-clamp-none" : "line-clamp-3"
            )}
          >
            {post.excerpt}
          </p>
        )}

        {/* AUTHOR + DATE */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {post.author?.name && (
            <>
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                  {authorImageProps && (
                    <Image
                      src={authorImageProps.src}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  )}
                </div>
                <span>{post.author.name}</span>
              </div>

              <span>•</span>
            </>
          )}

          <time dateTime={post?.publishedAt || post._createdAt}>
            {format(
              parseISO(post?.publishedAt || post._createdAt),
              "MMMM dd, yyyy"
            )}
          </time>
        </div>
      </div>
    </div>
  );
}