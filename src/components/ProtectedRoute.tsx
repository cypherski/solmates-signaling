import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { connected, connecting } = useWallet();
  const location = useLocation();

  if (connecting) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-white to-gray-50"
      )}>
        <div className="text-center">
          <Loader className={cn(
            "w-8 h-8 animate-spin mx-auto mb-4",
            "text-transparent bg-clip-text",
            "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          )} />
          <p className={cn(
            "text-lg font-medium",
            "text-transparent bg-clip-text",
            "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          )}>
            Connecting to wallet...
          </p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}