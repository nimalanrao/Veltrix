import { cn } from "../../lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: "rectangle" | "circle" | "text";
}

export default function LoadingSkeleton({
  className,
  width,
  height,
  variant = "rectangle",
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-100/80",
        variant === "circle" ? "rounded-full" : "rounded-2xl",
        variant === "text" ? "h-4 w-3/4 rounded-lg" : "",
        className
      )}
      style={{ width, height }}
    />
  );
}
