"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  size?: "default" | "large";
  className?: string;
}

export function SearchBar({
  placeholder = "Search states, curricula, co-ops, and more...",
  size = "default",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/find?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeClasses =
    size === "large"
      ? "py-4 px-6 text-lg pr-14"
      : "py-3 px-4 text-base pr-12";

  const buttonSize = size === "large" ? "w-10 h-10" : "w-8 h-8";

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${sizeClasses} bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow`}
        aria-label="Search"
      />
      <button
        type="submit"
        className={`absolute right-3 top-1/2 -translate-y-1/2 ${buttonSize} bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-colors`}
        aria-label="Search"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  );
}
