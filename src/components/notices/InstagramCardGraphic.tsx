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
    if (imageUrl) {
        return (
            <div className={`relative w-full overflow-hidden bg-zinc-950 ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"} ${className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={title}
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
        <div className={`relative w-full overflow-hidden bg-[#fdb526] p-3 sm:p-4 flex items-center justify-center select-none ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"} ${className}`}>
            {/* White Window Box */}
            <div className="relative w-full h-full bg-white rounded-2xl sm:rounded-3xl border-2 border-black/90 p-3 sm:p-4 flex flex-col justify-between shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden">
                
                {/* Window Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b-2 border-black/90">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/30 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/30 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/30 inline-block" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-black tracking-tight">
                        MHA_withus
                    </span>
                    <div className="w-6" />
                </div>

                {/* Main Headline */}
                <div className="flex-1 flex flex-col justify-center py-2 sm:py-3">
                    <h3 className="text-lg sm:text-2xl font-black text-black tracking-tighter leading-[1.15] break-keep">
                        {title}
                    </h3>
                </div>

                {/* Bottom Graphic Star Accent */}
                <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-500 font-bold">
                    <span className="uppercase tracking-widest text-[#f59e0b]">OFFICIAL POST</span>
                    <div className="flex items-center gap-1 text-black/70">
                        <Instagram size={12} />
                        <span>WITHUS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
