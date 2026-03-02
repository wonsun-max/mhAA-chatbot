# WITHUS: Chaplaincy Hub

**"God is with us" (임마누엘)**

A dedicated spiritual community platform and mission hub for the Chaplaincy Department. WITHUS combines community coordination with intelligent faith assistance to foster a connected spiritual environment.

## Features
*   **Chaplaincy Hub**: Centralized announcements and mission updates.
*   **Daily Bread**: Daily scripture and memorization challenges.
*   **Faith Assistant**: AI-powered spiritual guidance and coordination support.
*   **Secure Access**: Protected environment with admin approval workflows.
*   **Modern Premium UI**: "Spiritually Modern" interface with fluid animations and typography.

## Tech Stack
*   **Framework**: Next.js 15+ (App Router)
*   **AI**: Vercel AI SDK, OpenAI GPT-4o
*   **Database**: Prisma with PostgreSQL (Neon)
*   **Authentication**: NextAuth.js
*   **Styling**: Tailwind CSS 4+, Framer Motion

## Deployment to Vercel

1.  Push the code to your GitHub repository.
2.  Connect the repository to Vercel.
3.  Configure the following Environment Variables in Vercel:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `NEXTAUTH_SECRET`: A secure random string for authentication.
    *   `NEXTAUTH_URL`: Your production domain (e.g., `https://your-app.vercel.app`).
    *   `OPENAI_API_KEY`: Your OpenAI API key.
    *   `EMAIL_USER`: Your Gmail address for verification codes.
    *   `EMAIL_PASS`: Your Gmail App Password.
4.  Deploy!

---
© 2026 WITHUS. All rights reserved.
