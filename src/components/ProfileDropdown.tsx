"use client";

import type { User } from "@supabase/supabase-js";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

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
  const { setTheme, theme } = useTheme();

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

        {(profile?.role === "business" || profile?.role === "admin") && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                {profile?.role === "admin" ? "Jobs Dashboard" : "Dashboard"}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/post-job" className="cursor-pointer">
                Post a Job
              </Link>
            </DropdownMenuItem>
            {profile?.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

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
