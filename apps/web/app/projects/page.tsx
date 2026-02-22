"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { publicApi, Project } from "@/lib/api/public";
import { FolderOpen, X } from "lucide-react";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { FilterSection } from "@/components/projects/FilterSection";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await publicApi.getProjects();
        setProjects(data);
        publicApi.trackPageView("/projects");
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies || []))
  ).sort();

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter((p) => p.technologies?.includes(filter));

  const sorted = [...filteredProjects].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            borderColor: ["#8b5cf6", "#10b981", "#8b5cf6"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-2 border-primary rounded-full"
        />
        <span className="text-xs font-black uppercase tracking-[0.5em] text-primary animate-pulse">Initializing Archive</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white selection:bg-primary selection:text-white pb-40 overflow-x-hidden">

      {/* ── Cinematic Ambient Background ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('/noise.svg')] mix-blend-overlay" />

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* ════════════════════════════
            PAGE HEADER
        ════════════════════════════ */}
        <ProjectHeader
          totalProjects={projects.length}
          featuredCount={projects.filter((p) => p.featured).length}
        />

        {/* ════════════════════════════
            PROJECTS GRID
        ════════════════════════════ */}
        <main className="relative z-10 max-w-7xl mx-auto pt-12">
          <AnimatePresence mode="popLayout">
            {sorted.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {sorted.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </motion.div>
            ) : (
              /* EMPTY STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-500" />
                  <FolderOpen className="h-32 w-32 text-white/10 group-hover:text-primary/20 transition-colors relative z-10" />
                  <X className="absolute inset-0 h-12 w-12 text-primary m-auto group-hover:scale-125 transition-transform z-20" />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">No Matches Found</h3>
                <p className="text-zinc-500 max-w-sm mb-12 font-light text-lg">
                  The archive doesn't contain entries tagged with <span className="text-white font-bold">{filter}</span>.
                </p>
                <button
                  onClick={() => setFilter("all")}
                  className="px-12 py-5 rounded-full bg-primary text-primary-foreground font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ════════════════════════════
            FILTER SECTION (Floating Hub)
        ════════════════════════════ */}
        <FilterSection
          technologies={allTechnologies.slice(0, 15)}
          activeFilter={filter}
          onFilterChange={setFilter}
          totalCount={projects.length}
        />

        {/* Section Divider */}
        <div className="mt-40 flex flex-col items-center gap-8 opacity-20">
          <div className="h-32 w-px bg-gradient-to-b from-primary to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[1.5em] text-primary">End of Archive</span>
        </div>
      </div>
    </div>
  );
}
