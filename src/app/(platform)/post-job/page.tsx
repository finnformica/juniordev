import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobForm from "@/components/jobs/JobForm";

export default async function PostJobPage() {
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
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "business") {
    redirect("/jobs");
  }

  return <JobForm />;
}