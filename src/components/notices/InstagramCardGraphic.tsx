"use client";

import React from "react";
import { Instagram } from "lucide-react";

interface InstagramCardGraphicProps {
    title: string;
    imageUrl?: string | null;
    aspectRatio?: "square" | "video" | "wide";
    className?: string;
}

/**
 * Renders an authentic MHA Instagram-styled card.
 * If a real imageUrl exists, it displays the image with glass overlay.
 * If no imageUrl exists, it dynamically generates the signature MHA Yellow Window Card
 * (with macOS header dots, 'MHA_withus' window title, and bold layout) matching @mha_withus.
 */
export function InstagramCardGraphic({
    title,
    imageUrl,
    aspectRatio = "square",
    className = "",
}: InstagramCardGraphicProps) {
    const [imageError, setImageError] = React.useState(false);

    // If an image URL exists and has not failed to load, render the photo with no-referrer
    if (imageUrl && !imageError) {
        return (
            <div className={`relative w-full overflow-hidden bg-zinc-950 ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"} ${className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white">
                    <Instagram size={14} />
                </div>
            </div>
        );
    }

    // Dynamic MHA Signature Yellow Window Card Generator
    return (
        <div className={`relative w-full overflow-hidden bg-[#fdb526] p-2.5 sm:p-3 flex select-none ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"} ${className}`}>
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
