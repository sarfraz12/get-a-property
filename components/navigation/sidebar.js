import SearchInput from "@/components/ui/search";
import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import Label from "@/components/ui/label";
import DateTime from "@/components/ui/time";


export default function Sidebar(props) {

 
  return (
    <div className="mt-5 font-sans">
      <Searchbar lang={props.lang} />

      {props.related && (
        <RelatedPosts
          related={props.related}
          pathPrefix={props.pathPrefix}
          lang={props.lang}
        />
      )}
      {props.categories && (
        <Categories categories={props.categories} lang={props.lang} />
      )}
    </div>
  );
}

function Searchbar(props) {
  return (
    <div>
      <h3 className="text-2xl font-bold dark:text-white">
      {props.lang === "es" ? "Buscar Posts" : "Search Posts" }
      </h3>
      <form action="/search" method="GET" className="mt-4">
        <SearchInput placeholder="Search" />
      </form>
    </div>
  );
}

function RelatedPosts({ related, pathPrefix, lang }) {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold dark:text-white">{lang === "es" ? "Relacionados" : "Related" }</h3>
      <div className="grid gap-6 mt-6">
        {related.slice(0, 3).map((item, index) => {
          const imageProps = item?.image
            ? urlForImage(item?.image)
            : null;
          return (
            <Link
              key={index}
              href={`/${lang}/${pathPrefix ? `${pathPrefix}/post/` : "all/"}${
                item.slug.current
              }`}>
              <div className="flex gap-5">
                <div className="relative w-24 h-20 overflow-hidden rounded-md shrink-0">
                  <Image
                    src={imageProps.src}
                    loader={imageProps.loader}
                    alt={item.title || "Thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    <DateTime date={item.date} />
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Categories({ categories, lang }) {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold dark:text-white">
      {lang === "es" ? "Categrías" : "Categories"}
      </h3>
      <ul className="grid mt-4">
        {categories.map((item, index) => (
          <li key={index}>
            <Link
              href={`/${lang}/${item.slug.current}`}
              className="flex items-center justify-between py-2">
              <h4 className="text-gray-800 dark:text-gray-400">
                {item.title}
              </h4>
              <Label pill={true} color={item.color}>
                {item.count}
              </Label>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
