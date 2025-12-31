# MHA AI Assistant 🚀

A high-fidelity, best-in-class digital ecosystem designed for the modern school community. MHA AI Assistant (formerly MissionLink) provides an immersive, secure, and information-rich interface for students and administration.

## ✨ Core Features

### 🌌 Immersive AI Interface
- **Secure Data Uplink**: Real-time access to school meals, academic schedules, and institutional events.
- **Identity Masking**: Privacy-first AI interactions with secure student data handling.
- **Dynamic UX**: Stable auto-scrolling and intelligent context-aware responses.

### 🛡️ Mission Control Admin Dashboard
- **Personnel Registry**: Comprehensive management of user roles and access permissions.
- **Tactical Approvals**: Real-time verification system for new user onboarding.
- **System Monitoring**: Ambient status glows and high-density data visualization.

### 🎨 Premium Design System
- **Glassmorphism**: Sophisticated translucent panels with high-blur backdrops.
- **Aurora Gradients**: Dynamic, animated background flows for a premium feel.
- **Bento Grid Layouts**: High-density information organization inspired by modern hardware design.
- **Adaptive Navigation**: Intelligent Navbar transparency that adjusts based on scroll depth.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Intelligence**: [OpenAI GPT-4o](https://openai.com/)
- **Data Stratum**: [Airtable](https://airtable.com/) & [Prisma](https://www.prisma.io/) (PostgreSQL on Neon)
- **Security**: [NextAuth.js](https://next-auth.js.org/)

## 🚀 Getting Started

### 1. Environmental Configuration
Create a `.env` file in the root directory:
```env
# AI & Content
OPENAI_API_KEY=your_key
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_id

# Database
DATABASE_URL=your_postgresql_url

# Security & Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# Infrastructure
GMAIL_USER=your_email
GMAIL_APP_PASSWORD=your_app_password
```

### 2. Deployment
```bash
npm install
npm run dev
```

## 🏗️ Architecture Highlights

### AI Tool Integration
The system leverages custom tool definitions to bridge the gap between Large Language Models and school databases:
- `get_meals`: Adaptive date filtering using `IS_SAME`.
- `get_schedule`: Grade-specific data retrieval.
- `get_upcoming_events`: Relative date filtering for school calendars.

---
**MHA Intelligence Unit • 2025**
Boris style. Borris fix.
