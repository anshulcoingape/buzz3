'use client';

import { useEffect, useState, useRef } from 'react';
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

    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`⚠️ No post found for slug "${slug}"`);
      return null;
    }

    const post = data[0];

    // Fetch all post slugs and find prev/next
    const allRes = await fetch(`https://coinw2.wpenginepowered.com/wp-json/wp/v2/posts?_fields=slug,id&per_page=100`);
    const allPosts = await allRes.json();
    const index = allPosts.findIndex(p => p.id === post.id);
    const prev = allPosts[index - 1];
    const next = allPosts[index + 1];
    post.previous_slug = prev?.slug || null;
    post.next_slug = next?.slug || null;

    return post;
  } catch (err) {
    console.error(`❌ Error fetching post by slug "${slug}":`, err);
    return null;
  }
}

export default function PostClient({ slug }) {
  const [post, setPost] = useState(null);
  const [nextSlug, setNextSlug] = useState(null);
  const [previousSlug, setPreviousSlug] = useState(null);
  const loadingRef = useRef(false);
  const touchStartY = useRef(null);

  // Prevent scrolling the page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Load first post
  useEffect(() => {
    if (!slug) return;
    loadPost(slug, true);
  }, [slug]);

  const loadPost = async (slugToLoad, isInitial = false) => {
    if (!slugToLoad || loadingRef.current || slugToLoad === 'undefined') return;
    loadingRef.current = true;

    const data = await getPostBySlug(slugToLoad);
    if (data) {
      setPost(data);
      setNextSlug(data.next_slug);
      setPreviousSlug(data.previous_slug);

      if (!isInitial) {
        window.history.pushState({}, '', `/stories/${data.slug}`);
      }
    }

    loadingRef.current = false;
  };

  // Scroll/swipe logic
  useEffect(() => {
    let cooldown = false;
    const delay = 1000;

    const triggerLoad = (direction) => {
      if (cooldown || loadingRef.current) return;
      cooldown = true;

      const slugToLoad = direction === 'down' ? nextSlug : previousSlug;

      if (!slugToLoad || slugToLoad === 'undefined') {
        console.warn('⚠️ Attempted to load invalid slug:', slugToLoad);
        cooldown = false;
        return;
      }

      loadPost(slugToLoad);
      setTimeout(() => {
        cooldown = false;
      }, delay);
    };

    const handleWheel = (e) => {
      if (e.deltaY > 50) triggerLoad('down');
      else if (e.deltaY < -50) triggerLoad('up');
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;

      if (deltaY > 50) triggerLoad('down');
      else if (deltaY < -50) triggerLoad('up');

      touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlug, previousSlug]);

  if (!post) return <p style={{ textAlign: 'center', padding: '20px' }}>Loading…</p>;

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
          <Header></Header>
          <div className='paginations'>

            
          </div>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div className='mxwidth'>
        <ul className='filtercategory'>
<li className='active'>All updates </li>
<li>Price</li>
<li>Acquisition</li>
<li>Funding</li>
<li>Partnerships</li>
<li>Leadership</li>
<li>VC</li>

          </ul>
        <article
          className="Articlebox border-r-4"
          style={{
            maxHeight: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {featuredImage && (
            <div className="FeatreImages" >
              <img
                src={featuredImage}
                alt={post.title.rendered}
                style={{ maxWidth: '100%' }}
              />
            </div>
          )}

          <div className='pagebr p-4'>
          <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} className="titleh " />

          

          <div
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            className="pagecontent"
            style={{ marginTop: '10px' }}
          /></div>
        </article>
      </div></div>
</main>
      {/* Hide scrollbars */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
