import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MyJobsTable from "@/components/jobs/MyJobsTable";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "business") {
    redirect("/jobs");
  }

  // Get user's jobs
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, employment_type, is_active, created_at, views")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    return <div>Error loading jobs</div>;
  }

  const activeJobs = jobs?.filter((job) => job.is_active) || [];
  const totalViews = jobs?.reduce((sum, job) => sum + job.views, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {profile.company_name || "Business User"}
          </p>
        </div>
        <Button asChild>
          <Link href="/post-job">Post New Job</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Jobs</h3>
          <p className="text-2xl font-bold text-gray-900">{jobs?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Jobs</h3>
          <p className="text-2xl font-bold text-green-600">{activeJobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Views</h3>
          <p className="text-2xl font-bold text-blue-600">{totalViews}</p>
        </div>
      </div>

      {/* Jobs Table */}
      <MyJobsTable jobs={jobs || []} />
    </div>
  );
}