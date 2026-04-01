"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push("/");
  };

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary-light rounded-lg transition-colors"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <span className="hidden sm:inline">{displayName}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 border-b border-border text-sm text-muted">
            {user.email}
          </div>
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-foreground hover:bg-primary-light transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            My Account
          </Link>
          <Link
            href="/account/favorites"
            className="block px-4 py-2 text-sm text-foreground hover:bg-primary-light transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            My Favorites
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary-light transition-colors border-t border-border"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
