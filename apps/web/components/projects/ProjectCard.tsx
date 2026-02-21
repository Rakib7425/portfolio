"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, ExternalLink, ArrowRight, FolderOpen, Layers } from "lucide-react";
import { Project } from "@/lib/api/public";
// import { Badge } from "@/components/ui/Badge";
import { useRef } from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Animation Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isFeatured = project.featured;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative w-full mb-12 last:mb-0 ${isFeatured ? "min-h-[60vh] md:min-h-[80vh]" : "min-h-[40vh]"
        }`}
    >
      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative h-full w-full rounded-[2rem] md:rounded-[4rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-3xl flex flex-col md:flex-row group-hover:border-primary/50 transition-colors duration-500"
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        {/* Project Image Section */}
        <div className={`relative overflow-hidden bg-zinc-800 ${isFeatured ? "md:w-3/5" : "md:w-1/2"}`}>
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center opacity-10">
              <FolderOpen className="h-40 w-40" />
            </div>
          )}

          {/* Decorative Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-transparent to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent md:hidden" />

          {/* Index Counter */}
          <div className="absolute top-8 left-8 mix-blend-difference">
            <span className="text-8xl font-black text-white/10 leading-none">
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Project Details Section */}
        <div className={`relative z-10 p-8 md:p-16 flex flex-col justify-center ${isFeatured ? "md:w-2/5" : "md:w-1/2"}`}>
          <div className="space-y-6 md:space-y-8">
            <motion.div style={{ transform: "translateZ(80px)" }} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-10 bg-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Case Study</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.95]">
                {project.title}
              </h2>
            </motion.div>

            <motion.p style={{ transform: "translateZ(60px)" }} className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
              {project.description}
            </motion.p>

            <motion.div style={{ transform: "translateZ(40px)" }} className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span key={tech} className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1.5 rounded-full group-hover:border-primary/40 group-hover:text-primary transition-all duration-500">
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.div style={{ transform: "translateZ(100px)" }} className="flex flex-col sm:flex-row items-center gap-6 pt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Live Preview <ArrowRight className="h-4 w-4" />
                  </span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 rounded-full" />
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" /> View Source
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Floating Element */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/20 blur-3xl rounded-full -z-10"
      />
    </motion.div>
  );
}
