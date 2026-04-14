import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getSingleBlog } from "@/services/blogService";
import { getStoredUser } from "@/utils/auth";

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getSingleBlog(id);
        setBlog(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const authorFallback = `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
    blog?.author?.name || "Author"
  )}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7efe7_0%,#f2e7dd_100%)] px-4 py-4 sm:px-6 lg:px-10">
      <Navbar isSearchOpen={false} onCreate={() => {}} onToggleSearch={() => {}} user={user} />

      <main className="mx-auto mt-6 max-w-5xl">
        <Button className="rounded-2xl" onClick={() => navigate(-1)} variant="secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {loading ? (
          <div className="mt-6 rounded-[2rem] border border-copper/10 bg-white p-8 shadow-[0_18px_45px_rgba(43,43,43,0.08)]">
            <div className="animate-pulse space-y-4">
              <div className="h-3 w-24 rounded-full bg-copper/15" />
              <div className="h-10 w-3/4 rounded-full bg-ink/8" />
              <div className="h-64 rounded-[1.5rem] bg-ink/6" />
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {blog ? (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-[2rem] border border-copper/10 bg-white p-6 shadow-[0_18px_45px_rgba(43,43,43,0.08)] sm:p-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-copper/8 px-3 py-1 text-xs font-semibold text-copper">
                {blog.category}
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">
              {blog.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-ink/68">{blog.description}</p>

            <div className="mt-6 flex items-center justify-between gap-4 border-y border-copper/10 py-5">
              <div className="flex items-center gap-3">
                <img
                  alt={blog.author?.name || "Author"}
                  className="h-12 w-12 rounded-full object-cover"
                  src={blog.author?.image || authorFallback}
                />
                <div>
                  <div className="text-sm font-semibold text-ink">{blog.author?.name || "Unknown author"}</div>
                  <div className="text-xs text-ink/55">{blog.author?.email || "Blog author"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink/55">
                <Clock3 className="h-4 w-4" />
                {formatDate(blog.createdAt)}
              </div>
            </div>

            {blog.image ? (
              <img
                alt={blog.title}
                className="mt-6 h-[340px] w-full rounded-[1.75rem] object-cover"
                src={blog.image}
              />
            ) : null}

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-ink/78">
              {blog.content}
            </div>
          </motion.article>
        ) : null}
      </main>
    </div>
  );
}
