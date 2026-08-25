import Link from "next/link";
import { 
  Utensils, CalendarDays, Clock, BookOpen, AlertCircle, 
  ChevronRight, Pencil, Calculator, Clapperboard, Sparkles
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { IdeaPortalBanner } from "@/components/collab/IdeaPortalBanner";

interface CollabCardProps {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  accentColor: string;
  glowClass: string;
}

function CollabCard({ href, title, description, badge, icon, accentColor, glowClass }: CollabCardProps) {
  return (
    <Link href={href} className="group relative block h-full">
      <div className="h-full bg-zinc-900/30 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/5 hover:border-white/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group-hover:bg-zinc-900/50 group-hover:shadow-2xl group-hover:shadow-black/60">
        {/* Ambient Glow */}
        <div className={`absolute top-0 right-0 w-36 h-36 ${glowClass} blur-[60px] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />

        <div>
          {/* Card Top Row: Icon + Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
              {icon}
            </div>
            {badge && (
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-zinc-400">
                {badge}
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Card Footer: Action Indicator */}
        <div className="pt-6 mt-4 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
            바로가기
          </span>
          <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:${accentColor} group-hover:border-white/20 group-hover:translate-x-0.5 transition-all`}>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CollabPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/collab");
  }

  const qtGroup = session?.user?.qtGroup;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16 sm:space-y-20">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono tracking-wider uppercase">
          <Sparkles size={12} className="text-blue-400" />
          <span>School Life Hub</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight text-white">
          마한아 <span className="font-bold text-white">콜라보 허브</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          수업 시간표부터 시험 일정, 급식, 신앙과 미디어까지<br className="hidden sm:block" /> 
          학교 생활에 필요한 모든 기능을 한곳에서 빠르고 편리하게 이용하세요.
        </p>
      </div>

      {/* Warning Notification for QT Group */}
      {session?.user && !qtGroup && (
        <div className="group">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:border-red-500/40 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
              <AlertCircle size={24} />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="font-bold text-white text-base">QT 조 설정이 필요합니다</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">본인의 QT 조를 등록하시면 점심 기도회 당번 순서를 자동으로 안내해 드립니다.</p>
            </div>
            <Link href="/profile" className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xs transition-all whitespace-nowrap shadow-lg">
              프로필에서 설정
            </Link>
          </div>
        </div>
      )}

      {/* CATEGORY 1: 📅 일정 & 학교 생활 (Schedule & Campus Life) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-white/5 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-bold">
              01 / SCHEDULE & CAMPUS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              일정 & 학교 생활
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">3 Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CollabCard
            href="/collab/timetable"
            title="시간표"
            description="우리 반의 요일별 수업 시간표를 쉽고 빠르게 확인하세요."
            badge="LIVE"
            icon={<Clock className="w-6 h-6 text-purple-400" />}
            accentColor="text-purple-400"
            glowClass="bg-purple-500/10"
          />

          <CollabCard
            href="/collab/calendar"
            title="학사일정"
            description="월별 주요 학사일정과 학교 행사를 한눈에 파악하세요."
            badge="iCal 연동"
            icon={<CalendarDays className="w-6 h-6 text-blue-400" />}
            accentColor="text-blue-400"
            glowClass="bg-blue-500/10"
          />

          <CollabCard
            href="/collab/meals"
            title="오늘의 급식"
            description="주간 식단표와 오늘의 맛있는 점심 메뉴를 실시간으로 확인하세요."
            badge="매일 갱신"
            icon={<Utensils className="w-6 h-6 text-amber-400" />}
            accentColor="text-amber-400"
            glowClass="bg-amber-500/10"
          />
        </div>
      </section>

      {/* CATEGORY 2: ✍️ 시험 & 학업 관리 (Academics & Grades) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-white/5 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-400 font-bold">
              02 / ACADEMICS & EXAMS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              시험 & 학업 관리
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">2 Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CollabCard
            href="/collab/exams"
            title="시험 일정표"
            description="중간/기말고사 교시별 시험 과목과 범위를 확인하고 시험 기간을 대비하세요."
            badge="D-Day"
            icon={<Pencil className="w-6 h-6 text-rose-400" />}
            accentColor="text-rose-400"
            glowClass="bg-rose-500/10"
          />

          <CollabCard
            href="/collab/gpa"
            title="GPA 학점 계산기"
            description="학기별 과목 성적을 입력하고 4.5 만점 기준 내신 GPA를 실시간으로 산출하세요."
            badge="Auto GPA"
            icon={<Calculator className="w-6 h-6 text-emerald-400" />}
            accentColor="text-emerald-400"
            glowClass="bg-emerald-500/10"
          />
        </div>
      </section>

      {/* CATEGORY 3: 🕊️ 신앙 & 미디어 허브 (Faith & Media Hub) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-white/5 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-pink-400 font-bold">
              03 / FAITH & MEDIA
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              신앙 & 미디어 허브
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">2 Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CollabCard
            href="/collab/lunch-prayer"
            title="점심 기도실"
            description="오늘의 점심 기도회 담당 QT조와 기도 순서를 확인하고 함께 기도하세요."
            badge="QT 순서"
            icon={<BookOpen className="w-6 h-6 text-pink-400" />}
            accentColor="text-pink-400"
            glowClass="bg-pink-500/10"
          />

          <CollabCard
            href="/collab/vod"
            title="MHA VOD 미디어"
            description="마한아 4대 공식 및 학생 YouTube 채널의 실시간 영상들을 모아보세요."
            badge="YouTube Live"
            icon={<Clapperboard className="w-6 h-6 text-red-400" />}
            accentColor="text-red-400"
            glowClass="bg-red-500/10"
          />
        </div>
      </section>

      {/* Idea Portal Banner (Native 5-Second FeedbackModal Integration) */}
      <div className="pt-8">
        <IdeaPortalBanner />
      </div>
    </div>
  );
}
