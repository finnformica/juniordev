import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <Link href="/jobs">
            <Button variant="ghost" className="gap-2 h-9 px-3">
              <ArrowLeft className="h-4 w-4" />
              Back to opportunities
            </Button>
          </Link>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Oops! Opportunity Not Found
              </h1>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-600">
                The internship you're looking for might have been filled or is no longer available.
              </p>
              <p className="text-gray-500">
                Don't worry! There are plenty of other amazing opportunities waiting for you.
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/jobs">
                  🚀 Explore All Opportunities
                </Link>
              </Button>

              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
                <p className="text-blue-800 text-sm">
                  Internships get filled quickly! Make sure to apply early and check back often for new opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}