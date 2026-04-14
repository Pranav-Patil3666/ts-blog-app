import { motion } from "framer-motion";
import { ArrowUpRight, Flame, PenSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar({ user, onCreate }) {
  const avatarFallback = `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
    user?.name || "User"
  )}`;

  const trending = [
    { label: "Minimal Writing Systems", meta: "1.8k readers" },
    { label: "AI for Storytelling", meta: "Trending in Tech" },
    { label: "Creator Workflows", meta: "Hot this week" },
  ];

  const categories = ["Writing", "Design", "Startups", "Travel", "Culture"];

  return (
    <div className="space-y-5">
      <motion.div
        className="rounded-[1.75rem] border border-copper/10 bg-white p-5 shadow-[0_18px_45px_rgba(43,43,43,0.08)]"
        initial={{ opacity: 0, x: 18 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-4">
          <img
            alt={user?.name || "User"}
            className="h-16 w-16 rounded-2xl object-cover"
            src={user?.image || avatarFallback}
          />
          <div>
            <div className="text-lg font-semibold text-ink">{user?.name || "Writer"}</div>
            <div className="text-sm text-ink/55">{user?.email || "your@blogspace.com"}</div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-ink/68">
          {user?.bio || "Shape ideas, publish cleanly, and keep your audience close to every update."}
        </p>
      </motion.div>

      <motion.div
        className="rounded-[1.75rem] border border-copper/10 bg-white p-5 shadow-[0_18px_45px_rgba(43,43,43,0.08)]"
        initial={{ opacity: 0, x: 18 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <TrendingUp className="h-4 w-4 text-copper" />
          Trending blogs
        </div>
        <div className="space-y-3">
          {trending.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-vanilla px-4 py-3 transition hover:bg-copper/8"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-ink">{item.label}</div>
                  <div className="mt-1 text-xs text-ink/55">{item.meta}</div>
                </div>
                <ArrowUpRight className="mt-0.5 h-4 w-4 text-copper" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="rounded-[1.75rem] border border-copper/10 bg-white p-5 shadow-[0_18px_45px_rgba(43,43,43,0.08)]"
        initial={{ opacity: 0, x: 18 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <Flame className="h-4 w-4 text-copper" />
          Categories
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-copper/10 bg-vanilla px-3 py-1.5 text-xs font-semibold text-copper"
            >
              {category}
            </span>
          ))}
        </div>
        <Button className="mt-5 h-12 w-full rounded-2xl" onClick={onCreate}>
          <PenSquare className="mr-2 h-4 w-4" />
          Create Blog
        </Button>
      </motion.div>
    </div>
  );
}
