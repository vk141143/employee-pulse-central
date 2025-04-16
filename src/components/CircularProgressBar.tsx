
import { cn } from "@/lib/utils";

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
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;

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
          className={`progress-ring-circle ${color} transition-all duration-500 ease-in-out`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            animation: "progress 1s ease-out forwards",
          }}
        />
      </svg>
      <div className="absolute text-lg font-semibold">
        {Math.round(normalizedProgress)}%
      </div>
    </div>
  );
};

export default CircularProgressBar;
