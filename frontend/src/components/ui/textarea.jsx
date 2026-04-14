import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-copper/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-copper/40 focus:ring-4 focus:ring-copper/10",
        className
      )}
      {...props}
    />
  );
}
