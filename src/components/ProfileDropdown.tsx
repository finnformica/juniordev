"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/actions/auth.actions";

interface ProfileDropdownProps {
  user: {
    email: string;
  };
  profile: {
    role: string;
    company_name?: string | null;
    first_name?: string | null;
  } | null;
}

function getInitials(profile: ProfileDropdownProps["profile"], email: string): string {
  if (profile?.company_name) {
    return profile.company_name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  if (profile?.first_name) {
    return profile.first_name.charAt(0).toUpperCase();
  }

  return email.charAt(0).toUpperCase();
}

function getDisplayName(profile: ProfileDropdownProps["profile"], email: string): string {
  return profile?.company_name || profile?.first_name || email.split("@")[0];
}

export default function ProfileDropdown({ user, profile }: ProfileDropdownProps) {
  const displayName = getDisplayName(profile, user.email);
  const initials = getInitials(profile, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
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
          <form action={signOutAction} className="w-full">
            <button type="submit" className="w-full text-left cursor-pointer">
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}