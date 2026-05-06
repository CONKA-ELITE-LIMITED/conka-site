"use client";

import { useState, useEffect, useRef } from "react";

interface WinCountdownProps {
  deadline?: string;
}

export default function WinCountdown({ deadline }: WinCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Default to end of January 2026 if no deadline provided
    const defaultDeadline = deadline || "2026-01-31T23:59:59Z";
    const deadlineDate = new Date(defaultDeadline).getTime();

    const calculateTimeRemaining = () => {
      const now = Date.now();
      const difference = deadlineDate - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    intervalRef.current = setInterval(calculateTimeRemaining, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [deadline]);

  if (!timeRemaining) {
    return (
      <div className="px-0 md:px-16 pt-4 md:pt-6 pb-6 md:pb-8">
        <div className="max-w-full md:max-w-6xl mx-auto">
          <div className="neo-box-inverted p-6 md:p-8">
            <p className="font-mono text-sm opacity-80 text-center">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 md:px-16 pt-4 md:pt-6 pb-6 md:pb-8">
      <div className="max-w-full md:max-w-6xl mx-auto">
        <div className="neo-box-inverted p-6 md:p-8">
          <p className="font-commentary text-lg md:text-xl mb-4 text-center">
            Time remaining
          </p>
          <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <p className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold">
                {timeRemaining.days}
              </p>
              <p className="font-mono text-xs opacity-80 mt-1">days</p>
            </div>
            <span className="font-mono text-2xl sm:text-3xl opacity-60">
              :
            </span>
            <div className="text-center">
              <p className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold">
                {timeRemaining.hours}
              </p>
              <p className="font-mono text-xs opacity-80 mt-1">hours</p>
            </div>
            <span className="font-mono text-2xl sm:text-3xl opacity-60">
              :
            </span>
            <div className="text-center">
              <p className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold">
                {timeRemaining.minutes}
              </p>
              <p className="font-mono text-xs opacity-80 mt-1">minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
