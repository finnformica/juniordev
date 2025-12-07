"use client";

import { useState } from "react";
import { adminDeleteJobAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Job = {
  id: string;
  title: string;
  employment_type: string;
  is_active: boolean;
  created_at: string;
  views: number;
  business: {
    company_name: string;
    email: string;
  } | null;
};

interface AdminJobsTableProps {
  jobs: Job[];
}

export function AdminJobsTable({ jobs }: AdminJobsTableProps) {
  const [deletingJob, setDeletingJob] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob) return;

    setDeletingJob(selectedJob.id);
    try {
      const result = await adminDeleteJobAction(selectedJob.id);

      if ("error" in result) {
        alert(`Error deleting job: ${result.error}`);
      } else {
        setDeleteDialogOpen(false);
        setSelectedJob(null);
        // The page will revalidate automatically due to revalidatePath in the action
      }
    } catch (error) {
      alert("An unexpected error occurred");
      console.error(error);
    } finally {
      setDeletingJob(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>
                  <div>
                    <div>{job.business?.company_name || "Unknown"}</div>
                    <div className="text-sm text-gray-500">{job.business?.email}</div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{job.employment_type.replace("-", " ")}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.is_active ? "Active" : "Closed"}
                  </span>
                </TableCell>
                <TableCell>{job.views}</TableCell>
                <TableCell>{formatDate(job.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(job)}
                    disabled={deletingJob === job.id}
                  >
                    {deletingJob === job.id ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletingJob === selectedJob?.id}
            >
              {deletingJob === selectedJob?.id ? "Deleting..." : "Delete Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-sm text-gray-500">
        Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}