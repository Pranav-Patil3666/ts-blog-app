import { cn } from "@/lib/utils";

export function PageShell({ className, children }) {
  return (
    <div
      className={cn(
        "min-h-screen px-6 py-8 sm:px-8 lg:px-12 xl:px-16",
        className
      )}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}
