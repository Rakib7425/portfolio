"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicApi, PolicyPage } from "@/lib/api/public";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const [policy, setPolicy] = useState<PolicyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await publicApi.getPolicyPage("terms-of-service");
        setPolicy(data);
        publicApi.trackPageView("/terms");
      } catch {
        setError("Failed to load page.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4">
        <p className="text-muted-foreground">{error ?? "Page not found."}</p>
        <Link href="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <article
          className="policy-content space-y-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-muted-foreground [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </div>
    </div>
  );
}
