"use client";

import React from "react";
import { Instagram } from "lucide-react";

interface InstagramCardGraphicProps {
    title: string;
    imageUrl?: string | null;
    aspectRatio?: "square" | "portrait" | "video" | "wide";
    className?: string;
}

/**
 * Renders an authentic MHA Instagram-styled card.
 * Uses 4:5 portrait ratio matching official Instagram carousel posts (1080x1350),
 * completely eliminating zoomed-in cropping and overflows.
 */
export function InstagramCardGraphic({
    title,
    imageUrl,
    aspectRatio = "portrait",
    className = "",
}: InstagramCardGraphicProps) {
    const [imageError, setImageError] = React.useState(false);

    const aspectClass =
        aspectRatio === "portrait"
            ? "aspect-[4/5]"
            : aspectRatio === "square"
            ? "aspect-square"
            : aspectRatio === "video"
            ? "aspect-video"
            : "aspect-[4/3]";

    // If an image URL exists and has not failed to load, render the photo cleanly
    if (imageUrl && !imageError) {
        return (
            <div className={`relative w-full overflow-hidden bg-zinc-950 ${aspectClass} ${className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/90 shadow-md">
                    <Instagram size={12} />
                </div>
            </div>
        );
    }

    // Dynamic MHA Signature Yellow Window Card Generator
    return (
        <div className={`relative w-full overflow-hidden bg-[#fdb526] p-2.5 sm:p-3 flex select-none ${aspectClass} ${className}`}>
            {/* White Window Box */}
            <div className="relative w-full h-full bg-white rounded-xl sm:rounded-2xl border-[1.5px] border-black/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden">
                
                {/* Window Header Bar */}
                <div className="flex items-center justify-between pb-1.5 border-b border-black/10 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ff5f56] border border-black/20 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-[#ffbd2e] border border-black/20 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-[#27c93f] border border-black/20 inline-block" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-tight">
                        MHA_withus
                    </span>
                    <Instagram size={11} className="text-zinc-400" />
                </div>

                {/* Main Headline */}
                <div className="flex-1 flex flex-col justify-center py-1.5 min-h-0 overflow-hidden">
                    <h3 className="text-xs sm:text-sm font-black text-black tracking-tight leading-snug line-clamp-3 break-words">
                        {title}
                    </h3>
                </div>

                {/* Bottom Graphic Accent */}
                <div className="flex items-center justify-between pt-1.5 border-t border-black/10 shrink-0 text-[8px] sm:text-[9px] font-mono font-bold text-zinc-500">
                    <span className="uppercase tracking-wider text-[#d97706]">OFFICIAL POST</span>
                    <div className="flex items-center gap-1 text-black/70">
                        <Instagram size={10} />
                        <span>WITHUS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
