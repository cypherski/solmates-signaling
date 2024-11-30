import React from 'react';
import { NavLink } from './NavLink';
import { cn } from "@/lib/utils";

export function NavLinks() {
  return (
    <div className="hidden md:flex items-center space-x-12">
      <NavLink to="/features">Features</NavLink>
      <NavLink to="/video">Video Chat</NavLink>
      <NavLink to="/degen">Degen Den</NavLink>
    </div>
  );
}