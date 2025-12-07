import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminJobsTable } from "@/components/admin/admin-jobs-table";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { getAllJobsAction, getAllUsersAction } from "@/lib/actions/admin.actions";

async function checkAdminAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return { user, profile };
}

export default async function AdminPage() {
  await checkAdminAccess();

  const [jobsResult, usersResult] = await Promise.all([
    getAllJobsAction(),
    getAllUsersAction(),
  ]);

  if ("error" in jobsResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-red-700">Error loading jobs: {jobsResult.error}</p>
        </div>
      </div>
    );
  }

  if ("error" in usersResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-red-700">Error loading users: {usersResult.error}</p>
        </div>
      </div>
    );
  }

  // Type assertion to help TypeScript understand the shape
  const jobs = (jobsResult as { jobs: any[] }).jobs;
  const users = (usersResult as { profiles: any[] }).profiles;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage jobs and users across the platform</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Jobs Management</h2>
          <AdminJobsTable jobs={jobs} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Users Management</h2>
          <AdminUsersTable users={users} />
        </div>
      </div>
    </div>
  );
}