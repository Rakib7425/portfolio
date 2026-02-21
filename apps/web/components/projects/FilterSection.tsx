"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search, SlidersHorizontal, Hash } from "lucide-react";

interface FilterSectionProps {
  technologies: string[];
  activeFilter: string;
  onFilterChange: (tech: string) => void;
  totalCount: number;
}

export function FilterSection({
  technologies,
  activeFilter,
  onFilterChange,
  totalCount,
}: FilterSectionProps) {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-2xl">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative group lg:p-1"
      >
        {/* Glow Background Effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />

        {/* The Bar */}
        <div className="relative bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-2xl">
          {/* Label / Icon */}
          <div className="flex items-center gap-2 pl-4 pr-3 border-r border-white/5 py-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-white/40">Filters</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onFilterChange("all")}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${activeFilter === "all"
                  ? "bg-white text-black shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
            >
              All ({totalCount})
            </button>

            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => onFilterChange(tech)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${activeFilter === tech
                    ? "bg-primary text-white shadow-lg shadow-primary/40"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Hash className="h-3 w-3" /> {tech}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeFilter !== "all" && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => onFilterChange("all")}
                className="ml-2 bg-white/10 hover:bg-destructive hover:text-white p-2.5 rounded-full transition-all text-white/60"
                title="Clear Filters"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
