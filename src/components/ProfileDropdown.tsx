"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/actions/auth.actions";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface ProfileDropdownProps {
  user: User;
  profile: {
    role: string;
    company_name?: string | null;
    first_name?: string | null;
  } | null;
}

function getDisplayName(
  profile: ProfileDropdownProps["profile"],
  email: string | undefined
) {
  return (
    profile?.company_name ??
    profile?.first_name ??
    email?.split("@")[0] ??
    "User"
  );
}

export default function ProfileDropdown({
  user,
  profile,
}: ProfileDropdownProps) {
  const displayName = getDisplayName(profile, user.email);

  // Wrapper action to avoid TypeScript error with return value
  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar alt={displayName} size={64} className="scale-[0.4]" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {profile?.role === "business" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/post-job" className="cursor-pointer">
                Post a Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <button
            onClick={handleSignOut}
            className="w-full text-left cursor-pointer"
          >
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
