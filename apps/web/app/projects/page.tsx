"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { publicApi, Project } from "@/lib/api/public";
import { SearchX } from "lucide-react";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { FilterSection } from "@/components/projects/FilterSection";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProjectHeader
          totalProjects={projects.length}
          featuredCount={projects.filter((p) => p.featured).length}
        />

        <FilterSection
          technologies={allTechnologies.slice(0, 15)}
          activeFilter={filter}
          onFilterChange={setFilter}
          totalCount={projects.length}
        />

        <main className="max-w-6xl mx-auto pt-8">
          <AnimatePresence mode="popLayout">
            {sorted.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sorted.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <SearchX className="h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  No projects tagged with <span className="font-medium text-foreground">{filter}</span>.
                </p>
                <button
                  onClick={() => setFilter("all")}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
