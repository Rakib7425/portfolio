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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-b-2 border-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white selection:bg-primary selection:text-white pb-40">

      {/* ── Cinematic Ambient Background ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Deep Dark Mesh Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />

        {/* Animated Noise Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] mix-blend-overlay" />

        {/* Floating Perspective Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 120, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 md:px-12">
        {/* ════════════════════════════
            PAGE HEADER
        ════════════════════════════ */}
        <ProjectHeader
          totalProjects={projects.length}
          featuredCount={projects.filter((p) => p.featured).length}
        />

        {/* ════════════════════════════
            PROJECTS SHOWCASE (Editorial Single Column)
        ════════════════════════════ */}
        <main className="relative z-10 space-y-24 md:space-y-48">
          <AnimatePresence mode="popLayout">
            {sorted.length > 0 ? (
              <div className="max-w-7xl mx-auto">
                {sorted.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="relative mb-8">
                  <FolderOpen className="h-24 w-24 text-white/5" />
                  <X className="absolute inset-0 h-10 w-10 text-primary m-auto" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">No Matches Found</h3>
                <p className="text-zinc-500 max-w-sm mb-12 font-light">
                  I haven't released any work tagged with <span className="text-white font-bold">{filter}</span> just yet. Explore the full catalog below.
                </p>
                <button
                  onClick={() => setFilter("all")}
                  className="px-10 py-4 rounded-full bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Return to Archive
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ════════════════════════════
            FILTER SECTION (Floating Hub)
        ════════════════════════════ */}
        <FilterSection
          technologies={allTechnologies.slice(0, 10)}
          activeFilter={filter}
          onFilterChange={setFilter}
          totalCount={projects.length}
        />

        {/* Section Divider */}
        <div className="mt-40 flex flex-col items-center gap-6 opacity-20">
          <div className="h-24 w-px bg-gradient-to-b from-white to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[1em] text-white">End of Showcase</span>
        </div>
      </div>
    </div>
  );
}
