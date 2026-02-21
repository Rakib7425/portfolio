"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FolderOpen } from "lucide-react";
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

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative pt-20 pb-24 md:pb-32 overflow-hidden">
      {/* Massive Parallax Background Text */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[20vw] font-black text-foreground/[0.03] uppercase tracking-tighter whitespace-nowrap">
          Featured Works
        </span>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-widest shadow-2xl shadow-primary/20">
            <FolderOpen className="h-3 w-3" />
            Portfolio Showcase 2025
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase"
        >
          Crafting Digital <br />
          <span className="text-primary italic font-serif lowercase pr-4">Experiences</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-medium tracking-widest uppercase text-muted-foreground/60"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-foreground mb-1">{totalProjects}</span>
            <span>Total Projects</span>
          </div>
          <div className="w-12 h-px bg-border/40 hidden md:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-primary mb-1">{featuredCount}</span>
            <span>Featured Case Studies</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
