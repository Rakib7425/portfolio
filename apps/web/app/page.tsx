"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Github, Linkedin, Mail, Code2, Terminal, Cpu, Sparkles,
  ExternalLink, Calendar, MapPin, Star, Users, Briefcase, FolderOpen,
  ChevronRight, Download
} from "lucide-react";
import { publicApi, Project, Experience, Skill, Profile, RESUME_DOWNLOAD_URL } from "@/lib/api/public";
import { Badge } from "@/components/ui/Badge";

/* ─── animation helpers ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── component ─── */
export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, pr, ex, sk] = await Promise.all([
          publicApi.getProfile(),
          publicApi.getProjects(),
          publicApi.getExperiences(),
          publicApi.getSkills(),
        ]);
        setProfile(p);
        setProjects(pr);
        setExperiences(ex);
        setSkills(sk);
        publicApi.trackPageView("/");
      } catch { /* server may be starting */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const currentJob = experiences.find((e) => e.current) ?? experiences[0];

  const stats = [
    { label: "Years Experience", value: "2+", icon: Briefcase },
    { label: "Projects Built", value: `${projects.length}+`, icon: FolderOpen },
    { label: "Skills & Tools", value: `${skills.length}+`, icon: Star },
    { label: "Happy Clients", value: "10+", icon: Users },
  ];

  const techCategories = [
    {
      title: "Frontend", icon: Code2,
      items: skills.filter(s => s.category === "Frontend").map(s => s.name),
    },
    {
      title: "Backend", icon: Terminal,
      items: skills.filter(s => s.category === "Backend").map(s => s.name),
    },
    {
      title: "DevOps", icon: Cpu,
      items: skills.filter(s => s.category === "DevOps").map(s => s.name),
    },
    {
      title: "Tools", icon: Sparkles,
      items: ["Git & GitHub", "Figma", "Swagger", "Postman", "Jest"],
    },
  ];

  return (
    <div className="relative overflow-hidden bg-background text-foreground">

      {/* ── Ambient background glows ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* ═══════════════════════════════════════════
          1 · HERO SECTION
      ════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Available badge */}
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/60 backdrop-blur-sm shadow-sm hover:border-primary/40 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-muted-foreground">Available for new projects</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
            Building digital
            <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent pb-2">
              products &amp; experiences.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I&apos;m{" "}
            <span className="font-semibold text-foreground">
              {loading ? "Rakibul Islam" : (profile?.name ?? "Rakibul Islam")}
            </span>
            {", "}
            {loading
              ? "a Full-Stack Developer with 2+ years of experience building scalable web apps."
              : (profile?.bio?.split("\n\n")[0] ?? "a Full-Stack Developer crafting scalable, performant web apps.")}
          </motion.p>

          {/* Current role chip */}
          {currentJob && (
            <motion.div variants={fadeUp} className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{currentJob.position} @ <strong>{currentJob.company}</strong></span>
              </div>
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View My Work <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-semibold shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Contact Me
            </Link>
            {profile?.resumeUrl && (
              <a
                href={RESUME_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-dashed border-input/60 px-6 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5"
              >
                <Download className="mr-2 h-4 w-4" /> Resume
              </a>
            )}
          </motion.div>

          {/* Social links */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 pt-2 text-muted-foreground">
            {[
              { href: profile?.githubUrl ?? "https://github.com/Rakib7425", icon: Github, label: "GitHub" },
              { href: profile?.linkedinUrl ?? "#", icon: Linkedin, label: "LinkedIn" },
              { href: `mailto:${profile?.email ?? "contact@example.com"}`, icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-accent hover:text-foreground transition-all hover:-translate-y-0.5"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40"
        >
          <span className="text-xs">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-muted-foreground/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          2 · STATS SECTION
      ════════════════════════════════════════════ */}
      <section className="py-16 border-y border-border bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={fadeUp}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3 · TECH STACK SECTION
      ════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Technical Proficiency</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A comprehensive toolkit for building modern, scalable applications end-to-end.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {techCategories.map(({ title, icon: Icon, items }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className="h-20 w-20" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {items.slice(0, 5).map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                    {items.length > 5 && (
                      <li className="text-xs text-primary/70 font-medium pt-1">
                        +{items.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-10"
          >
            <Link
              href="/skills"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all skills <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4 · FEATURED PROJECTS
      ════════════════════════════════════════════ */}
      <section className="py-24 bg-secondary/10 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16 max-w-6xl mx-auto"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">Handpicked highlights from my portfolio.</p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline whitespace-nowrap"
            >
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {featured.map((project, i) => (
                <motion.div
                  key={project.id}
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-primary/20 transition-all overflow-hidden"
                >
                  {/* Image area */}
                  <div className="h-44 bg-gradient-to-br from-primary/10 via-secondary to-accent/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      <FolderOpen className="h-16 w-16" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <h3 className="font-bold text-base line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                      {(project.technologies?.length ?? 0) > 3 && (
                        <Badge variant="outline" className="text-xs">+{(project.technologies?.length ?? 0) - 3}</Badge>
                      )}
                    </div>

                    <div className="flex gap-3 pt-1">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Projects coming soon…</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5 · EXPERIENCE PREVIEW
      ════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Experience</h2>
                <p className="text-muted-foreground">Where I&apos;ve worked and what I&apos;ve shipped.</p>
              </div>
              <Link href="/experience" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                Full timeline <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {loading
                ? [1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-xl border border-border bg-card animate-pulse" />
                ))
                : experiences.slice(0, 2).map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-primary/20" />

                    <div className="flex-1 pl-2">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold">{exp.position}</h3>
                          <p className="text-sm text-primary font-medium">{exp.company}</p>
                        </div>
                        {exp.current && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          {" – "}
                          {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : ""}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {exp.location}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies?.slice(0, 5).map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6 · CTA / CONTACT STRIP
      ════════════════════════════════════════════ */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Mail className="h-3.5 w-3.5" /> Open to opportunities
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Have a project in mind?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              I&apos;m always open to exciting new projects, collaborations, or just a friendly chat about tech.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:-translate-y-0.5"
              >
                Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-semibold transition-all hover:bg-accent hover:-translate-y-0.5"
              >
                Learn About Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
