# MissionLink AI Assistant (mhAA) 🚀

**A high-fidelity, next-generation digital ecosystem for the modern school community.**

MissionLink AI Assistant (formerly MissionLink) redefines the school interface, providing an immersive, secure, and intelligent platform for students, teachers, and administration. Built with cutting-edge web technologies, it seamlessly integrates academic schedules, meal services, and administrative operations into a single, cohesive experience.

---

## ✨ Core Features

### 🌌 Immersive AI Interface
*   **Intelligent Chatbot**: Powered by **GPT-4o** and **Vercel AI SDK v6**, offering context-aware responses about school life.
*   **Secure Data Uplink**: Real-time integration with school databases for up-to-the-minute meal plans, schedules, and events.
*   **Privacy-First**: Identity masking and secure handling of student data ensure safe interactions.
*   **Streaming Responses**: Low-latency, streaming AI responses with "Boris-style" typing effects (streamText).

### 🛡️ Mission Control (Admin Dashboard)
*   **Personnel Registry**: Comprehensive role-based access control (RBAC) for Students, Teachers, and Admins.
*   **Tactical Approvals**: Streamlined verification workflow for new user onboarding.
*   **System Monitoring**: Real-time status indicators and high-density data visualization for administrative oversight.

### 🎨 Premium Design System
*   **Glassmorphism Engine**: Sophisticated UI with translucent panels, high-blur backdrops, and active light sourcing.
*   **Aurora Gradients**: Dynamic, animated background flows that create a living, breathing interface.
*   **Bento Grid Layouts**: Information-dense, highly readable layouts inspired by modern operating system design.
*   **Adaptive Navigation**: Intelligent navbar that adjusts opacity and blur based on scroll depth and context.

---

## 🛠️ Technology Stack

**Core Infrastructure**
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
*   **ORM**: [Prisma](https://www.prisma.io/)

**Artificial Intelligence**
*   **SDK**: [Vercel AI SDK v6](https://sdk.vercel.ai/docs) (`ai`, `@ai-sdk/openai`, `@ai-sdk/react` v2)
*   **Model**: [OpenAI GPT-4o](https://openai.com/)

**User Interface**
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Motion**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)

**Security & Auth**
*   **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
*   **Encryption**: `bcrypt` / `bcryptjs`

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js 18+ (LTS recommended)
*   PostgreSQL Database (Local or Neon)
*   OpenAI API Key

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/wonsun-max/mhAA-chatbot.git
cd mhAA-chatbot
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory. You can use `.env.example` as a template.

```env
# --- AI & Content ---
OPENAI_API_KEY=your_openai_api_key
AIRTABLE_API_KEY=your_airtable_key  # Optional if migrating away
AIRTABLE_BASE_ID=your_base_id       # Optional if migrating away

# --- Database ---
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# --- Authentication ---
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=your_generated_secret_key
# Optional Social Providers
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# --- Email Services (Nodemailer) ---
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### 4. Database Setup
Initialize the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Development Server
Launch the development environment:

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 🏗️ Architecture Highlights

### AI Tool Integration (`src/lib/ai/tools.ts`)
The system bridges LLMs with school data using strongly-typed tool definitions:
*   `get_meals`: Retrieves daily menus with intelligent date parsing.
*   `get_schedule`: Fetches class schedules filtered by grade level.
*   `get_upcoming_events`: Provides a timeline of school activities.
*   `get_upcoming_birthdays`: Identifies upcoming celebrations in the community.

### Chat System (`src/app/api/ai/chat/route.ts`)
*   **Stream Processing**: Utilizes `streamText` for real-time token streaming.
*   **Persistence**: Automatically logs conversation history to the `ChatLog` table via `onFinish` callbacks.
*   **Type Safety**: robust handling of `UIMessage` vs `ModelMessage` types for seamless frontend-backend integration.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**© 2026 MissionLink AI Team**
