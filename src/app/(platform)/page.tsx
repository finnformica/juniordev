import { JobsList } from "@/components/jobs/jobs-list";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Jobs Board
          </h1>
          <p className="text-muted-foreground mb-8">
            Experience opportunities for junior developers
          </p>
          <p className="text-destructive">Unable to load jobs at the moment.</p>
        </div>
      </div>
    );
  }

  const totalJobs = jobs?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Jobs Board</h1>
        <p className="text-muted-foreground mb-4">
          Experience opportunities for junior developers
        </p>
        <p className="text-sm text-muted-foreground">
          {totalJobs} {totalJobs === 1 ? "opportunity" : "opportunities"}{" "}
          available
        </p>
      </div>

      <JobsList jobs={jobs || []} />
    </div>
  );
}
