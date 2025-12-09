"use client";

import { useState, useMemo } from "react";
import { JobCard } from "./job-card";
import { JobFilters } from "./job-filters";
import type { Tables } from "@/lib/types/database";

type Job = Tables<"jobs">;

interface JobsListProps {
  jobs: Job[];
}

export function JobsList({ jobs }: JobsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const getRoleCategory = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("engineer") || lowerTitle.includes("developer")) return "Engineer";
    if (lowerTitle.includes("design")) return "Design";
    if (lowerTitle.includes("manager") || lowerTitle.includes("management")) return "Management";
    if (lowerTitle.includes("support")) return "Support";
    if (lowerTitle.includes("marketing")) return "Marketing";
    if (lowerTitle.includes("sales")) return "Sales";
    return "Other";
  };

  const availableCategories = useMemo(() => {
    const categories = new Set(jobs.map(job => getRoleCategory(job.title)));
    return Array.from(categories).sort();
  }, [jobs]);

  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    jobs.forEach(job => {
      job.skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(getRoleCategory(job.title));

      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.some(skill => job.skills?.includes(skill));

      return matchesSearch && matchesCategory && matchesSkills;
    });
  }, [jobs, searchTerm, selectedCategories, selectedSkills]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No jobs posted yet</p>
      </div>
    );
  }

  return (
    <div>
      <JobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        selectedSkills={selectedSkills}
        onSkillToggle={toggleSkill}
        availableCategories={availableCategories}
        availableSkills={availableSkills}
      />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs match your current filters</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {filteredJobs.map((job, index) => (
            <div key={job.id}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>
    </div>
  );
}