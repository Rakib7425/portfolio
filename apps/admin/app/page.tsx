import Link from "next/link";
import { FileText, LogIn } from "lucide-react";

export default function AdminHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="z-10 max-w-lg w-full font-mono text-sm">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Portfolio management panel</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-4 hover:bg-accent transition-colors"
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
          <Link
            href="/policy-pages"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-4 hover:bg-accent transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Privacy & Terms</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
