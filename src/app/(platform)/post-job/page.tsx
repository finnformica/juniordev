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

  // Check user role and get profile info
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_name, first_name")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "business" && profile.role !== "admin")) {
    redirect("/");
  }

  return <JobForm user={{ email: user.email || "" }} profile={profile} />;
}