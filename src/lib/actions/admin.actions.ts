"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper function to require admin role
async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { error: "Profile not found" };
  }

  if (profile.role !== "admin") {
    return { error: "Unauthorized - admin access required" };
  }

  return { user, profile };
}

export async function getAllJobsAction() {
  // Check admin role
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult;
  }

  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      employment_type,
      is_active,
      created_at,
      views,
      business:profiles!business_id(company_name, email)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { jobs };
}

export async function getAllUsersAction() {
  // Check admin role
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult;
  }

  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, role, company_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { profiles };
}

export async function adminDeleteJobAction(jobId: string) {
  // Check admin role
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult;
  }

  const supabase = await createClient();

  // Delete the job (admin can delete any job)
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function adminDeleteUserAction(userId: string) {
  // Check admin role
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult;
  }

  const supabase = await createClient();

  // Delete the user profile (this will cascade to delete their jobs due to FK constraints)
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  // Note: We should also delete the auth user, but that requires admin API access
  // For now, we'll just delete the profile which will prevent login access

  revalidatePath("/admin");
  return { success: true };
}