import { JobDetail } from "@/components/jobs/job-detail";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the job with business info
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !job) {
    console.error("Error fetching job:", error);
    notFound();
  }

  // Increment view count
  const { error: updateError } = await supabase.rpc("increment_job_views", {
    job_id: id,
  });

  if (updateError) {
    console.error("Error incrementing view count:", updateError);
  }

  return <JobDetail job={job} />;
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("title, company_name, description")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} at ${job.company_name} | junior.dev`,
    description: job.description.slice(0, 160),
  };
}
