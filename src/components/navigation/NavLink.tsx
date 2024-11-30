import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  external?: boolean;
}

export function NavLink({ to, children, external }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const LinkComponent = external ? 'a' : Link;
  const linkProps = external ? { href: to, target: "_blank", rel: "noopener noreferrer" } : { to };

  return (
    <LinkComponent
      {...linkProps}
      className={cn(
        "text-sm font-medium",
        "text-gray-600 hover:text-gray-900",
        "transition-colors duration-200",
        isActive && "text-gray-900"
      )}
    >
      {children}
    </LinkComponent>
  );
}