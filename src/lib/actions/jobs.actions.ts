"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { TablesInsert } from "@/lib/types/database";

// Helper function to require specific role
async function requireRole(requiredRole: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, company_name, email")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { error: "Profile not found" };
  }

  if (profile.role !== requiredRole) {
    return { error: "Unauthorized" };
  }

  return { user, profile };
}

const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description must be less than 5000 characters"),
  skills: z.string().optional(),
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters"),
  locationType: z.enum(["remote", "on-site", "hybrid"], {
    message: "Please select a location type",
  }),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"], {
    message: "Please select an employment type",
  }),
  experienceLevel: z.enum(["entry", "junior", "mid", "senior"], {
    message: "Please select an experience level",
  }),
  compensationType: z.enum(["unpaid", "stipend", "hourly", "salary"], {
    message: "Please select a compensation type",
  }),
  compensationAmount: z.string().optional(),
  applicationDeadline: z.string().optional(),
});

export async function createJobAction(formData: FormData) {
  // Check user role
  const authResult = await requireRole("business");
  if ("error" in authResult) {
    return authResult;
  }

  const { user, profile } = authResult;

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    skills: formData.get("skills"),
    location: formData.get("location"),
    locationType: formData.get("locationType"),
    employmentType: formData.get("employmentType"),
    experienceLevel: formData.get("experienceLevel"),
    compensationType: formData.get("compensationType"),
    compensationAmount: formData.get("compensationAmount"),
    applicationDeadline: formData.get("applicationDeadline"),
  };

  const validatedData = createJobSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0]?.message || "Invalid input",
      fieldErrors: validatedData.error.format(),
    };
  }

  const {
    title,
    description,
    skills,
    location,
    locationType,
    employmentType,
    experienceLevel,
    compensationType,
    compensationAmount,
    applicationDeadline,
  } = validatedData.data;

  // Parse skills from comma-separated string to array
  const skillsArray = skills
    ? skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)
    : [];

  const supabase = await createClient();

  const jobData: TablesInsert<"jobs"> = {
    title,
    description,
    skills: skillsArray.length > 0 ? skillsArray : null,
    location,
    location_type: locationType,
    employment_type: employmentType,
    experience_level: experienceLevel,
    compensation_type: compensationType,
    compensation_amount: compensationAmount || null,
    application_deadline: applicationDeadline || null,
    business_id: user.id,
    company_name: profile.company_name || "",
    application_email: profile.email,
  };

  const { error } = await supabase.from("jobs").insert(jobData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  redirect("/jobs");
}

export async function updateJobStatusAction(jobId: string, isActive: boolean) {
  // Check user role
  const authResult = await requireRole("business");
  if ("error" in authResult) {
    return authResult;
  }

  const { user } = authResult;
  const supabase = await createClient();

  // Verify the job belongs to the current user
  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("business_id")
    .eq("id", jobId)
    .single();

  if (fetchError || !job) {
    return { error: "Job not found" };
  }

  if (job.business_id !== user.id) {
    return { error: "Unauthorized - you can only update your own jobs" };
  }

  // Update the job status
  const { error } = await supabase
    .from("jobs")
    .update({ is_active: isActive })
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return { success: true };
}

export async function deleteJobAction(jobId: string) {
  // Check user role
  const authResult = await requireRole("business");
  if ("error" in authResult) {
    return authResult;
  }

  const { user } = authResult;
  const supabase = await createClient();

  // Verify the job belongs to the current user
  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("business_id")
    .eq("id", jobId)
    .single();

  if (fetchError || !job) {
    return { error: "Job not found" };
  }

  if (job.business_id !== user.id) {
    return { error: "Unauthorized - you can only delete your own jobs" };
  }

  // Delete the job
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return { success: true };
}

export async function getMyJobsAction() {
  // Check user role
  const authResult = await requireRole("business");
  if ("error" in authResult) {
    return authResult;
  }

  const { user } = authResult;
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, employment_type, is_active, created_at, views")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { jobs };
}