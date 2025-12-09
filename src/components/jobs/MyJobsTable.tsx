"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateJobStatusAction, deleteJobAction } from "@/lib/actions/jobs.actions";

interface Job {
  id: string;
  title: string;
  employment_type: string;
  is_active: boolean;
  created_at: string;
  views: number;
}

interface MyJobsTableProps {
  jobs: Job[];
}

export default function MyJobsTable({ jobs }: MyJobsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState(false);

  const handleStatusChange = async (jobId: string, newStatus: boolean) => {
    setPendingStatus(jobId);
    try {
      const result = await updateJobStatusAction(jobId, newStatus);
      if ("error" in result) {
        console.error("Error updating job status:", result.error);
      }
    } finally {
      setPendingStatus(null);
    }
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    setPendingDelete(true);
    try {
      const result = await deleteJobAction(jobToDelete.id);
      if ("error" in result) {
        console.error("Error deleting job:", result.error);
      } else {
        setDeleteDialogOpen(false);
        setJobToDelete(null);
      }
    } finally {
      setPendingDelete(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatEmploymentType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
        <p className="text-gray-600 mb-6">
          Start by posting your first job to connect with junior developers.
        </p>
        <Button asChild>
          <Link href="/post-job">Post Your First Job</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/${job.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>{formatEmploymentType(job.employment_type)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingStatus === job.id}
                    onClick={() => handleStatusChange(job.id, !job.is_active)}
                  >
                    {pendingStatus === job.id
                      ? "Updating..."
                      : job.is_active
                      ? "Close"
                      : "Reopen"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(job)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{jobToDelete?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={pendingDelete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={pendingDelete}
            >
              {pendingDelete ? "Deleting..." : "Delete Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}