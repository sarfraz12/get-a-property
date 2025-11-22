"use client"
import Container from "@/components/generalUse/container";
import SearchInput from "@/components/ui/search";
import PostList from "@/components/posts/postlist";
import { notFound } from "next/navigation";
import Link from "next/link";
import Label from "@/components/ui/label";
import { useState } from 'react';
import Pagination from "@/components/navigation/pagination";

const POSTS_PER_PAGE = 6;

export default function Author(props) {
  const { internalPosts, title, categories } = props;

  if (!internalPosts) {
    notFound();
  }

  // pagination code 
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the current page of data
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = internalPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <Container>
      <>
        <Searchbar lang={props.lang} />
        <div className="mt-2 mb-3 text-3xl font-semibold tracking-tight text-center text-brand-primary lg:text-4xl dark:text-white">
          <h3 className="text-2xl font-bold dark:text-white">
          {props.lang === "es" ? "Categorías" : "Categories" }
          </h3>
          <ul className="grid gap-2 mt-10 lg:gap-2 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => (
              <li key={item._id}>
                <Link
                  href={`${!props.lang?"": "/" + props.lang}/${item.slug.current}`}
                  className="flex items-center gap-2 select-none 
                   whitespace-nowrap rounded-lg border border-slate-300 hover:border-green-300
                  py-1.5 px-3 font-sans text-xs font-bold uppercase text-white"
                >
                  <h4 className="text-black dark:text-gray-400">
                    {item.title}
                  </h4>
                  <Label color={item.color} nomargin={false} pill={true}>
                    {item.count}
                  </Label>

                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold tracking-tight lg:leading-tight text-brand-primary lg:text-5xl dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-gray-600">{posts.length} Posts</p>
      </div>
      <div className="grid gap-10 mt-20 lg:gap-10 md:grid-cols-2 xl:grid-cols-3 ">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" pathPrefix="all" lang={props.lang} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(internalPosts.length / POSTS_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}


function Searchbar(props) {

  return (
    <div>
      <h3 className="text-2xl font-bold dark:text-white">
        {props.lang === "es" ? "Buscar por Contenido" : "Search by Content" }
      </h3>
      <form action={`/${props.lang}/search`} method="GET" className="mt-4">
        <SearchInput placeholder="Search" />
      </form>
    </div>
  );
}

