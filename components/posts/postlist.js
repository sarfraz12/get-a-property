import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";
import { useRef, useState, useEffect } from "react";

export default function PostList({ post,
  aspect, minimal, pathPrefix,
  preloadImage, fontSize, fontWeight, lang, animation = 'animate-fadeInScale',
  isMain = false, // 👈 add this line

}) {
  const imageProps = post?.mainImage
    ?
    urlForImage(post.mainImage)
    : null;
  const AuthorimageProps = post?.author?.image
    ?
    urlForImage(post.author.image)
    : null;

  // animation handler
  const section1Ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // Adjust threshold as needed
    };

    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible) {
          // Only set visible if it's currently not visible
          setIsVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, observerOptions);
    const section1 = section1Ref.current;

    if (section1) {
      observer.observe(section1);
    }

    return () => {
      if (section1) observer.unobserve(section1);
    };
  }, [isVisible]); // Added isVisible as a dependency

  return (
    <>

      <div
        ref={section1Ref} // Attach ref to the main div for observing visibility
        className={cx(
          "group cursor-pointer transition-all duration-500",
          minimal && "grid gap-10 md:grid-cols-2",
          isVisible ? `opacity-100 ${animation}` : 'opacity-0',
          isMain && "scale-100" // 👈 makes it subtly larger
        )}>
        <div
          className={cx(
            " overflow-hidden rounded-md transition-all hover:scale-105   dark:bg-gray-800",
            isMain ? "h-[480px] md:h-[580px] lg:h-[680px]" : "aspect-square bg-gray-100 " // Trigger when main
          )}>
          <Link
            className={cx(
              "relative block h-full", // h-full so fill() works
              isMain ? "relative block h-full w-full" :
                aspect === "landscape"
                  ? "aspect-video"
                  : aspect === "custom"
                    ? "aspect-[5/4]"
                    : "aspect-square"
            )}
            href={`${!lang ? "" : "/" + lang}/${pathPrefix ? `${pathPrefix}/` : "all/"}post/${post.slug?.current}`}
          >
            {imageProps ? (
              <Image
                src={imageProps.src}
                {...(post.mainImage.blurDataURL && {
                  placeholder: "blur",
                  blurDataURL: post.mainImage.blurDataURL,
                })}
                alt={post.mainImage?.alt || "Thumbnail"}
                priority={preloadImage ? true : false}
                fill
                className={cx(
                  "transition-all duration-500",
                  isMain
                    ? "object-contain object-center scale-110 md:scale-150"
                    : "object-contain object-center"
                )}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-brand-black">
                <PhotoIcon />
              </span>
            )}
          </Link>
        </div>

        <div className={cx(minimal && "flex items-center")}>
          <div>
            <CategoryLabel
              lang={lang}
              categories={post.categories}
              nomargin={minimal}
            />
            <h2
              className={cx(
                isMain
                  ? "text-4xl md:text-5xl font-extrabold leading-tight"
                  : fontSize === "large"
                    ? "text-2xl"
                    : minimal
                      ? "text-3xl"
                      : "text-lg",
                "mt-4 dark:text-white text-black"
              )}>
              <Link
                href={`${!lang ? "" : "/" + lang}/${pathPrefix ? `${pathPrefix}/` : "all/"}post/${post.slug?.current}`}
              >
                <span
                  className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom 
                  bg-no-repeat
                  transition-[background-size]
                  duration-500
                  hover:bg-[length:100%_3px]
                  group-hover:bg-[length:100%_10px]
                dark:from-purple-800 dark:to-purple-900">
                  {post.title}
                </span>
              </Link>
            </h2>

            <div style={{ whiteSpace: 'pre-line' }}>
              {post.excerpt && (
                <p className={cx(
                  "mt-2 text-sm text-brand-black dark:text-brand-light",
                  isMain ? "md:text-2xl leading-tight line-clamp-none text-left" : "line-clamp-3"
                )}>
                  <Link
                    href={`${!lang ? "" : "/" + lang}/${pathPrefix ? `${pathPrefix}/` : "all/"}/post/${post.slug?.current}`}
                    legacyBehavior
                  >
                    {post.excerpt}
                  </Link>
                </p>
              )}
            </div>

            {/* Author Section */}

            <div className="mt-3 flex items-center space-x-3 text-brand-black dark:text-brand-light">
              <Link
                href={'#'}
                legacyBehavior>
                <div className="flex items-center gap-3">
                  <div className="relative h-5 w-5 flex-shrink-0">
                    {imageProps && (
                      <Image
                        src={AuthorimageProps.src}
                        loader={AuthorimageProps.loader}
                        alt={post?.author?.name}
                        className="rounded-full object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                      />
                    )}
                  </div>
                  <span className="truncate @lg:text-sm">
                    {post.author?.name}
                  </span>
                </div>
              </Link>

              {/* Time  section */}

              <span className="text-xs text-brand-dark dark:text-brand">
                &bull;
              </span>
              <time
                className="truncate text-sm"
                dateTime={post?.publishedAt || post._createdAt}>
                {format(
                  parseISO(post?.publishedAt || post._createdAt),
                  "MMMM dd, yyyy"
                )}
              </time>

              <span className="text-xs text-brand-dark dark:text-brand">
                &bull;
              </span>
              {/* 
              <div className="truncate text-sm">
                {getReadingTime(post.alt)}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};