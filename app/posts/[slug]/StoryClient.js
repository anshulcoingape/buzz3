'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StoryClient({ currentPost }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextArticle, setNextArticle] = useState(null);

  // Fetch next article when currentPost is loaded
  useEffect(() => {
    const fetchNextArticle = async () => {
      // Assuming that next article is available in the next page (page 2)
      const res = await fetch('https://coinw2.wpenginepowered.com/wp-json/wp/v2/posts?_embed&per_page=1&page=2');
      const data = await res.json();
      if (data.length > 0) {
        setNextArticle(data[0]);
      }
    };

    fetchNextArticle();
  }, [currentPost]);

  // Handle the scroll event to detect when the user reaches the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollY + windowHeight >= documentHeight - 10 && !loading && nextArticle) {
        setLoading(true);
        loadNextArticle();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextArticle, loading]);

  // Load the next article and update the URL
  const loadNextArticle = async () => {
    if (!nextArticle) return;

    // Update URL with the next article's slug
    router.push(`/stories/${nextArticle.slug}`);

    // Set the current article to the next one
    setLoading(false);
  };

  return (
    <div>
      <article style={{ padding: '3rem 1rem', minHeight: '100vh' }}>
        <h1 dangerouslySetInnerHTML={{ __html: currentPost.title.rendered }} />
        <div dangerouslySetInnerHTML={{ __html: currentPost.content.rendered }} />
      </article>

      {loading && <p style={{ textAlign: 'center' }}>Loading next article...</p>}
    </div>
  );
}
