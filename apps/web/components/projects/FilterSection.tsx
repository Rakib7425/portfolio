"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto mb-6"
    >
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onFilterChange("all")}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          All ({totalCount})
        </button>

        {technologies.map((tech) => (
          <button
            key={tech}
            onClick={() => onFilterChange(tech)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeFilter === tech
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {tech}
          </button>
        ))}

        <AnimatePresence>
          {activeFilter !== "all" && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => onFilterChange("all")}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors "
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
