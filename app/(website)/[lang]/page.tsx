import HomePage from "./home";
import { getAllPosts, getLandingData2 } from "@/lib/sanity/client";
import { Suspense } from "react";
import Loading from "./loading";

export async function generateStaticParams() {
  const langs = ["en", "es"]; // Add your supported languages here
  const params = langs.map(lang => ({
      lang,
  }));
  return params;
}

export default async function IndexPage({ params }: {params:{lang: string}}) {
  const posts = await getAllPosts(params.lang);
  const data = await getLandingData2(params.lang);

  return (
    <Suspense fallback={<Loading />}>
      <HomePage posts={posts} landingData={data} lang={params.lang} />
    </Suspense>
  );
}

// export const revalidate = 60;
