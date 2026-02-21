import {
  // Frontend
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiTailwindcss, SiRedux, SiFramer, SiHtml5, SiCss3,
  SiVuedotjs, SiAngular, SiSvelte, SiWebpack, SiVite,
  SiSass, SiStorybook, SiJest, SiFigma,
  // Backend
  SiNodedotjs, SiExpress, SiNestjs, SiPostgresql,
  SiMongodb, SiMysql, SiSqlite, SiRedis, SiGraphql,
  SiPrisma, SiSequelize, SiSocketdotio,
  SiPhp, SiLaravel, SiPython, SiDjango, SiFastapi,
  SiGo, SiRust, SiElixir,
  // DevOps
  SiDocker, SiAmazonwebservices, SiGithubactions, SiNginx,
  SiGit, SiGithub, SiLinux, SiKubernetes, SiTerraform,
  SiJenkins, SiGitlab, SiCircleci, SiVercel, SiNetlify,
  SiPostman, SiSwagger, SiFirebase,
  SiDrizzle,
} from "react-icons/si";
import { FaServer } from "react-icons/fa";
import { IconType } from "react-icons";

/**
 * Map a skill name (lowercase) → react-icons icon component.
 * Falls back to a generic icon when no match is found.
 */
const ICON_MAP: Record<string, IconType> = {
  // ── Frontend ──────────────────────────────────────────────
  "react": SiReact,
  "react.js": SiReact,
  "reactjs": SiReact,
  "next.js": SiNextdotjs,
  "nextjs": SiNextdotjs,
  "next": SiNextdotjs,
  "typescript": SiTypescript,
  "javascript": SiJavascript,
  "tailwind css": SiTailwindcss,
  "tailwind": SiTailwindcss,
  "tailwindcss": SiTailwindcss,
  "redux": SiRedux,
  "redux toolkit": SiRedux,
  "framer motion": SiFramer,
  "framer": SiFramer,
  "html": SiHtml5,
  "html5": SiHtml5,
  "css": SiCss3,
  "css3": SiCss3,
  "vue": SiVuedotjs,
  "vue.js": SiVuedotjs,
  "vuejs": SiVuedotjs,
  "angular": SiAngular,
  "svelte": SiSvelte,
  "webpack": SiWebpack,
  "vite": SiVite,
  "sass": SiSass,
  "scss": SiSass,
  "storybook": SiStorybook,
  "jest": SiJest,
  "figma": SiFigma,
  // ── Backend ───────────────────────────────────────────────
  "node.js": SiNodedotjs,
  "nodejs": SiNodedotjs,
  "node": SiNodedotjs,
  "express": SiExpress,
  "express.js": SiExpress,
  "expressjs": SiExpress,
  "nestjs": SiNestjs,
  "nest.js": SiNestjs,
  "postgresql": SiPostgresql,
  "postgres": SiPostgresql,
  "mongodb": SiMongodb,
  "mysql": SiMysql,
  "sqlite": SiSqlite,
  "redis": SiRedis,
  "graphql": SiGraphql,
  "prisma": SiPrisma,
  "drizzle": SiDrizzle,
  "drizzle orm": SiDrizzle,
  "sequelize": SiSequelize,
  "socket.io": SiSocketdotio,
  "sockets": SiSocketdotio,
  "php": SiPhp,
  "laravel": SiLaravel,
  "python": SiPython,
  "django": SiDjango,
  "fastapi": SiFastapi,
  "go": SiGo,
  "golang": SiGo,
  "rust": SiRust,
  "elixir": SiElixir,
  "rest api": FaServer,
  "rest apis": FaServer,
  "restful": FaServer,
  // ── DevOps ────────────────────────────────────────────────
  "docker": SiDocker,
  "aws": SiAmazonwebservices,
  "amazon web services": SiAmazonwebservices,
  "github actions": SiGithubactions,
  "ci/cd": SiGithubactions,
  "nginx": SiNginx,
  "git": SiGit,
  "github": SiGithub,
  "linux": SiLinux,
  "kubernetes": SiKubernetes,
  "k8s": SiKubernetes,
  "terraform": SiTerraform,
  "jenkins": SiJenkins,
  "gitlab": SiGitlab,
  "circleci": SiCircleci,
  "vercel": SiVercel,
  "netlify": SiNetlify,
  "postman": SiPostman,
  "swagger": SiSwagger,
  "firebase": SiFirebase,
};

/** Category-level accent colours */
export const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "text-blue-400",
  Backend: "text-emerald-400",
  DevOps: "text-orange-400",
};

export const CATEGORY_BG: Record<string, string> = {
  Frontend: "bg-blue-500/10",
  Backend: "bg-emerald-500/10",
  DevOps: "bg-orange-500/10",
};

/**
 * Return the icon component for a given skill name.
 * Case-insensitive, falls back to FaServer.
 */
export function getSkillIcon(name: string): IconType {
  return ICON_MAP[name.toLowerCase()] ?? FaServer;
}
