"use client";

import { motion } from "framer-motion";

export default function Background() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* 1. Base Dark Layer */}
            <div className="absolute inset-0 bg-black z-[-2]" />

            {/* 2. Noise Texture */}
            <div className="noise" />

            {/* 3. Gold Dot Pattern (Premium Overlay) - "The dot thing" */}
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] z-[1]" />
        </div>
    );
}
