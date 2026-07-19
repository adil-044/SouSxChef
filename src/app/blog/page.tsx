import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Restaurant inventory, labor & AI ops | SousXChef",
  description:
    "Practical guides on restaurant inventory management software, AI labor scheduling, and kitchen ops—written for owners who live service.",
  alternates: { canonical: "https://sousxchef.online/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <Navbar entranceComplete />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
          SousXChef Blog
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.05] text-white">
          Kitchen ops, without the spreadsheet fiction.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
          Guides on restaurant inventory management software, labor, forecasting, and staff
          chat—so you can rank less chaos and more covers.
        </p>

        <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {post.publishedAt} · {post.readingMinutes} min read
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 block font-display text-[1.65rem] leading-snug text-white transition hover:text-[var(--ember)]"
              >
                {post.title}
              </Link>
              <p className="mt-3 text-[14px] leading-relaxed text-white/50">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ember)]"
              >
                Read guide →
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
