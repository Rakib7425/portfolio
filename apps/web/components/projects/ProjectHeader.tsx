"use client";

import { motion } from "framer-motion";

interface ProjectHeaderProps {
  totalProjects: number;
  featuredCount: number;
}

export function ProjectHeader({ totalProjects, featuredCount }: ProjectHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto mb-12 text-center"
    >
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
        Projects
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Selected work and side projects
      </p>
      <div className="flex items-center justify-center gap-8 text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{totalProjects}</span> projects
        </span>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{featuredCount}</span> featured
        </span>
      </div>
    </motion.div>
  );
}
