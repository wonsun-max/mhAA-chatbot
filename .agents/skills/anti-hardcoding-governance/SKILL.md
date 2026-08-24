---
name: anti-hardcoding-governance
description: >-
  Strict anti-hardcoding architectural governance and implementation runbook for the WITHUS platform.
  Enforces 100% database persistence (PostgreSQL/Prisma), live real-time API/RSS streaming,
  and dynamic configuration over static mock arrays or hardcoded dummy content.
---

# Strict Anti-Hardcoding Governance & Dynamic Data Architecture

This skill defines the mandatory coding standards, database patterns, and live streaming architectures to ensure **ZERO HARDCODING** in the WITHUS codebase.

---

## 1. Core Principles (Zero-Tolerance Policy)

```
❌ STRICTLY FORBIDDEN:
- Static arrays of mock/dummy data in UI components (e.g., const mockNotices = [...], const staticVideos = [...])
- Hardcoded fake posts, comments, notices, timetable slots, meal menus, or feedback cards
- Hardcoded user emails, personal credentials, or static channel video lists

✅ MANDATORY ARCHITECTURE:
- 1. Database-Driven (Prisma & PostgreSQL): User content, notices, feedback, timetable, calendar, exam schedules
- 2. Live API/RSS Stream Ingestion: YouTube XML feeds, Instagram JSON stream, external live feeds
- 3. Environment Variables: API secrets, feed URLs, webhook endpoints, database credentials
```

---

## 2. Implementation Blueprints by Data Type

### A. Media & Video Feeds (YouTube / Live Video)
* **Rule**: NEVER hardcode video arrays or titles.
* **Pattern**: Extract the channel's official `channelId` (e.g., `UCPqu4EoU8kdXPAqs03Zo9Xg`) and query the live YouTube XML feed:
  ```ts
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    next: { revalidate: 1800 } // Auto-revalidates every 30 minutes
  });
  ```
* **Result**: When the channel uploads a new video, the website updates automatically in real time without any code edits.

### B. Social Feeds & Notices (Instagram / News)
* **Rule**: NEVER hardcode static cards or dummy notice items.
* **Pattern**: Ingest live JSON/XML feed via `syncInstagramFromRss()`, deduplicate by `/p/<shortcode>`, and store/upsert directly into the `Notice` table in PostgreSQL.
* **Result**: Live posts are stored in the database and fetched via `prisma.notice.findMany()`.

### C. User Input, Ideas & Bug Reports (Feedback)
* **Rule**: NEVER use static external links (e.g. Google Forms) or in-memory arrays.
* **Pattern**: Save directly to the `Feedback` table in PostgreSQL via `POST /api/feedback` and manage in real time on `/admin`.

### D. Academic Data (Meals, Calendars, Timetables, Exams)
* **Rule**: Stored in and queried from Prisma database models (`SchoolMeal`, `SchoolCalendar`, `Timetable`, `ExamSchedule`).
* **Pattern**: Admin updates data via `/admin/collab` dashboard; students query real-time database endpoints.

---

## 3. Dynamic Fallback & Empty State Protocol

When external APIs or feeds return 0 items or encounter network latency:
1. **NEVER inject hardcoded dummy data as fallback.**
2. Render a clean, branded **Empty State** with a direct link to the official channel or refresh trigger:
   ```tsx
   {videos.length === 0 ? (
     <EmptyState message="해당 채널의 최신 영상을 불러오는 중입니다" channelUrl={channelUrl} />
   ) : (
     videos.map(v => <VideoCard key={v.id} video={v} />)
   )}
   ```

---

## 4. Verification Checklist Before Any Commit

- [ ] Are there any static arrays of fake user data, notices, or media items in this file?
- [ ] Is all persistent data queried from Prisma or a live streaming API?
- [ ] Are third-party identifiers (Channel IDs, Feed URLs) configured via live endpoints or env vars?
- [ ] Did `npm run build` pass with 0 errors?
