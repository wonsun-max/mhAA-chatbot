# WITHUS — Manila Hankuk Academy Community Platform

**Live service: [mhawithus.shop](https://mhawithus.shop/)**

WITHUS is a school community platform I designed, built, and operate alone for Manila Hankuk Academy (Antipolo, Philippines). It started from a simple frustration: timetables, meal plans, exam schedules, and GPA tools were scattered across chat rooms, paper notices, and word of mouth. WITHUS puts them in one place — and keeps improving based on what students actually ask for.

## Why I built it

Our school had no unified digital channel. Students asked the same questions every day ("What's for lunch?", "When is the exam?"), and announcements got lost in group chats. As the Student Council Broadcast & Media Department manager, I saw this information gap up close — so I decided to solve it with software instead of waiting for someone else to.

## Core features

- **Campus info hub** — timetable, meal schedule, school calendar, and exam dates in one dashboard
- **AI assistant** — a chatbot grounded in verified school data (schedules, regulations, dormitory guidelines), so it answers from facts instead of hallucinating
- **Anonymous community board** — nested recursive comments, likes, and view counts for safe student discussion
- **Admin workflow** — account approval and moderation tools so the community stays safe

## What I learned building it (the honest part)

- **Hallucination is a real product problem, not a buzzword.** Early versions of the chatbot invented schedules. I fixed it by restricting the model to reference only a verified school database (a basic retrieval-augmented generation approach) — reliability went from "fun demo" to "students actually trust it."
- **Users tell you what to build.** After launch, feedback showed people mostly wanted two things faster: today's meal and chatbot follow-up questions. I added conversation context retention and a meal-priority display in response.
- **Nested comments are harder than they look.** Designing a recursive comment tree in a relational schema (Prisma + PostgreSQL) taught me more about data modeling than any tutorial.

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Prisma + PostgreSQL · Vercel AI SDK (GPT-4o) · NextAuth · Framer Motion

## Context

Solo project, designed and developed during Grade 11–12 at Manila Hankuk Academy, deployed and used as a real service by the school community. This is the platform referred to as "WITHUS" in my school records.
