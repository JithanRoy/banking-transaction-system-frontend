import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  message?: string;
  size?: "sm" | "md" | "lg";
};

export function LoadingSpinner({
  message = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const containerPadding = {
    sm: "py-6",
    md: "py-12",
    lg: "py-16",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${containerPadding[size]}`}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
