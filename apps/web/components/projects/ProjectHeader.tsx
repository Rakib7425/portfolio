"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FolderOpen, Sparkles } from "lucide-react";
import { useRef } from "react";

interface ProjectHeaderProps {
  totalProjects: number;
  featuredCount: number;
}

export function ProjectHeader({ totalProjects, featuredCount }: ProjectHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div ref={containerRef} className="relative min-h-[70vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden bg-black">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[160px] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]" />
      </div>

      {/* Massive Background Typography */}
      <motion.div
        style={{ y: yText, opacity: opacityText, scale: scaleText }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <h2 className="text-[25vw] font-black text-white/[0.02] uppercase tracking-tighter leading-none">
          Archive
        </h2>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-8"
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Selected Works Portfolio</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-none uppercase"
        >
          ELEVATING <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent animate-gradient-x">
            THE DIGITAL.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-wrap items-center justify-center gap-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col items-center group">
            <span className="text-4xl md:text-5xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
              {totalProjects}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Released Projects</span>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/10" />

          <div className="flex flex-col items-center group">
            <span className="text-4xl md:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">
              {featuredCount}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Featured Stories</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />
    </div>
  );
}
