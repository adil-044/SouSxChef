#!/usr/bin/env python3
"""SousXChef SEO daily post agent — restaurant ops genre."""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT = Path(__file__).resolve().parent
BLOG_DIR = ROOT / "content" / "blog"
QUEUE_PATH = AGENT / "queue.json"
PUBLISHED_PATH = AGENT / "published.json"
KEYWORDS_PATH = AGENT / "keywords.json"

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
DEFAULT_MODEL = "tencent/hy3:free"
FREE_MODELS = [
    "tencent/hy3:free",
    "openai/gpt-oss-20b:free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-nano-9b-v2:free",
]


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:80] or "post"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def next_topic(queue: dict, published: dict) -> dict | None:
    used = {p.get("keyword", "").lower() for p in published.get("published", [])}
    remaining = [item for item in queue.get("queue", []) if item.get("keyword", "").lower() not in used]
    queue["queue"] = remaining
    return remaining[0] if remaining else None


def free_model_chain(cfg: dict) -> list[str]:
    models = list(cfg.get("free_models") or FREE_MODELS)
    primary = cfg.get("model") or DEFAULT_MODEL
    if primary not in models:
        models.insert(0, primary)
    seen: set[str] = set()
    out: list[str] = []
    for m in models:
        if m not in seen:
            seen.add(m)
            out.append(m)
    return out


def call_openrouter(prompt: str, models: list[str]) -> tuple[str, str]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set")
    try:
        from openai import OpenAI
    except ImportError as e:
        raise RuntimeError("Install openai: pip install openai") from e

    client = OpenAI(api_key=api_key, base_url=OPENROUTER_BASE)
    errors: list[str] = []
    for model in models:
        try:
            print(f"Trying free model: {model}")
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            content = (response.choices[0].message.content or "").strip()
            if not content:
                errors.append(f"{model}: empty")
                continue
            return content, model
        except Exception as e:
            errors.append(f"{model}: {e}")
            print(f"Model failed: {model} — {e}")
    raise RuntimeError("All free models failed: " + " | ".join(errors))


def strip_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json|JSON)?\n", "", text)
        text = re.sub(r"\n```$", "", text)
    return text.strip()


def build_prompt(topic: dict, today: str) -> str:
    return f"""You write SEO blog posts for SousXChef (sousxchef.online) — AI agents for restaurants.

GENRE: restaurant owners, inventory, labor scheduling, WhatsApp/Telegram staff chat, food cost, demand forecasting.
NOT resumes, NOT ATS, NOT generic AI hype.

VOICE: pain-first, practical, terse. No fake named case studies. Soft CTA once toward https://sousxchef.online/onboarding

TARGET KEYWORD: {topic['keyword']}
ANGLE: {topic.get('angle', '')}
DATE: {today}

Return ONLY valid JSON (no markdown fences) matching this schema:
{{
  "slug": "kebab-case-slug",
  "title": "SEO title with keyword",
  "description": "meta under 160 chars",
  "primaryKeyword": "{topic['keyword']}",
  "secondaryKeywords": ["related1", "related2", "related3"],
  "publishedAt": "{today}",
  "updatedAt": "{today}",
  "readingMinutes": 8,
  "author": "SousXChef",
  "sections": [
    {{
      "heading": "H2 text",
      "paragraphs": ["para1", "para2"],
      "bullets": ["optional", "bullets"]
    }}
  ],
  "faq": [
    {{"q": "question?", "a": "answer"}}
  ]
}}

Requirements:
- 5–8 sections, 3–5 FAQ items
- Primary keyword in title, description, and at least one heading
- readingMinutes between 7 and 12
- One section should mention SousXChef softly as a kitchen brain / agent option
"""


def fallback_post(topic: dict, today: str) -> dict:
    keyword = topic["keyword"]
    angle = topic.get("angle", "Practical guide for restaurant owners")
    slug = f"{slugify(keyword)}-{today.replace('-', '')}"
    return {
        "slug": slug,
        "title": f"{keyword[0].upper() + keyword[1:]}: A Practical 2026 Guide",
        "description": f"{angle}. Written for restaurant owners who live service.",
        "primaryKeyword": keyword,
        "secondaryKeywords": ["AI restaurant management", "restaurant inventory", "kitchen ops"],
        "publishedAt": today,
        "updatedAt": today,
        "readingMinutes": 8,
        "author": "SousXChef",
        "sections": [
            {
                "heading": "Why this still hurts every week",
                "paragraphs": [
                    f"Most owners feel **{keyword}** as chaos: texts at 10pm, guesswork on Sunday, and tools nobody opens during service.",
                    "The fix is not another ignored dashboard. It’s a rhythm your crew will actually run when tickets are flying.",
                ],
            },
            {
                "heading": angle,
                "paragraphs": [
                    "Start from the loudest weekly failure—86s, overtime, or inventory DMs—and work backward to the minimum system that removes it.",
                ],
                "bullets": [
                    "Measure the pain for two weeks (texts, 86s, overtime hours)",
                    "Pick one channel staff already use (Telegram / WhatsApp / SMS)",
                    "Automate answers and alerts before you automate reports",
                    "Review pars and covers weekly—not only at month-end P&L",
                ],
            },
            {
                "heading": "Where SousXChef fits",
                "paragraphs": [
                    "SousXChef is a kitchen brain: inventory photo logs, labor hints, and staff chat answers—so owners stop living in their DMs.",
                    "Pilot on your top SKUs and busiest channel. Measure texts avoided and under-par saves.",
                ],
            },
        ],
        "faq": [
            {
                "q": f"What is {keyword}?",
                "a": f"In practice, {keyword} means systems and habits that cut chaos during service—not just software licenses.",
            },
            {
                "q": "Will my team actually use another app?",
                "a": "Only if it meets them where they already communicate and removes a real weekly pain in the first 30 days.",
            },
            {
                "q": "How do I start?",
                "a": "Run a two-week pilot on one pain (inventory, labor, or staff Q&A). If the metric doesn’t move, change the tool—not your standards.",
            },
        ],
    }


def already_run_today(today: str) -> bool:
    stamp = AGENT / "last_run.txt"
    if not stamp.exists():
        return False
    return stamp.read_text(encoding="utf-8").strip() == today


def mark_run(today: str) -> None:
    (AGENT / "last_run.txt").write_text(today + "\n", encoding="utf-8")


def validate_post(data: dict, keyword: str, today: str) -> dict:
    required = [
        "slug",
        "title",
        "description",
        "primaryKeyword",
        "secondaryKeywords",
        "publishedAt",
        "updatedAt",
        "readingMinutes",
        "author",
        "sections",
        "faq",
    ]
    for key in required:
        if key not in data:
            raise ValueError(f"missing {key}")
    if not isinstance(data["sections"], list) or len(data["sections"]) < 3:
        raise ValueError("need >=3 sections")
    if not isinstance(data["faq"], list) or len(data["faq"]) < 2:
        raise ValueError("need >=2 faq")
    data["primaryKeyword"] = keyword
    data["publishedAt"] = today
    data["updatedAt"] = today
    data["author"] = data.get("author") or "SousXChef"
    data["slug"] = slugify(str(data["slug"])) or f"{slugify(keyword)}-{today.replace('-', '')}"
    return data


def main() -> int:
    force_fallback = "--fallback" in sys.argv
    cfg = load_json(KEYWORDS_PATH)
    queue = load_json(QUEUE_PATH)
    published = load_json(PUBLISHED_PATH)
    today = date.today().isoformat()

    if "--once-per-day" in sys.argv and already_run_today(today):
        print(f"Already ran today ({today}) — skip.")
        return 0

    topic = next_topic(queue, published)
    if not topic:
        print("Queue empty — nothing to publish.")
        return 0

    print(f"Topic: {topic['keyword']}")

    use_fallback = force_fallback or not os.getenv("OPENROUTER_API_KEY")
    if use_fallback:
        post = fallback_post(topic, today)
        print("Using fallback template (no API / --fallback).")
    else:
        try:
            raw, used = call_openrouter(build_prompt(topic, today), free_model_chain(cfg))
            print(f"Generated with: {used}")
            post = validate_post(json.loads(strip_fences(raw)), topic["keyword"], today)
        except Exception as e:
            print(f"API failed ({e}); writing fallback post.")
            post = fallback_post(topic, today)

    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    # Avoid slug collision with existing inventory post
    path = BLOG_DIR / f"{post['slug']}.json"
    if path.exists():
        post["slug"] = f"{post['slug']}-{today.replace('-', '')}"
        path = BLOG_DIR / f"{post['slug']}.json"
    path.write_text(json.dumps(post, indent=2) + "\n", encoding="utf-8")

    queue["queue"] = [q for q in queue.get("queue", []) if q.get("keyword") != topic["keyword"]]
    published.setdefault("published", []).append(
        {
            "slug": post["slug"],
            "keyword": topic["keyword"],
            "date": today,
            "title": post["title"],
        }
    )
    save_json(QUEUE_PATH, queue)
    save_json(PUBLISHED_PATH, published)
    mark_run(today)

    print(f"Published: {path.relative_to(ROOT)}")
    print(f"URL path: /blog/{post['slug']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
