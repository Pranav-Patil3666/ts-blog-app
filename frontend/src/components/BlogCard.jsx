import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatTime(value) {
  if (!value) {
    return "Recently";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogCard({ post, index }) {
  const navigate = useNavigate();
  const authorFallback = `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
    post.author?.name || "Author"
  )}`;

  return (
    <motion.article
      onClick={() => navigate(`/blogs/${post.id}`)}
      className="rounded-[1.75rem] border border-copper/10 bg-white p-6 shadow-[0_18px_45px_rgba(43,43,43,0.08)]"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: "0 28px 70px rgba(43,43,43,0.14)",
      }}
      whileInView={{ opacity: 1, y: 0 }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/blogs/${post.id}`);
        }
      }}
    >
      <div className="flex flex-wrap gap-2">
        {[post.category].filter(Boolean).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-copper/8 px-3 py-1 text-xs font-semibold text-copper"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink/68">{post.description}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            alt={post.author?.name || "Author"}
            className="h-11 w-11 rounded-full object-cover"
            src={post.author?.image || authorFallback}
          />
          <div>
            <div className="text-sm font-semibold text-ink">{post.author?.name || "Unknown author"}</div>
            <div className="flex items-center gap-1 text-xs text-ink/50">
              <Clock3 className="h-3.5 w-3.5" />
              {formatTime(post.createdAt)}
            </div>
          </div>
        </div>
        <div className="rounded-full border border-copper/10 bg-vanilla px-3 py-1 text-xs font-medium text-ink/65">
          {Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 80) / 180))} min read
        </div>
      </div>
    </motion.article>
  );
}
