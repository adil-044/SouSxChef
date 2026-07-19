import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { getAllPosts, getPost } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://sousxchef.online/blog/${post.slug}`;
  return {
    title: `${post.title} | SousXChef`,
    description: post.description,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords],
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      siteName: "SousXChef",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { "@type": "Organization", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "SousXChef",
          url: "https://sousxchef.online",
        },
        mainEntityOfPage: `https://sousxchef.online/blog/${post.slug}`,
        keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://sousxchef.online",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://sousxchef.online/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://sousxchef.online/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <Navbar entranceComplete />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
        <nav className="font-mono text-[11px] text-white/35">
          <Link href="/" className="hover:text-white/70">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white/70">
            Blog
          </Link>
        </nav>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
          {post.primaryKeyword}
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.05] text-white">
          {post.title}
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-white/60">{post.description}</p>
        <p className="mt-4 font-mono text-[11px] text-white/35">
          Updated {post.updatedAt} · {post.readingMinutes} min read · {post.author}
        </p>

        <div className="mt-12 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-[1.75rem] leading-snug text-white sm:text-[2rem]">
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mt-4 text-[15px] leading-relaxed text-white/65 sm:text-[16px]">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-16 border-t border-white/10 pt-12">
          <h2 className="font-display text-[1.75rem] text-white">FAQ</h2>
          <div className="mt-6 space-y-6">
            {post.faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-[16px] font-medium text-white">{f.q}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="mt-16 border border-[var(--ember)]/40 bg-[var(--steel)] px-6 py-8 text-center sm:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ember)]">
            Next step
          </p>
          <p className="font-display mt-3 text-[1.75rem] text-white">
            Put a brain on your walk-in.
          </p>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-white/55">
            SousXChef connects inventory photos, labor hints, and Telegram staff answers—so
            “we’re out” stops blindsiding service.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="inline-flex h-11 items-center justify-center bg-[var(--ember)] px-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]"
            >
              Get started
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex h-11 items-center justify-center border border-white/25 px-8 font-mono text-[11px] uppercase tracking-[0.16em] text-white"
            >
              See pricing
            </Link>
          </div>
        </aside>
      </article>
    </div>
  );
}
