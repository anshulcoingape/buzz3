import PostClient from './PostClient';

export default function Page({ params }) {
  const { slug } = params;

  return <PostClient slug={slug} />;
}
