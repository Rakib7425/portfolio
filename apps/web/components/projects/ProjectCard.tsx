"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Github, ExternalLink, ArrowRight, FolderOpen, Code2, Sparkles } from "lucide-react";
import { Project } from "@/lib/api/public";
import { useRef, useState } from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col h-full rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(var(--primary-rgb), 0.15), transparent 40%)`
          ),
        }}
      />

      {/* Image / Icon Area */}
      <div className="relative h-56 overflow-hidden">
        {project.imageUrl ? (
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800/50">
            <Code2 className="h-16 w-16 text-white/5 group-hover:text-primary/20 transition-colors duration-500" />
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/20">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Featured</span>
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4 z-20">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
            <span className="w-6 h-px bg-primary/30" />
            Project Archive
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors duration-300 uppercase">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {project.technologies?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded-md group-hover:border-primary/20 group-hover:text-primary/70 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
          {(project.technologies?.length ?? 0) > 4 && (
            <span className="text-[9px] font-black text-white/20 px-1 py-1">+{project.technologies!.length - 4}</span>
          )}
        </div>

        {/* Footer Link */}
        <div className="pt-2 border-t border-white/5 mt-2 overflow-hidden">
          <motion.div
            animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary"
          >
            Review Details <ArrowRight className="h-3 w-3" />
          </motion.div>
          {!isHovered && (
            <div className="text-[11px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
              Show More <FolderOpen className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
