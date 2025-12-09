"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/types/database";
import { ArrowLeft, Copy, Eye, Mail, Share2, Users } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Job = Tables<"jobs">;

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatSalary = () => {
    if (job.compensation_type === "unpaid") return "🎓 Learning Experience";
    if (job.compensation_amount && job.compensation_amount !== "0") {
      return `💰 ${job.compensation_amount}`;
    }
    return job.compensation_type === "paid"
      ? "💰 Paid Position"
      : "🎓 Learning Experience";
  };

  const getRoleCategory = () => {
    const title = job.title.toLowerCase();
    if (title.includes("engineer") || title.includes("developer"))
      return "👨‍💻 Engineer";
    if (title.includes("design")) return "🎨 Design";
    if (title.includes("manager") || title.includes("management"))
      return "📊 Management";
    if (title.includes("support")) return "🎧 Support";
    if (title.includes("marketing")) return "📢 Marketing";
    if (title.includes("sales")) return "💼 Sales";
    return "🚀 Other";
  };

  const getExperienceEmoji = () => {
    const level = job.experience_level.toLowerCase();
    if (
      level.includes("entry") ||
      level.includes("junior") ||
      level.includes("intern")
    )
      return "🌱";
    if (level.includes("mid")) return "🌿";
    if (level.includes("senior")) return "🌳";
    return "🌱";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company_name}`,
        text: `Check out this internship opportunity: ${job.title} at ${job.company_name}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard(window.location.href);
    }
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 hover:text-foreground hover:bg-muted px-3 py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to opportunities
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={shareJob}
              className="gap-2 border-border hover:bg-muted hover:text-foreground bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Hero Section */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start gap-6 mb-8">
                <Avatar
                  alt={job.company_name}
                  size={64}
                  className="w-16 h-16 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-3 text-muted-foreground mb-3">
                      <span className="text-lg font-medium">
                        {job.company_name}
                      </span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="flex items-center gap-1 text-sm">
                        <Eye className="h-4 w-4" />
                        {job.views} views
                      </span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-sm">
                        {formatTimeAgo(job.created_at)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {getRoleCategory()}
                      </Badge>
                      {job.location_type === "remote" && (
                        <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1">
                          🌍 Remote
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl mb-2">📍</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Location
                  </div>
                  <div className="font-medium text-sm">{job.location}</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl mb-2">{getExperienceEmoji()}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Experience
                  </div>
                  <div className="font-medium text-sm capitalize">
                    {job.experience_level}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl mb-2">⏰</div>
                  <div className="text-xs text-muted-foreground mb-1">Type</div>
                  <div className="font-medium text-sm">
                    {job.employment_type}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl mb-2">💸</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Compensation
                  </div>
                  <div className="font-medium text-sm">
                    {formatSalary()
                      .replace(/[💰🎓]/gu, "")
                      .trim()}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Skills you&apos;ll learn & use
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="px-3 py-2 border-border hover:border-primary hover:bg-muted transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section - Clean minimal design */}
              <div className="border border-blue-200 dark:border-blue-500/25 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-500/8">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Ready to apply?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Send your application directly to the company
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90 px-8 shrink-0"
                  >
                    <a
                      href={`mailto:${job.application_email}?subject=Internship Application: ${job.title}&body=Hi there!%0A%0AI'm interested in the ${job.title} position at ${job.company_name}. I'd love to learn more about this opportunity.%0A%0AThank you!`}
                    >
                      Apply Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Description */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  What you&apos;ll be doing
                </h2>
                <div className="text-foreground/90 space-y-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-foreground mt-6 mb-3">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-foreground mt-5 mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-foreground/80 leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-foreground/80">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 dark:border-primary pl-4 py-2 bg-blue-50 dark:bg-primary/8 rounded-r-lg my-4">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted/50 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto my-4">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {job.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500 dark:text-primary" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/8 rounded-lg border border-blue-200 dark:border-blue-500/25">
                    <p className="text-sm text-blue-800 dark:text-foreground mb-2 font-medium">
                      Application Email:
                    </p>
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-blue-900 dark:text-foreground font-mono break-all bg-blue-100 dark:bg-blue-500/12 px-2 py-1 rounded">
                        {job.application_email}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(job.application_email)}
                        className="ml-2 p-2 h-auto hover:bg-blue-100 dark:hover:bg-blue-500/12 border border-blue-200 dark:border-blue-500/30"
                      >
                        <Copy className="h-4 w-4 text-blue-700 dark:text-foreground" />
                      </Button>
                    </div>
                  </div>

                  {job.application_deadline && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-500/8 rounded-lg border border-amber-200 dark:border-amber-500/25">
                      <p className="text-sm text-amber-800 dark:text-foreground font-medium">
                        Application Deadline:
                      </p>
                      <p className="text-amber-900 dark:text-foreground font-semibold">
                        {formatDate(job.application_deadline)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Quick Facts
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Experience Level
                    </span>
                    <span className="font-medium capitalize">
                      {job.experience_level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Employment Type
                    </span>
                    <span className="font-medium">{job.employment_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Work Style</span>
                    <span className="font-medium capitalize">
                      {job.location_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted Date</span>
                    <span className="font-medium">
                      {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips for Interns */}
              <div className="bg-green-50 dark:bg-emerald-500/8 rounded-lg border border-green-200 dark:border-emerald-500/25 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  💡 Application Tips
                </h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span>✨</span>
                    <span>Mention specific skills that match the role</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🎯</span>
                    <span>Show enthusiasm for learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📚</span>
                    <span>Include relevant coursework or projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>⚡</span>
                    <span>Apply early - opportunities go fast!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
