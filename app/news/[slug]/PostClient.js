'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/app/components/header';

async function getPostBySlug(slug) {
  if (!slug || typeof slug !== 'string' || slug === 'undefined') {
    console.warn('❌ Invalid slug passed to getPostBySlug:', slug);
    return null;
  }

  try {
    const res = await fetch(`https://coinw2.wpenginepowered.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
    if (!res.ok) {
      console.error(`❌ Failed to fetch post for slug "${slug}" (HTTP ${res.status})`);
      return null;
    }

    const data = await res.json();
    return data[0] || null;
  } catch (err) {
    console.error(`❌ Error fetching post by slug "${slug}":`, err);
    return null;
  }
}

export default function PostClient({ slug }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then((data) => {
      if (data) setPost(data);
    });
  }, [slug]);

  if (!post) return <p className="text-center py-10">Loading…</p>;

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <>
      <Head>
        <title>{post.title.rendered}</title>
        <meta name="description" content={post.excerpt.rendered.replace(/<[^>]+>/g, '')} />
        <meta property="og:title" content={post.title.rendered} />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:url" content={`https://coinw2.wpenginepowered.com/stories/${post.slug}`} />
      </Head>

      <main className="dashboardmain">
        <Header />
        <div className="mxwidth px-4 py-6">
      

          <article className="Articlebox border border-neutral-800 rounded-lg bg-[#1e1e1e] overflow-hidden">
            {featuredImage && (
              <div className="FeatreImages">
                <img src={featuredImage} alt={post.title.rendered} className="w-full h-auto" />
              </div>
            )}

            <div className="p-6">
              <h1
                className="text-3xl font-bold text-white mb-4"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              <div
                className="pagecontent text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
