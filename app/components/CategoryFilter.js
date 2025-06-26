"use client";

import Link from "next/link";

export default function CategoryFilter({ currentSlug, categories }) {
  return (
    <ul className="filtercategory mt-6 mb-5 flex gap-2 flex-wrap">
        <li><Link
            href="/stories" className={`px-3 py-1 rounded-full ${
              currentSlug === "stories"
                ? "bg-green-600 text-white"
                : "  hover:bg-green-600 hover:text-white"
            } transition-colors`}>All updates</Link> </li>
      {categories.map((cat) => (
        <li key={cat.slug}>
          <Link
            href={`/stories/${cat.slug}`}
            className={`px-3 py-1 rounded-full ${
              cat.slug === currentSlug
                ? "bg-green-600 text-white"
                : "  hover:bg-green-600 hover:text-white"
            } transition-colors`}
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
