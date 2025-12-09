"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["business", "junior"], {
    message: "Please select a role",
  }),
  companyName: z.string().optional(),
});

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedData = loginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0]?.message || "Invalid input",
    };
  }

  const { email, password } = validatedData.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/");
}

export async function signupAction(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    companyName: formData.get("companyName") || undefined,
  };

  const validatedData = signupSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0]?.message || "Invalid input",
    };
  }

  const { email, password, role, companyName } = validatedData.data;

  // Validate company name for business users
  if (role === "business" && !companyName?.trim()) {
    return { error: "Company name is required for business accounts" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        company_name: role === "business" ? companyName : null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Failed to create user" };
  }

  revalidatePath("/");
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/login");
}