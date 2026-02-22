'use client'

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { publicApi, Profile, RESUME_DOWNLOAD_URL } from "@/lib/api/public";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await publicApi.getProfile();
        setProfile(data);
        // await publicApi.trackPageView('/about');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  const socialLinks = [
    { icon: Github, href: profile.githubUrl, label: "GitHub" },
    { icon: Linkedin, href: profile.linkedinUrl, label: "LinkedIn" },
    // { icon: Twitter, href: profile.twitterUrl, label: "Twitter" },
    { icon: Mail, href: profile.email, label: "Email" },
  ];

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Resume", href: RESUME_DOWNLOAD_URL, isExternal: true },
        { label: "Source Code", href: profile.githubUrl },
      ],
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setSubscribeMessage({ type: 'error', text: 'Please enter your email address' }); return; }

    setIsSubscribing(true);
    setSubscribeMessage(null);

    try {
      const response = await publicApi.subscribeNewsletter(email);
      setSubscribeMessage({ type: 'success', text: response.message || 'Successfully subscribed!' });
      setEmail('');

      // Clear success message after 5 seconds
      setTimeout(() => setSubscribeMessage(null), 5000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';

      // Check if it's the "already subscribed" message
      if (errorMessage.includes('already subscribed')) {
        setSubscribeMessage({ type: 'info', text: errorMessage });
      } else {
        setSubscribeMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                R
              </div>
              <span className="font-bold text-xl tracking-tight">Rakib.Dev</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Crafting digital experiences with passion and precision. Building the web of tomorrow, one pixel at a time.
            </p>
            <div className="flex gap-2 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link: any) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <a
                        href={link.href || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={link.label === "Resume" ? "rakibul_resume.pdf" : undefined}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0" />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href || ''}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to my newsletter for the latest updates on my projects and tech articles.
            </p>
            <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  // required
                  disabled={isSubscribing}
                  className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                />
                <Button size="sm" type="submit" disabled={isSubscribing}>
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {subscribeMessage && (
                <p className={`text-sm ${subscribeMessage.type === 'success' ? 'text-green-500' :
                  subscribeMessage.type === 'info' ? 'text-blue-500' :
                    'text-red-500'
                  }`}>
                  {subscribeMessage.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Rakibul Islam. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span>in 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
