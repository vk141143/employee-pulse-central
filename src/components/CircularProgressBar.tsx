
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

const CircularProgressBar = ({
  progress,
  size = 100,
  strokeWidth = 8,
  className,
  color = "stroke-primary"
}: CircularProgressProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    // Animate the progress value
    const timer = setTimeout(() => {
      setAnimatedProgress(normalizedProgress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [normalizedProgress]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          className="stroke-slate-200"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          className={`progress-ring-circle ${color} transition-all duration-700 ease-out`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-lg font-semibold">
        {Math.round(animatedProgress)}%
      </div>
    </div>
  );
};

export default CircularProgressBar;
