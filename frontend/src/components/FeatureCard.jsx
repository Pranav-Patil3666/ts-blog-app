import { cn } from "@/lib/utils";

export function FeatureCard({ icon: Icon, title, eyebrow, preview, className }) {
  return (
    <div
      className={cn(
        "group rounded-[1.75rem] border border-copper/10 bg-white p-6 shadow-[0_18px_45px_rgba(43,43,43,0.08)] transition duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_28px_70px_rgba(43,43,43,0.14)]",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          {eyebrow ? (
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper/80">
              {eyebrow}
            </div>
          ) : null}
          <h3 className="text-xl font-semibold tracking-tight text-ink">{title}</h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-copper/10 text-copper transition group-hover:bg-copper group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 rounded-[1.4rem] border border-copper/10 bg-[linear-gradient(180deg,#fffdfb_0%,#f8efe7_100%)] p-4 shadow-inner">
        {preview}
      </div>
    </div>
  );
}
