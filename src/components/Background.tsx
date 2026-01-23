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
            <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] z-[1]" />

            {/* 4. Animated Aurora Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                    rotate: [0, 45, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform, opacity" }}
                className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-blue-900/30 blur-[80px] z-[-1]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.15, 0.25, 0.15],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform, opacity" }}
                className="absolute top-[20%] right-0 w-[60vw] h-[60vw] rounded-full bg-[#D4AF37]/10 blur-[60px]"
            />
        </div>
    );
}
