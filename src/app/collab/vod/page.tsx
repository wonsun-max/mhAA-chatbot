import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { ChannelShelfSection } from "@/components/collab/VodMediaHubClient";

export interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface ChannelGroup {
  id: string;
  name: string;
  handle: string;
  channelUrl: string;
  channelId: string;
  videos: VideoItem[];
}

// 4 Official MHA Channel Definitions with exact YouTube Channel IDs for Live Real-Time Ingestion
const CHANNELS_CONFIG = [
  {
    id: "mha-official",
    name: "Manila Hankuk Academy",
    handle: "@ManilaHankukAcademy",
    channelUrl: "https://www.youtube.com/@ManilaHankukAcademy",
    channelId: "UCPqu4EoU8kdXPAqs03Zo9Xg",
  },
  {
    id: "mha-hanain",
    name: "한아인-MHA",
    handle: "@MHA-Hanain",
    channelUrl: "https://www.youtube.com/@MHA-Hanain",
    channelId: "UCW8_5WjF6TtK3oiS0iVm1Sw",
  },
  {
    id: "actualize-one",
    name: "Actualize One",
    handle: "@ActualizeOne",
    channelUrl: "https://www.youtube.com/@ActualizeOne",
    channelId: "UCHS47b0-RiFK0q97Bxjzi7g",
  },
  {
    id: "mk-story",
    name: "선교사자녀학교이야기",
    handle: "@선교사자녀학교이야기",
    channelUrl: "https://www.youtube.com/@선교사자녀학교이야기",
    channelId: "UCg33V_2LECOK_4klpM6tN5w",
  },
];

// Fetch live YouTube RSS feed for any channel ID (Automatic Real-Time Sync)
async function fetchLiveYouTubeVideos(channelId: string): Promise<VideoItem[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 1800 }, // Auto-revalidate every 30 minutes
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const videos: VideoItem[] = [];
    for (const entry of xml.split("<entry>").slice(1, 9)) {
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
          title,
          publishedAt: published,
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }
    return videos;
  } catch (error) {
    console.error(`[VOD] Failed to fetch YouTube live feed for ${channelId}:`, error);
    return [];
  }
}

export default async function VodPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/collab/vod");
  }

  // Fetch real-time live uploads across all 4 channels concurrently
  const channelGroups: ChannelGroup[] = await Promise.all(
    CHANNELS_CONFIG.map(async (config) => {
      const liveVideos = await fetchLiveYouTubeVideos(config.channelId);
      return {
        ...config,
        videos: liveVideos,
      };
    })
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="space-y-6">
        <Link
          href="/collab"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Collab Hub</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white">
            마한아 <span className="font-bold text-white">VOD 채널</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            마닐라한국아카데미 4대 공식 및 학생 YouTube 채널의 실시간 최신 영상입니다.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-white/5" />

      {/* 4 Live Channel Shelves (Auto-updated from YouTube) */}
      <div className="space-y-12 sm:space-y-20">
        {channelGroups.map((group) => (
          <ChannelShelfSection key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
