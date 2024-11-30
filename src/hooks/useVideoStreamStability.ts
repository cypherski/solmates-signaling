import { useState, useEffect } from 'react';

export function useVideoStreamStability(stream: MediaStream | null) {
  const [isStable, setIsStable] = useState(true);

  useEffect(() => setIsStable(!!stream), [stream]);

  return { isStable };
}