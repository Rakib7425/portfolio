"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { publicApi, Skill } from "@/lib/api/public";
import { getSkillIcon, CATEGORY_COLORS, CATEGORY_BG } from "@/lib/skillIcons";
import { Code2, Terminal, Cpu, Sparkles } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="h-5 w-5" />,
  Backend: <Terminal className="h-5 w-5" />,
  DevOps: <Cpu className="h-5 w-5" />,
};

const CATEGORY_ORDER = ["Frontend", "Backend", "DevOps"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");

  useEffect(() => {
    publicApi.getSkills()
      .then(data => { setSkills(data); publicApi.trackPageView("/skills"); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* group + sort */
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const categories = ["All", ...CATEGORY_ORDER.filter(c => grouped[c])];
  const visibleGroups = activeTab === "All"
    ? CATEGORY_ORDER.filter(c => grouped[c]).map(c => ({ category: c, skills: grouped[c] }))
    : [{ category: activeTab, skills: grouped[activeTab] ?? [] }];

  return (
    <div className="relative overflow-hidden bg-background min-h-screen">
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Skills &amp; Technologies
          </h1>
          <p className="text-xl text-muted-foreground">
            My toolkit for building modern, scalable applications
          </p>
        </motion.div>

        {/* ── Category tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeTab === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Skills Grid ── */}
        {loading ? (
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 rounded-xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-16">
            {visibleGroups.map(({ category, skills: catSkills }) => {
              const catColor = CATEGORY_COLORS[category] ?? "text-primary";
              const catBg = CATEGORY_BG[category] ?? "bg-primary/10";
              const CatIcon = CATEGORY_ICONS[category] ?? <Sparkles className="h-5 w-5" />;

              return (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-2 rounded-xl ${catBg} ${catColor}`}>
                      {CatIcon}
                    </div>
                    <h2 className="text-2xl font-bold">{category}</h2>
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({catSkills.length} skills)
                    </span>
                    <div className="flex-1 h-px bg-border ml-2" />
                  </div>

                  {/* Icon cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {catSkills
                      .sort((a, b) => a.order - b.order)
                      .map((skill, i) => {
                        const Icon = getSkillIcon(skill.name);
                        return (
                          <motion.div
                            key={skill.id}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{ y: -4, scale: 1.03 }}
                            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
                          >
                            {/* Tech logo */}
                            <div className={`p-3 rounded-xl ${catBg} transition-all group-hover:scale-110`}>
                              <Icon className={`h-7 w-7 ${catColor}`} />
                            </div>

                            {/* Name */}
                            <span className="text-sm font-medium text-center leading-tight">
                              {skill.name}
                            </span>

                            {/* Proficiency bar */}
                            <div className="w-full">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Proficiency</span>
                                <span>{skill.proficiency}%</span>
                              </div>
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.proficiency}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: i * 0.04, ease: "easeOut" }}
                                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
