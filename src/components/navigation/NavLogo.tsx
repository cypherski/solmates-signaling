import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

export function NavLogo() {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2",
        "text-gray-900",
        "transition-opacity duration-200",
        "hover:opacity-80"
      )}
    >
      <span className="text-2xl font-bold tracking-tight">SolMates</span>
    </Link>
  );
}