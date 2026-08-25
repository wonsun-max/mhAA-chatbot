"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Sparkles, Search, HeartHandshake, 
  BookOpen, Crown, Shield, X, Loader2, UserCheck
} from "lucide-react";

interface Member {
  name: string;
  grade: number;
  role: string;
}

interface MissionTeamItem {
  id: string;
  name: string;
  leaderName: string;
  leaderGrade: number;
  chapelDate: string;
  members: Member[];
}

interface QtGroupItem {
  id: number;
  name: string;
  leaderName: string;
  leaderGrade: number;
  subLeaderName: string;
  subLeaderGrade: number;
  members: Member[];
}

interface StudentResultItem {
  name: string;
  grade: number;
  missionTeam: { name: string; role: string; chapelDate?: string; leaderName?: string } | null;
  qtGroup: { name: string; role: string; leaderName?: string; subLeaderName?: string } | null;
}

export default function TeamsCommunityPage() {
  const [missionTeams, setMissionTeams] = useState<MissionTeamItem[]>([]);
  const [qtGroups, setQtGroups] = useState<QtGroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"MISSION" | "QT">("MISSION");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentResultItem[]>([]);
  const [searching, setSearching] = useState(false);

  // Load all teams and QT groups from DB API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/collab/teams");
        const data = await res.json();
        if (data.missionTeams) setMissionTeams(data.missionTeams);
        if (data.qtGroups) setQtGroups(data.qtGroups);
      } catch (err) {
        console.error("Failed to load teams data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Live search debounced against PostgreSQL API (supports Chosung, substring, given names)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/collab/teams?query=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/collab"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-wider group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>콜라보 허브로 돌아가기</span>
        </Link>
        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold">
          2026 LIVE DB
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-400 font-bold">
          <Sparkles size={12} />
          <span>Fellowship & Community</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          QT조 & 선교팀 편성표
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
          마한아 4대 선교팀과 8개 QT조 편성 명단입니다. 전체 이름, 성을 뺀 이름, 초성으로 내 소속을 0.1초 만에 검색하세요.
        </p>
      </div>

      {/* Smart Search Bar */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="space-y-1">
          <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search size={14} className="text-purple-400" />
              <span>학생 이름 / 성 제외 / 초성 검색</span>
            </span>
            <span className="text-[10px] text-purple-400/80 font-normal">
              초성(ㅇㅇㅅ, ㅎㅅㅁ) · 성 제외(원선, 승민) 지원
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름/초성을 입력하세요 (예: 이원선, 원선, ㅇㅇㅅ, 하승민, 승민, ㅎㅅㅁ...)"
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Live Search Results List */}
        {searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2 space-y-3"
          >
            {searching ? (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <Loader2 size={14} className="animate-spin text-purple-400" />
                <span>데이터베이스 검색 중...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                  <span>검색 결과 ({searchResults.length}명)</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-blue-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-purple-500/50"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-base shrink-0 shadow-inner">
                          {res.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">
                              {res.name}
                            </h4>
                            {res.grade > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-zinc-300">
                                {res.grade}학년
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            소속 정보
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
                        <div className="p-2.5 sm:px-4 sm:py-2 rounded-xl bg-black/50 border border-white/10 text-center sm:text-left">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase block">선교팀</span>
                          <span className="text-xs sm:text-sm font-bold text-blue-300">
                            {res.missionTeam?.name || "미지정"}
                            {res.missionTeam?.role && ` (${res.missionTeam.role})`}
                          </span>
                        </div>

                        <div className="p-2.5 sm:px-4 sm:py-2 rounded-xl bg-black/50 border border-white/10 text-center sm:text-left">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase block">QT조</span>
                          <span className="text-xs sm:text-sm font-bold text-purple-300">
                            {res.qtGroup?.name || "미지정"}
                            {res.qtGroup?.role && ` (${res.qtGroup.role})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 text-center text-xs text-zinc-500">
                &ldquo;{searchQuery}&rdquo; 일치하는 학생 정보를 찾을 수 없습니다. 이름이나 초성을 다시 확인해 주세요.
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Main Switcher Tabs */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab("MISSION")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "MISSION"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          <HeartHandshake size={16} />
          <span>4대 선교팀 ({missionTeams.length}개 팀)</span>
        </button>

        <button
          onClick={() => setActiveTab("QT")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "QT"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
              : "bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          <BookOpen size={16} />
          <span>8대 QT조 ({qtGroups.length}개 조)</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 size={24} className="animate-spin text-purple-400" />
          <p className="text-xs font-mono text-zinc-500">데이터베이스에서 편성표를 불러오는 중...</p>
        </div>
      ) : activeTab === "MISSION" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missionTeams.map((team) => {
            const teamMembersOnly = team.members.filter(m => m.name !== team.leaderName);
            return (
              <div
                key={team.id}
                className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 hover:border-white/15 rounded-3xl p-6 sm:p-7 space-y-6 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-blue-400 font-black shadow-inner">
                        <HeartHandshake size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {team.name}
                        </h3>
                        <span className="text-xs text-zinc-400 font-mono">
                          총 {team.members.length}명
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">선교 예배</span>
                      <span className="text-xs font-mono font-bold text-blue-300">{team.chapelDate}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Crown size={14} className="text-amber-400" />
                      <span className="text-xs font-mono text-zinc-400 font-bold">팀장</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{team.leaderName}</span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-white/10 px-1.5 py-0.5 rounded">
                        {team.leaderGrade}학년
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase block font-bold">
                      팀원 명단 ({teamMembersOnly.length}명)
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {teamMembersOnly.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-zinc-950/70 border border-white/5 text-xs text-zinc-300 font-medium flex items-center gap-1.5"
                        >
                          <span>{m.name}</span>
                          <span className="text-[9px] font-mono text-zinc-500">{m.grade}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qtGroups.map((group) => {
            const groupMembersOnly = group.members.filter(
              m => m.name !== group.leaderName && m.name !== group.subLeaderName
            );
            return (
              <div
                key={group.id}
                className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 hover:border-white/15 rounded-3xl p-6 space-y-5 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                        {group.name}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">QT {group.name}</h3>
                        <span className="text-xs text-zinc-400 font-mono">
                          총 {group.members.length}명
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 mb-1">
                        <Crown size={12} />
                        <span>조장</span>
                      </div>
                      <p className="text-xs font-bold text-white">
                        {group.leaderName} <span className="text-[10px] text-zinc-400 font-normal">({group.leaderGrade}학년)</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 mb-1">
                        <Shield size={12} />
                        <span>부조장</span>
                      </div>
                      <p className="text-xs font-bold text-white">
                        {group.subLeaderName} <span className="text-[10px] text-zinc-400 font-normal">({group.subLeaderGrade}학년)</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                      조원 ({groupMembersOnly.length}명)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {groupMembersOnly.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-zinc-950/70 border border-white/5 text-[11px] text-zinc-300 flex items-center gap-1"
                        >
                          <span>{m.name}</span>
                          <span className="text-[9px] text-zinc-500 font-mono">{m.grade}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
