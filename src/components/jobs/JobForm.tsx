"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { createJobAction } from "@/lib/actions/jobs.actions";
import { useFormStatus } from "react-dom";

interface JobFormProps {
  user: {
    email: string;
  };
  profile: {
    role: string;
    company_name?: string | null;
    first_name?: string | null;
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating Job..." : "Create Job"}
    </Button>
  );
}

function getDisplayName(
  profile: JobFormProps["profile"],
  email: string
): string {
  return profile?.company_name || profile?.first_name || email.split("@")[0];
}

export default function JobForm({ user, profile }: JobFormProps) {
  const displayName = getDisplayName(profile, user.email);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    locationType: "",
    employmentType: "",
    experienceLevel: "",
    compensationType: "",
    compensationAmount: "",
    skills: "",
    applicationDeadline: "",
    description: "",
  });

  const handleCreateJob = async (formDataFromForm: FormData) => {
    setError(null);

    // Get values from form and update state
    const title = formDataFromForm.get("title") as string;
    const location = formDataFromForm.get("location") as string;
    const locationType = formDataFromForm.get("locationType") as string;
    const employmentType = formDataFromForm.get("employmentType") as string;
    const experienceLevel = formDataFromForm.get("experienceLevel") as string;
    const compensationType = formDataFromForm.get("compensationType") as string;
    const compensationAmount = formDataFromForm.get("compensationAmount") as string;
    const skills = formDataFromForm.get("skills") as string;
    const applicationDeadline = formDataFromForm.get("applicationDeadline") as string;
    const description = formDataFromForm.get("description") as string;

    // Update state to preserve values
    setFormData({
      title,
      location,
      locationType,
      employmentType,
      experienceLevel,
      compensationType,
      compensationAmount,
      skills,
      applicationDeadline,
      description,
    });

    const result = await createJobAction(formDataFromForm);
    if (result && "error" in result) {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <Avatar alt={displayName} size={64} className="h-16 w-16 mx-auto sm:mx-0" />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">Post a Job</h1>
          <p className="text-muted-foreground mt-1">Posting as {displayName}</p>
        </div>
      </div>

      <form action={handleCreateJob} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Junior Frontend Developer"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Remote, New York, London"
            required
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {/* Location Type */}
        <div className="space-y-2">
          <Label htmlFor="locationType">Location Type</Label>
          <select
            id="locationType"
            name="locationType"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.locationType}
            onChange={(e) => setFormData(prev => ({ ...prev, locationType: e.target.value }))}
          >
            <option value="">Select location type</option>
            <option value="remote">Remote</option>
            <option value="on-site">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type</Label>
          <select
            id="employmentType"
            name="employmentType"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.employmentType}
            onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
          >
            <option value="">Select employment type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.experienceLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
          >
            <option value="">Select experience level</option>
            <option value="entry">Entry Level</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        {/* Compensation Type */}
        <div className="space-y-2">
          <Label htmlFor="compensationType">Compensation Type</Label>
          <select
            id="compensationType"
            name="compensationType"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.compensationType}
            onChange={(e) => setFormData(prev => ({ ...prev, compensationType: e.target.value }))}
          >
            <option value="">Select compensation type</option>
            <option value="unpaid">Unpaid (Experience only)</option>
            <option value="stipend">Stipend</option>
            <option value="hourly">Hourly Rate</option>
            <option value="salary">Salary</option>
          </select>
        </div>

        {/* Compensation Amount (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="compensationAmount">
            Compensation Amount (Optional)
          </Label>
          <Input
            id="compensationAmount"
            name="compensationAmount"
            type="text"
            placeholder="e.g. $15/hour, $50k/year, $500/month"
            value={formData.compensationAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, compensationAmount: e.target.value }))}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">Skills (Optional)</Label>
          <Input
            id="skills"
            name="skills"
            type="text"
            placeholder="e.g. React, TypeScript, CSS, Git (comma-separated)"
            value={formData.skills}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
          />
          <p className="text-sm text-gray-600">
            Enter skills separated by commas
          </p>
        </div>

        {/* Application Deadline */}
        <div className="space-y-2">
          <Label htmlFor="applicationDeadline">
            Application Deadline (Optional)
          </Label>
          <Input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the role, responsibilities, and what the junior developer will learn..."
            rows={8}
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          <p className="text-sm text-gray-600">
            Include what the junior developer will learn, their
            responsibilities, and any requirements.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
