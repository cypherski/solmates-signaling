import React, { useState } from 'react';
import { FloatingAvatars } from './hero/FloatingAvatars';
import { HeroTitle } from './hero/HeroTitle';
import { HeroDescription } from './hero/HeroDescription';
import { HeroButtons } from './hero/HeroButtons';
import { HeroError } from './hero/HeroError';

export function Hero() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-blur opacity-50" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <HeroTitle />
        <HeroDescription />
        <HeroButtons onError={setError} />
        <HeroError error={error} />
      </div>

      <FloatingAvatars />
    </div>
  );
}