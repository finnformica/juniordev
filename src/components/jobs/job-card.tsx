import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/lib/types/database";
import Link from "next/link";

type Job = Tables<"jobs">;

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const formatSalary = () => {
    if (job.compensation_type === "unpaid") return "Unpaid";
    if (job.compensation_amount && job.compensation_amount !== "0") {
      return job.compensation_amount;
    }
    return job.compensation_type === "paid" ? "Paid" : "Unpaid";
  };

  const getRoleCategory = () => {
    const title = job.title.toLowerCase();
    if (title.includes("engineer") || title.includes("developer"))
      return "Engineer";
    if (title.includes("design")) return "Design";
    if (title.includes("manager") || title.includes("management"))
      return "Management";
    if (title.includes("support")) return "Support";
    if (title.includes("marketing")) return "Marketing";
    if (title.includes("sales")) return "Sales";
    return "Other";
  };

  return (
    <Link href={`/${job.id}`} className="block">
      <div className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors p-4">
        <div className="flex items-start gap-4">
          <Avatar
            alt={job.company_name}
            size={48}
            className="w-12 h-12 shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 leading-tight mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{job.company_name}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-4">
                <Badge variant="secondary" className="text-xs">
                  {getRoleCategory()}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(job.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">📍 {job.location}</span>
              {job.location_type === "remote" && (
                <Badge variant="outline" className="text-xs">
                  Remote
                </Badge>
              )}
              <span className="flex items-center gap-1">
                💰 {formatSalary()}
              </span>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 5).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{job.skills.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
