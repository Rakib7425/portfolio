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
import { SiLeptos } from "react-icons/si";

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
          1 · HERO SECTION (REDESIGNED)
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Side: Text Info */}
            <div className="flex flex-col space-y-8 z-10 text-left">
              <motion.div variants={fadeUp} className="flex justify-start">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">Available for Innovation</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                  CRAFTING <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent animate-gradient-x">
                    DIGITAL SOULS.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground/80 font-light max-w-xl leading-relaxed">
                  I&apos;m <span className="text-foreground font-medium underline decoration-primary/30 underline-offset-4">{loading ? "Rakibul Islam" : (profile?.name ?? "Rakibul Islam")}</span>,
                  a visionary developer transforming complex ideas into elegant, pixel-perfect realities.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 pt-4">
                <Link
                  href="/projects"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-10 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Archive <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -z-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-background/50 backdrop-blur-md px-10 text-sm font-bold transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent hover:scale-105 active:scale-95"
                >
                  Start a Conversation
                </Link>
              </motion.div>

              {/* Socials & Resume */}
              <motion.div variants={fadeUp} className="flex items-center gap-8 pt-8 border-t border-border/50 max-w-fit">
                <div className="flex gap-4">
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
                      className="p-3 rounded-full border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 text-muted-foreground hover:text-primary"
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
                {profile?.resumeUrl && (
                  <div className="h-8 w-px bg-border/50" />
                )}
                {profile?.resumeUrl && (
                  <a
                    href={RESUME_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="rakibul_resume.pdf"
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Download className="h-4 w-4 group-hover:animate-bounce" /> rakibul_resume.pdf
                  </a>
                )}
              </motion.div>
            </div>

            {/* Right Side: Visual Element (Terminal Mockup) */}
            <motion.div
              variants={fadeUp}
              className="hidden lg:block relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">portfolio.tsx — Edited</div>
                </div>
                <div className="p-8 font-mono text-sm space-y-2 overflow-hidden">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">01</span>
                    <span className="text-primary italic">class</span>
                    <span className="text-orange-400">VisionaryDeveloper</span>
                    <span className="text-foreground">{"{"}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">02</span>
                    <span className="ml-4 text-muted-foreground/60">// passion drives innovation</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">03</span>
                    <span className="ml-4 text-foreground">constructor() {"{"}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">04</span>
                    <span className="ml-8 text-primary">this</span>
                    <span className="text-foreground">.motto =</span>
                    <span className="text-green-500">&quot;Code with Purpose&quot;</span>
                    <span className="text-foreground">;</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">05</span>
                    <span className="ml-8 text-primary">this</span>
                    <span className="text-foreground">.focus = [</span>
                    <span className="text-green-500">&quot;Performance&quot;</span>
                    <span className="text-foreground">,</span>
                    <span className="text-green-500">&quot;Scalability&quot;</span>
                    <span className="text-foreground">];</span>
                  </div>
                  <div className="flex gap-4 text-primary animate-pulse">
                    <span className="text-muted-foreground/40 select-none cursor-default">06</span>
                    <span className="ml-8 text-primary">this.shipping = true;</span>
                    <span className="w-2 h-5 bg-primary/80 animate-caret" />
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">07</span>
                    <span className="ml-4 text-foreground">{"}"}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground/40 select-none">08</span>
                    <span className="text-foreground">{"}"}</span>
                  </div>
                </div>
              </div>

              {/* Decorative floating bits */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 rounded-xl bg-card border border-border shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <SiLeptos className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Efficiency</div>
                    <div className="text-sm font-bold text-foreground">99.98% Optimize</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground/40"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-black">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1.5px] h-12 bg-gradient-to-b from-primary to-transparent"
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
