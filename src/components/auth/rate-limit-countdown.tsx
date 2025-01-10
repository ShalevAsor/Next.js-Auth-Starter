import { useState, useEffect } from "react";

interface RateLimitCountdownProps {
  initialSeconds: number;
  onComplete: () => void;
}

export const RateLimitCountdown = ({
  initialSeconds,
  onComplete,
}: RateLimitCountdownProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    // Instead of checking immediately, we'll always set up the interval
    const interval = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(interval);
          // Schedule the onComplete callback for the next tick
          setTimeout(onComplete, 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [onComplete]); // Only depend on onComplete

  return (
    <div className="p-3 rounded-md bg-destructive/15 text-destructive text-center">
      Too many login attempts. Please try again in {seconds} seconds
    </div>
  );
};
