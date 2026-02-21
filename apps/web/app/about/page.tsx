"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Github, Linkedin, Twitter,
  Download, Briefcase, Calendar, Code2, Terminal, Cpu,
  ArrowRight, Star, Users, FolderOpen, CheckCircle2
} from "lucide-react";
import { publicApi, Profile, Experience, Skill, RESUME_DOWNLOAD_URL } from "@/lib/api/public";
import { Badge } from "@/components/ui/Badge";
import { getSkillIcon, CATEGORY_COLORS, CATEGORY_BG } from "@/lib/skillIcons";

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, ex, sk] = await Promise.all([
          publicApi.getProfile(),
          publicApi.getExperiences(),
          publicApi.getSkills(),
        ]);
        setProfile(p);
        setExperiences(ex);
        setSkills(sk);
        publicApi.trackPageView("/about");
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    acc[s.category] = [...(acc[s.category] ?? []), s];
    return acc;
  }, {});

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });

  const values = [
    { icon: CheckCircle2, text: "Clean, maintainable code that scales" },
    { icon: CheckCircle2, text: "Performance-first approach to UI" },
    { icon: CheckCircle2, text: "Collaborative, open communication" },
    { icon: CheckCircle2, text: "Continuous learning & improvement" },
  ];

  const categoryIcon: Record<string, typeof Code2> = {
    Frontend: Code2, Backend: Terminal, DevOps: Cpu,
  };

  return (
    <div className="relative overflow-hidden bg-background min-h-screen">
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* ═══════════════════════════════════════════
          1 · HERO / INTRO
      ════════════════════════════════════════════ */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-center">
            {/* Avatar / graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 flex justify-center md:justify-start"
            >
              <div className="relative w-56 h-56">
                {/* Gradient circle */}
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 via-secondary to-accent/20 flex items-center justify-center text-7xl font-bold text-primary/40 border border-border shadow-xl">
                  {loading ? "RI" : (profile?.name?.slice(0, 2).toUpperCase() ?? "RI")}
                </div>
                {/* Status badge */}
                <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 shadow-sm text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Available to hire
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="md:col-span-3 space-y-5"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5" /> About Me
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold tracking-tight">
                {loading ? "Rakibul Islam" : (profile?.name ?? "Rakibul Islam")}
              </motion.h1>

              <motion.p variants={fadeUp} className="text-xl text-primary font-medium">
                {loading ? "Full-Stack Developer" : (profile?.title ?? "Full-Stack Developer")}
              </motion.p>

              <motion.div variants={fadeUp} className="space-y-3 text-muted-foreground leading-relaxed">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-4 bg-secondary rounded animate-pulse" />)}
                  </div>
                ) : (
                  profile?.bio?.split("\n\n").slice(0, 2).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                )}
              </motion.div>

              {/* Quick contact row */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Mail className="h-4 w-4" /> {profile.email}
                  </a>
                )}
                {profile?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {profile.location}
                  </span>
                )}
              </motion.div>

              {/* CTA row */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                {profile?.resumeUrl && (
                  <a
                    href={RESUME_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" /> Download CV
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-5 text-sm font-semibold transition-all hover:bg-accent hover:-translate-y-0.5"
                >
                  <Mail className="h-4 w-4" /> Contact Me
                </Link>
              </motion.div>

              {/* Social links */}
              <motion.div variants={fadeUp} className="flex gap-3 pt-1">
                {[
                  { href: profile?.githubUrl, icon: Github, label: "GitHub" },
                  { href: profile?.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
                  { href: profile?.twitterUrl, icon: Twitter, label: "Twitter" },
                ].filter(s => !!s.href).map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2 rounded-lg border border-border hover:bg-accent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2 · VALUES / APPROACH
      ════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              <motion.span variants={fadeUp} className="text-xs font-semibold uppercase tracking-wider text-primary">My Approach</motion.span>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold">How I Work</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                I believe great software is built on a foundation of clear thinking, disciplined craftsmanship,
                and genuine care for the end user. Every line of code I write reflects these principles.
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3 pt-2">
                {values.map(({ icon: Icon, text }) => (
                  <motion.li key={text} variants={fadeUp} className="flex items-center gap-3 text-sm">
                    <Icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Briefcase, value: "2+", label: "Years Experience" },
                { icon: FolderOpen, value: "6+", label: "Projects Shipped" },
                { icon: Star, value: `${skills.length}+`, label: "Skills" },
                { icon: Users, value: "10+", label: "Happy Clients" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3 · SKILLS OVERVIEW
      ════════════════════════════════════════════ */}
      <section className="py-20 bg-secondary/10 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-1">Skills & Technologies</h2>
                <p className="text-muted-foreground text-sm">My toolkit for building great products.</p>
              </div>
              <Link href="/skills" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {loading
                ? [1, 2, 3].map(i => <div key={i} className="h-56 rounded-xl border border-border animate-pulse bg-card" />)
                : Object.entries(groupedSkills).map(([cat, catSkills], catI) => {
                  const CatIconComp = categoryIcon[cat] ?? Code2;
                  const catColor = CATEGORY_COLORS[cat] ?? "text-primary";
                  const catBg = CATEGORY_BG[cat] ?? "bg-primary/10";
                  return (
                    <motion.div
                      key={cat}
                      custom={catI}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="rounded-xl border border-border bg-card p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-5">
                        <div className={`p-1.5 rounded-lg ${catBg}`}>
                          <CatIconComp className={`h-4 w-4 ${catColor}`} />
                        </div>
                        <h3 className="font-semibold">{cat}</h3>
                        <span className="text-xs text-muted-foreground">({catSkills.length})</span>
                      </div>
                      <div className="space-y-3">
                        {catSkills.slice(0, 6).map((sk) => {
                          const SkIcon = getSkillIcon(sk.name);
                          return (
                            <div key={sk.id}>
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="flex items-center gap-1.5">
                                  <SkIcon className={`h-3.5 w-3.5 ${catColor} flex-shrink-0`} />
                                  {sk.name}
                                </span>
                                <span className="text-muted-foreground">{sk.proficiency}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${sk.proficiency}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: "easeOut" as const }}
                                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4 · EXPERIENCE TIMELINE
      ════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-3xl font-bold mb-1">Work Experience</h2>
                <p className="text-muted-foreground text-sm">My professional journey so far.</p>
              </div>
              <Link href="/experience" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                Full timeline <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-2 bottom-2 w-px bg-border" />

              <div className="space-y-8">
                {loading
                  ? [1, 2].map(i => <div key={i} className="ml-14 h-36 rounded-xl border border-border bg-card animate-pulse" />)
                  : experiences.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="relative pl-14"
                    >
                      {/* Dot */}
                      <div className="absolute left-[14px] top-5 w-3 h-3 rounded-full bg-primary border-2 border-background shadow" />

                      <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold">{exp.position}</h3>
                            <p className="text-sm text-primary font-medium">{exp.company}</p>
                          </div>
                          {exp.current && (
                            <Badge variant="success">Current</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(exp.startDate)} – {exp.current ? "Present" : (exp.endDate ? formatDate(exp.endDate) : "")}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {exp.location}
                            </span>
                          )}
                        </div>

                        {/* Short description (first line only) */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {exp.description.split("\n").find(l => l.trim()) ?? ""}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies?.slice(0, 5).map(t => (
                            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5 · CONTACT CARD
      ════════════════════════════════════════════ */}
      <section className="py-20 border-t border-border bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl mx-auto rounded-2xl border border-border bg-card shadow-sm p-8 text-center space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Let&apos;s work together</h2>
            <p className="text-muted-foreground">
              I&apos;m open to full-time roles, freelance projects, and exciting collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
              >
                Send a Message
              </Link>
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-7 text-sm font-semibold hover:bg-accent transition-all"
                >
                  {profile.email}
                </a>
              )}
            </div>

            {/* Contact details */}
            <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm text-muted-foreground">
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" /> {profile.phone}
                </a>
              )}
              {profile?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
