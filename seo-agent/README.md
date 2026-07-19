# SousXChef SEO / GEO — restaurant genre

Same daily pipeline as HireReady, different keywords (inventory, labor, staff chat).

## Local cron

`5 13 * * *` → `seo-agent/run_daily.sh` (09:05 Toronto — 5 min after HireReady)

Uses the **same** OpenRouter key via symlink to `/root/resume-ats/seo-agent/.env`.
Free models only (`tencent/hy3:free` + fallbacks).

```bash
seo-agent/run_daily.sh
tail -f seo-agent/logs/daily.log
```

Posts land in `content/blog/*.json` → `/blog/[slug]`.
