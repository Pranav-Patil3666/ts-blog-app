import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-copper text-white shadow-lg shadow-copper/20 hover:bg-copper-dark",
        secondary: "bg-white/80 text-ink ring-1 ring-copper/10 hover:bg-white",
        outline: "border border-copper/20 bg-transparent text-copper hover:bg-copper/5",
        ghost: "text-copper hover:bg-copper/10",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ className, variant, size, type = "button", ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
