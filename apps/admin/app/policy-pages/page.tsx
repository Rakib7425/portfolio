"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, PolicyPage } from "@/lib/api";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function PolicyPagesAdminPage() {
  const [pages, setPages] = useState<PolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ slug: string; type: "success" | "error"; text: string } | null>(null);

  const [edits, setEdits] = useState<Record<string, { title: string; content: string }>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getPolicyPages();
      setPages(data);
      setEdits(
        data.reduce(
          (acc, p) => ({ ...acc, [p.slug]: { title: p.title, content: p.content } }),
          {} as Record<string, { title: string; content: string }>
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load policy pages.");
    } finally {
      setLoading(false);
    }
  }

  async function save(slug: string) {
    const edit = edits[slug];
    if (!edit) return;
    setSavingSlug(slug);
    setSaveMessage(null);
    try {
      await adminApi.updatePolicyPage(slug, { title: edit.title, content: edit.content });
      setSaveMessage({ slug, type: "success", text: "Saved successfully." });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      setSaveMessage({
        slug,
        type: "error",
        text: e instanceof Error ? e.message : "Failed to save.",
      });
    } finally {
      setSavingSlug(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-background">
        <p className="text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground">
          Make sure you are logged in and the API is running.
        </p>
        <Link
          href="/login"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-2">Policy Pages</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Edit Privacy Policy and Terms of Service. Content supports HTML.
        </p>

        <div className="space-y-10">
          {pages.map((page) => (
            <section
              key={page.slug}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">{page.slug}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={edits[page.slug]?.title ?? ""}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        [page.slug]: {
                          ...prev[page.slug],
                          title: e.target.value,
                          content: prev[page.slug]?.content ?? page.content,
                        },
                      }))
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                  <textarea
                    value={edits[page.slug]?.content ?? ""}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        [page.slug]: {
                          ...prev[page.slug],
                          title: prev[page.slug]?.title ?? page.title,
                          content: e.target.value,
                        },
                      }))
                    }
                    rows={16}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => save(page.slug)}
                    disabled={savingSlug === page.slug}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {savingSlug === page.slug ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                  {saveMessage?.slug === page.slug && (
                    <span
                      className={
                        saveMessage.type === "success"
                          ? "text-green-600 dark:text-green-400 text-sm"
                          : "text-destructive text-sm"
                      }
                    >
                      {saveMessage.text}
                    </span>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
