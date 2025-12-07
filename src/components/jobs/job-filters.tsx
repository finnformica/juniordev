"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
  availableCategories: string[];
  availableSkills: string[];
}

export function JobFilters({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedSkills,
  onSkillToggle,
  availableCategories,
  availableSkills,
}: JobFiltersProps) {
  const clearFilters = () => {
    onSearchChange("");
    selectedCategories.forEach(onCategoryToggle);
    selectedSkills.forEach(onSkillToggle);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search jobs by title, company, or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground font-medium">Categories:</span>
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryToggle(category)}
              className="h-8 text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground font-medium">Skills:</span>
        {availableSkills.slice(0, 12).map((skill) => (
          <Badge
            key={skill}
            variant={selectedSkills.includes(skill) ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onSkillToggle(skill)}
          >
            {skill}
          </Badge>
        ))}
      </div>

      {(selectedCategories.length > 0 || selectedSkills.length > 0 || searchTerm) && (
        <Button variant="ghost" onClick={clearFilters} size="sm">
          Clear all filters
        </Button>
      )}
    </div>
  );
}