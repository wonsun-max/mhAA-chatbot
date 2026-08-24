---
name: instagram-sync-manager
description: >-
  Comprehensive guide and operational runbook for the WITHUS Instagram (@mha_withus)
  live sync engine, notice portal, multi-image carousel viewer, CSP governance,
  and automated 3-tier background synchronization.
---

# WITHUS Instagram Live Sync & Notice Management Skill

This skill documents the complete architecture, operational procedures, and troubleshooting workflows for the 100% automated Instagram feed integration on the WITHUS platform.

---

## 1. System Architecture Overview

```
[Instagram @mha_withus] 
           │ (Public Posts & Carousel Media)
           ▼
[JSON Feed Stream (RSS.app / JSONFeed v1.1)]
           │ (Feed URL: DEFAULT_INSTAGRAM_FEED_URL)
           ▼
[WITHUS Next.js Ingestion Engine (src/lib/instagram-rss.ts)]
           │
           ├── 1. SWR Visitor Background Trigger (src/app/api/notices/route.ts)
           ├── 2. GitHub Actions 15-Min Scheduler (.github/workflows/instagram-sync.yml)
           └── 3. Vercel Daily Cron (/api/instagram/sync)
           │
           ▼
[Neon PostgreSQL Database (Notice Table: category='Instagram')]
           │
           ▼
[Frontend Presentation Layer]
   ├── /notices: Signature MHA Yellow Window Card Grid + Channel Banner
   ├── /notices/[id]: Interactive Instagram Embed Iframe (Multi-Slide Carousel Swiper)
   └── / (Home): Latest 3 Instagram Cards (NoticesFeed component)
```

---

## 2. Key Components & File Map

| File Path | Purpose |
| :--- | :--- |
| `src/lib/instagram-rss.ts` | Core RSS/JSON parser, multi-image carousel extraction, deduplication, and Prisma upsert logic. |
| `src/app/api/notices/route.ts` | Public notices endpoint with 5-minute SWR non-blocking background auto-sync. |
| `src/app/api/instagram/sync/route.ts` | Dedicated standalone sync endpoint (GET/POST) for automated cron pings. |
| `src/app/api/admin/notices/cleanup-and-seed/route.ts` | Admin purge & re-sync endpoint that strictly eliminates non-Instagram mocks. |
| `src/app/notices/page.tsx` | Main notice portal with `@mha_withus` banner, Story Ring branding, and card grid. |
| `src/app/notices/[id]/page.tsx` | Notice detail view featuring the official 800px full-height Instagram Embed player. |
| `src/components/notices/InstagramCardGraphic.tsx` | Reusable card graphic engine rendering the authentic macOS-styled yellow window card. |
| `next.config.ts` | Content Security Policy (CSP) headers authorizing Instagram frames, scripts, and Google Analytics. |
| `.github/workflows/instagram-sync.yml` | 100% free 15-minute GitHub Actions background scheduler. |
| `vercel.json` | Vercel Hobby-compliant daily cron configuration (`0 1 * * *`). |

---

## 3. Core Operational Procedures

### A. How Automated Synchronization Works
1. **Zero User Configuration**: The system embeds the default feed endpoint:
   `https://rss.app/feeds/v1.1/TKmaaZRoN7kWXrVJ.json`
2. **SWR On-Demand Trigger**: Every time any user visits `/notices` or the home page, if >5 minutes have elapsed since the last check, `syncInstagramFromRss()` executes asynchronously in the background.
3. **GitHub Actions 15-Min Scheduler**: Runs every 15 minutes via GitHub runner (`curl -s -X POST https://mhawithus.shop/api/admin/notices/cleanup-and-seed`).

### B. Multi-Slide Carousel Viewer
- Instagram posts with multiple slides (1080x1350 카드뉴스) are rendered on `/notices/[id]` via the official Instagram Embed player (`height="800"`).
- Users can swipe left/right (`◀` `▶`) across all carousel slides, view comments, and open in Instagram directly.

### C. CSP (Content Security Policy) Rules
When modifying `next.config.ts`, ALWAYS preserve the following directives:
- `frame-src`: Must include `https://www.instagram.com https://*.instagram.com`
- `script-src`: Must include `https://*.instagram.com https://www.instagram.com`
- `connect-src`: Must include `https://analytics.google.com https://*.google.com https://www.google-analytics.com`

---

## 4. Troubleshooting Runbook

### Problem 1: Mock/Dummy notices appear in the feed
**Action**: Call `POST https://mhawithus.shop/api/admin/notices/cleanup-and-seed` (or click "피드 정리 / 리셋" on `/notices`). This strictly deletes all notices without valid Instagram `/p/` links and re-syncs the feed.

### Problem 2: Instagram Embed displays broken icon
**Action**: Check browser console for CSP violations. Ensure `next.config.ts` has `https://www.instagram.com https://*.instagram.com` in `frame-src`.

### Problem 3: Updating the Instagram Feed Source
**Action**: If `@mha_withus` changes handles or feed providers, update `DEFAULT_INSTAGRAM_FEED_URL` in `src/lib/instagram-rss.ts` or set the `INSTAGRAM_RSS_URL` environment variable.
