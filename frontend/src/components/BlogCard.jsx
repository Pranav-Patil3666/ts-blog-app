import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Clock3, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addComment, getComments } from "@/services/commentService";

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

export function BlogCard({
  post,
  index,
  user,
  isSaved,
  onToggleSave,
  saveLoading,
}) {
  const navigate = useNavigate();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const authorFallback = useMemo(
    () =>
      `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
        post.author?.name || "Author"
      )}`,
    [post.author?.name]
  );

  useEffect(() => {
    if (!isCommentsOpen) {
      return;
    }

    let cancelled = false;

    const loadComments = async () => {
      setCommentsLoading(true);
      setCommentsError("");

      try {
        const data = await getComments(post.id);

        if (!cancelled) {
          setComments(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setCommentsError(requestError.message);
        }
      } finally {
        if (!cancelled) {
          setCommentsLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [isCommentsOpen, post.id]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user?._id) {
      return;
    }

    const optimisticComment = {
      id: `temp-${Date.now()}`,
      comment: commentText.trim(),
      userID: user._id,
      username: user.name || "You",
      blogid: post.id,
      createdAt: new Date().toISOString(),
    };

    setSubmittingComment(true);
    setCommentsError("");
    setComments((current) => [optimisticComment, ...current]);
    setCommentText("");

    try {
      const createdComment = await addComment(post.id, optimisticComment.comment, user);
      setComments((current) =>
        current.map((item) => (item.id === optimisticComment.id ? createdComment : item))
      );
    } catch (requestError) {
      setComments((current) => current.filter((item) => item.id !== optimisticComment.id));
      setCommentsError(requestError.message);
      setCommentText(optimisticComment.comment);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <motion.article
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
    >
      <div className="flex items-start justify-between gap-4">
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

        <button
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
            isSaved
              ? "border-copper/20 bg-copper text-white shadow-sm"
              : "border-copper/10 bg-vanilla text-copper hover:bg-copper/8"
          }`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave?.(post.id);
          }}
          type="button"
        >
          <motion.div animate={{ scale: isSaved ? 1.08 : 1 }} transition={{ duration: 0.18 }}>
            <Bookmark className="h-4.5 w-4.5" fill={isSaved ? "currentColor" : "none"} />
          </motion.div>
          <span className="sr-only">{isSaved ? "Unsave blog" : "Save blog"}</span>
        </button>
      </div>

      <button
        className="mt-5 block text-left"
        onClick={() => navigate(`/blogs/${post.id}`)}
        type="button"
      >
        <h3 className="text-2xl font-bold tracking-tight text-ink">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink/68">{post.description}</p>
      </button>

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

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-copper/10 pt-5">
        <button
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink/65 transition hover:bg-copper/8 hover:text-copper"
          onClick={() => navigate(`/blogs/${post.id}`)}
          type="button"
        >
          Read more
        </button>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink/65 transition hover:bg-copper/8 hover:text-copper"
            onClick={() => setIsCommentsOpen((current) => !current)}
            type="button"
          >
            <MessageSquare className="h-4 w-4" />
            {isCommentsOpen ? "Hide Comments" : "View Comments"}
          </button>
          {saveLoading ? <div className="text-xs text-copper">Saving...</div> : null}
        </div>
      </div>

      {isCommentsOpen ? (
        <motion.div
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="mt-5 rounded-[1.5rem] border border-copper/10 bg-[#FFFDFC] p-4">
            <div className="flex items-start gap-3">
              <img
                alt={user?.name || "You"}
                className="h-10 w-10 rounded-full object-cover"
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
                    user?.name || "You"
                  )}`
                }
              />
              <div className="flex-1 space-y-3">
                <textarea
                  className="min-h-24 w-full rounded-2xl border border-copper/12 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-copper/30 focus:ring-4 focus:ring-copper/10"
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Add your thoughts..."
                  value={commentText}
                />
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-copper px-4 py-2 text-sm font-semibold text-white transition hover:bg-copper-dark disabled:opacity-60"
                    disabled={submittingComment || !commentText.trim() || !user?._id}
                    onClick={handleCommentSubmit}
                    type="button"
                  >
                    <Send className="h-4 w-4" />
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>

            {commentsError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {commentsError}
              </div>
            ) : null}

            <div className="mt-4 space-y-3">
              {commentsLoading ? (
                <div className="text-sm text-copper">Loading comments...</div>
              ) : null}

              {!commentsLoading && comments.length === 0 ? (
                <div className="rounded-2xl bg-vanilla px-4 py-4 text-sm text-ink/60">
                  No comments yet.
                </div>
              ) : null}

              {comments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-copper/8 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-copper/12 text-xs font-semibold text-copper">
                      {(item.username || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-ink">{item.username || "User"}</div>
                        <div className="text-xs text-ink/45">{formatTime(item.createdAt)}</div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-ink/68">{item.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </motion.article>
  );
}
