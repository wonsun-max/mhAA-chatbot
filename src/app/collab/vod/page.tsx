import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Clapperboard, ExternalLink, PlayCircle, Youtube } from "lucide-react";
import { authOptions } from "@/lib/auth";

const CHANNEL_ID = "UCW8_5WjF6TtK3oiS0iVm1Sw";
const CHANNEL_URL = "https://www.youtube.com/@MHA-Hanain";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

interface FeedVideo {
  videoId: string;
  title: string;
  published: string;
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchChannelVideos(): Promise<FeedVideo[] | null> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const xml = await res.text();

    const videos: FeedVideo[] = [];
    for (const entry of xml.split("<entry>").slice(1)) {
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
      if (videoId && title && published) {
        videos.push({ videoId, title: decodeXmlEntities(title), published });
      }
    }

    videos.sort((a, b) => b.published.localeCompare(a.published));
    return videos;
  } catch (error) {
    console.error("[VOD] Failed to fetch channel feed:", error);
    return null;
  }
}

function formatPublished(published: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(published));
}

export default async function VodPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/collab/vod");
  }

  const videos = await fetchChannelVideos();
  const [latest, ...rest] = videos ?? [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Link
        href="/collab"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Back to Hub</span>
      </Link>

      {/* Hero Section */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-6 tracking-wider uppercase">
          <Clapperboard size={12} className="text-red-400" />
          Broadcast Club
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            방송부 VOD
          </span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-400 font-medium leading-relaxed">
          한아인-MHA 공식 YouTube 채널의 영상을 모았습니다.<br className="hidden sm:block" />
          채플, 행사, 월간 뉴스까지 놓친 순간을 다시 만나보세요.
        </p>
      </div>

      {!videos || videos.length === 0 ? (
        /* Error / Empty State */
        <div className="bg-zinc-900/30 backdrop-blur-sm rounded-[2.5rem] p-12 border border-white/5 text-center">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Youtube className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">영상을 불러오지 못했습니다</h3>
          <p className="text-zinc-500 font-medium text-sm mb-8">
            잠시 후 다시 시도하거나, 공식 채널에서 직접 확인해 주세요.
          </p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-black text-sm transition-all shadow-xl shadow-white/5 hover:bg-zinc-200 active:scale-95"
          >
            공식 채널 바로가기
            <ExternalLink size={16} />
          </a>
        </div>
      ) : (
        <>
          {/* Latest Video */}
          <div className="mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 px-1">
              Latest · 최신 영상
            </p>
            <div className="bg-zinc-900/30 backdrop-blur-sm rounded-[2.5rem] p-4 sm:p-6 border border-white/5">
              <div className="aspect-video rounded-[1.5rem] overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${latest.videoId}`}
                  title={latest.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="px-2 pt-5 pb-2">
                <h2 className="text-white font-bold text-lg sm:text-xl leading-snug">{latest.title}</h2>
                <p className="text-zinc-600 text-sm font-medium mt-1">{formatPublished(latest.published)}</p>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          {rest.length > 0 && (
            <div className="mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 px-1">
                Archive · 지난 영상
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((video) => (
                  <a
                    key={video.videoId}
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="h-full bg-zinc-900/30 backdrop-blur-sm rounded-[2rem] border border-white/5 hover:border-red-500/30 transition-all duration-500 overflow-hidden">
                      <div className="relative aspect-video overflow-hidden bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-500">
                          <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-zinc-600 text-xs font-medium mt-2">{formatPublished(video.published)}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Channel Link */}
          <div className="text-center">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-black text-sm transition-all shadow-xl shadow-white/5 hover:bg-zinc-200 active:scale-95"
            >
              <Youtube size={18} />
              공식 채널에서 더 보기
              <ExternalLink size={16} />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
