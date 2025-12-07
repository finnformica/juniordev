import ProfileDropdown from "@/components/ProfileDropdown";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get user and profile info for navigation
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, company_name, first_name")
      .eq("id", user.id)
      .single();
    userProfile = profile;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-xl font-semibold hover:text-gray-600"
            >
              junior.dev
            </Link>

            <nav className="flex items-center gap-4">
              {user ? (
                <ProfileDropdown user={user} profile={userProfile} />
              ) : (
                <Link href="/login" className="hover:text-gray-600">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
