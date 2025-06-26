"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/app/components/header";
import Link from "next/link";
import CategoryFilter from "@/app/components/CategoryFilter";

const CATEGORY_MAP = [
  { id: 11, name: "Price", slug: "price" },
  { id: 4, name: "Acquisition", slug: "acquisition" },
  { id: 5, name: "Funding", slug: "funding" },
  { id: 6, name: "Partnerships", slug: "partnerships" },
  { id: 7, name: "Leadership", slug: "leadership" },
  { id: 8, name: "VC", slug: "vc" },
  { id: 9, name: "Startup", slug: "startup" },
  { id: 10, name: "New Product", slug: "new-product" },
  { id: 1, name: "Others", slug: "others" },
];

export default function StoriesBySlug() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const categoryData = CATEGORY_MAP.find((cat) => cat.slug === slug);
  const categoryId = categoryData?.id;

  const fetchPosts = useCallback(async () => {
    if (!categoryId) return;

    try {
      const res = await axios.get(
        `https://coinw2.wpenginepowered.com/wp-json/wp/v2/posts?_embed&per_page=5&page=${page}&categories=${categoryId}`
      );
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...res.data]);
      }
    } catch (err) {
      setHasMore(false);
    }
  }, [categoryId, page]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [slug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!loader.current || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <main className="dashboardmain">
      <div className="flex items-center px-4 py-2 bg-[#121212] text-white border-b border-neutral-800">
        <a
          href="/"
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M4 10v10h16V10" />
          </svg>
          Home
        </a>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>

        <span className="text-sm text-white font-medium capitalize">{slug}</span>
      </div>

      <Header />

      <div className="mxwidth mt-4">
        {/* Category Filter */}
        <CategoryFilter currentSlug={slug} categories={CATEGORY_MAP} />


        {/* Posts List */}
        <div className="space-y-6 mt-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-md border border-neutral-800"
            >
               <Link href={`/news/${post.slug}`} >
              {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <img
                  src={post._embedded["wp:featuredmedia"][0].source_url}
                  alt={post.title.rendered}
                  className="w-full h-48 object-cover"
                />
              )}
</Link>
              <div className="p-4 space-y-2">
                <h2
                  className="text-xl font-semibold text-white"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <p
                  className="text-sm text-gray-400"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <div className="text-xs text-gray-500 flex justify-between pt-2">
                  <span>
                    {new Date(post.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>{post._embedded?.author?.[0]?.name || "Unknown Author"}</span>
                </div>

                {/* <div className="bg-neutral-900 rounded-lg mt-4 p-3">
                  <div className="flex justify-between text-sm items-center mb-2">
                    <span className="flex items-center gap-2 text-white">
                      <span>🟠</span> BTC/USD
                    </span>
                    <span className="text-white font-semibold">$103,000</span>
                    <span className="bg-green-600 text-xs px-2 py-0.5 rounded">
                      +5.43% • 24h
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="flex items-center gap-2 text-white">
                      <span>🔵</span> ETH/USD
                    </span>
                    <span className="text-white font-semibold">$2,551.23</span>
                    <span className="bg-red-600 text-xs px-2 py-0.5 rounded">
                      -5.43% • 24h
                    </span>
                  </div>
                </div> */}
              </div>
            </article>
          ))}

          {hasMore && (
            <div ref={loader} className="text-center py-6 text-gray-400">
              Loading more...
            </div>
          )}
          {!hasMore && (
            <div className="text-center py-6 text-gray-500">No more articles.</div>
          )}
        </div>
      </div>
    </main>
  );
}
