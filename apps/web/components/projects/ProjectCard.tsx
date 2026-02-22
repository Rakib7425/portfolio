"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Code2 } from "lucide-react";
import { Project } from "@/lib/api/public";
import { Badge } from "@/components/ui/Badge";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden bg-muted/30">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Code2 className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {project.featured && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 text-xs"
          >
            Featured
          </Badge>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-semibold text-lg text-foreground">
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.technologies?.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {(project.technologies?.length ?? 0) > 4 && (
            <Badge variant="outline" className="text-xs">
              +{(project.technologies?.length ?? 0) - 4}
            </Badge>
          )}
        </div>

        <div className="flex gap-4 pt-2 border-t border-border">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" /> Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
