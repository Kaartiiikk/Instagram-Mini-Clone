import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 300);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, duration]);

  return (
    <div
      className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      data-testid="splash-screen"
    >
      <div className="w-20 h-20 mb-4 bg-secondary rounded-full flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-10 h-10 text-foreground"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <h1 className="text-xl font-bold" data-testid="text-splash-title">Mini-Instagram</h1>
      <p className="text-sm text-muted-foreground mt-1">Welcome back</p>
    </div>
  );
}
