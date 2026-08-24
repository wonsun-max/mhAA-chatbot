import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Clapperboard, Youtube, ExternalLink, Play, Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { VodMediaHubClient } from "@/components/collab/VodMediaHubClient";

export interface MhaChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  category: string;
  description: string;
  subscriberCount?: string;
  badgeColor: string;
  channelId?: string;
}

export interface VodVideo {
  id: string;
  channelId: string;
  channelName: string;
  channelHandle: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  isFeatured?: boolean;
}

export const MHA_CHANNELS: MhaChannel[] = [
  {
    id: "mha-official",
    name: "Manila Hankuk Academy",
    handle: "@ManilaHankukAcademy",
    url: "https://www.youtube.com/@ManilaHankukAcademy",
    category: "학교 공식 채널",
    description: "마닐라한국아카데미의 공식 학교 소식, 주요 행사 및 공식 영상 채널입니다.",
    badgeColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "mha-hanain",
    name: "한아인-MHA",
    handle: "@MHA-Hanain",
    url: "https://www.youtube.com/@MHA-Hanain",
    category: "채플 & 방송부",
    description: "세계 선교의 다음 세대를 준비하는 MHA 채플, 찬양 및 학교 방송 영상 채널입니다.",
    channelId: "UCW8_5WjF6TtK3oiS0iVm1Sw",
    badgeColor: "from-amber-500 to-orange-600",
  },
  {
    id: "actualize-one",
    name: "Actualize One",
    handle: "@ActualizeOne",
    url: "https://www.youtube.com/@ActualizeOne",
    category: "학생 미디어 & 프로젝트",
    description: "학생들의 크리에이티브 미디어, 프로젝트 영상 및 교내 활동을 담은 채널입니다.",
    badgeColor: "from-cyan-500 to-blue-500",
  },
  {
    id: "mk-story",
    name: "선교사자녀학교이야기",
    handle: "@선교사자녀학교이야기",
    url: "https://www.youtube.com/@선교사자녀학교이야기",
    category: "학교 스토리 & 사역",
    description: "선교사 자녀들의 생생한 학교 생활과 MHA의 따뜻한 이야기를 전하는 채널입니다.",
    badgeColor: "from-emerald-500 to-teal-600",
  },
];

async function fetchChannelRssVideos(channelId: string, channelName: string, channelHandle: string): Promise<VodVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const videos: VodVideo[] = [];
    for (const entry of xml.split("<entry>").slice(1)) {
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const rawTitle = entry.match(/<title>([^<]*)<\/title>/)?.[1];
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];

      if (videoId && rawTitle && published) {
        const title = rawTitle
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        videos.push({
          id: videoId,
          channelId: channelHandle,
          channelName,
          channelHandle,
          title,
          publishedAt: published,
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }
    return videos;
  } catch (error) {
    console.error("[VOD] Failed to fetch channel feed:", error);
    return [];
  }
}

export default async function VodPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/collab/vod");
  }

  // Fetch live RSS videos from Hanain channel
  const hanainVideos = await fetchChannelRssVideos("UCW8_5WjF6TtK3oiS0iVm1Sw", "한아인-MHA", "@MHA-Hanain");

  // Initial curated video catalog across all 4 channels
  const initialVideos: VodVideo[] = [
    ...hanainVideos,
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        href="/collab"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Collab Hub로 돌아가기</span>
      </Link>

      {/* Hero Section */}
      <div className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase">
          <Youtube size={14} />
          MHA Media & Video Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-white">
          마한아 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-white">YouTube 채널 & VOD</span>
        </h1>
        <p className="max-w-2xl text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
          마닐라한국아카데미의 4대 공식 및 학생 채널을 모았습니다.<br className="hidden sm:block" />
          채플, 학교 행사, 축제 및 미디어 영상을 최신순으로 만나보세요.
        </p>
      </div>

      {/* Client Interactive Channel Tabs & Video Grid */}
      <VodMediaHubClient channels={MHA_CHANNELS} initialVideos={initialVideos} />
    </div>
  );
}
