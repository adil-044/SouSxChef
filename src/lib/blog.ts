import fs from "fs";
import path from "path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** Primary keyword target */
  primaryKeyword: string;
  secondaryKeywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  author: string;
  /** Sections rendered as JSX in the page */
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  faq: { q: string; a: string }[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function loadPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      return JSON.parse(raw) as BlogPost;
    })
    .filter((p) => p?.slug && p?.title);
}

export function getPost(slug: string) {
  return loadPosts().find((p) => p.slug === slug);
}

export function getAllPosts() {
  return loadPosts().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
