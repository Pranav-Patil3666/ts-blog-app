import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { CreateBlogModal } from "@/components/CreateBlogModal";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { SearchDropdown } from "@/components/SearchDropdown";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/services/api";
import { createBlog, getAllBlogs } from "@/services/blogService";
import { getSavedBlogs, toggleSaveBlog } from "@/services/saveBlogService";
import { consumeLoginTransition, getStoredUser } from "@/utils/auth";

export function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [userLoading, setUserLoading] = useState(!getStoredUser());
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState("");
  const [showLoader, setShowLoader] = useState(() => consumeLoginTransition());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [savedBlogIds, setSavedBlogIds] = useState(new Set());
  const [saveLoadingMap, setSaveLoadingMap] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      setUserLoading(true);

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (requestError) {
        setBlogsError(requestError.message);
      } finally {
        setUserLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    let cancelled = false;

    const loadSavedBlogs = async () => {
      try {
        const savedIds = await getSavedBlogs(user._id);

        if (!cancelled) {
          setSavedBlogIds(new Set(savedIds.map(String)));
        }
      } catch {
        if (!cancelled) {
          setSavedBlogIds(new Set());
        }
      }
    };

    loadSavedBlogs();

    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  const loadBlogs = async () => {
    setBlogsLoading(true);
    setBlogsError("");

    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (requestError) {
      setBlogsError(requestError.message);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      return undefined;
    }

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setSearchLoading(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setSearchLoading(true);

      try {
        const results = await getAllBlogs({ searchQuery: trimmedQuery });
        setSearchResults(results);
      } catch (requestError) {
        setBlogsError(requestError.message);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isSearchOpen, searchQuery]);

  const heroStats = useMemo(
    () => [
      { label: "Stories live", value: `${blogs.length || 0}` },
      { label: "Writers active", value: "42" },
      { label: "Comments today", value: "89" },
    ],
    [blogs.length]
  );

  const handleCreateBlog = async (payload) => {
    setSubmittingBlog(true);
    setCreateError("");

    try {
      await createBlog(payload);
      await loadBlogs();
      setIsCreateOpen(false);
    } catch (requestError) {
      setCreateError(requestError.message);
    } finally {
      setSubmittingBlog(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen((current) => !current);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectResult = (result) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/blogs/${result.id}`);
  };

  const handleToggleSave = async (blogId) => {
    if (!user?._id) {
      return;
    }

    const key = String(blogId);
    const wasSaved = savedBlogIds.has(key);

    setSaveLoadingMap((current) => ({ ...current, [key]: true }));
    setSavedBlogIds((current) => {
      const next = new Set(current);

      if (wasSaved) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });

    try {
      await toggleSaveBlog(user._id, blogId);
    } catch (requestError) {
      setBlogsError(requestError.message);
      setSavedBlogIds((current) => {
        const next = new Set(current);

        if (wasSaved) {
          next.add(key);
        } else {
          next.delete(key);
        }

        return next;
      });
    } finally {
      setSaveLoadingMap((current) => ({ ...current, [key]: false }));
    }
  };

  return (
    <>
      <AnimatePresence>{showLoader ? <Loader onComplete={() => setShowLoader(false)} /> : null}</AnimatePresence>

      <div className="min-h-screen bg-[linear-gradient(180deg,#f7efe7_0%,#f2e7dd_100%)] px-4 py-4 sm:px-6 lg:px-10">
        <div className="relative">
          <Navbar
            isSearchOpen={isSearchOpen}
            onCreate={() => setIsCreateOpen(true)}
            onToggleSearch={toggleSearch}
            user={user}
          />
          <SearchDropdown
            isOpen={isSearchOpen}
            loading={searchLoading}
            onClose={() => setIsSearchOpen(false)}
            onQueryChange={setSearchQuery}
            onSelect={handleSelectResult}
            query={searchQuery}
            results={searchResults}
          />
        </div>

        <motion.main
          animate={{ opacity: showLoader ? 0 : 1, y: showLoader ? 18 : 0 }}
          className="mx-auto mt-6 max-w-7xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="rounded-[2rem] border border-white/60 bg-white/45 p-6 shadow-[0_18px_45px_rgba(43,43,43,0.08)] backdrop-blur-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-copper/15 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-copper">
                  <Sparkles className="h-3.5 w-3.5" />
                  Modern storytelling workspace
                </div>
                <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-ink sm:text-6xl">
                  Where thoughtful writing gets a cleaner home.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-ink/68 sm:text-lg">
                  Discover sharp essays, publish with confidence, and keep every draft, reader, and reply in one elegant flow.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] bg-white px-5 py-4 shadow-sm ring-1 ring-copper/8">
                    <div className="text-2xl font-bold tracking-tight text-ink">{stat.value}</div>
                    <div className="mt-1 text-sm text-ink/55">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {blogsError ? (
            <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {blogsError}
            </div>
          ) : null}

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <section className="lg:col-span-8">
              <div className="space-y-5">
                {blogsLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-[1.75rem] border border-copper/10 bg-white p-6 shadow-[0_18px_45px_rgba(43,43,43,0.08)]"
                      >
                        <div className="animate-pulse space-y-4">
                          <div className="h-3 w-24 rounded-full bg-copper/15" />
                          <div className="h-8 w-3/4 rounded-full bg-ink/8" />
                          <div className="h-3 w-full rounded-full bg-ink/8" />
                          <div className="h-3 w-11/12 rounded-full bg-ink/8" />
                        </div>
                      </div>
                    ))
                  : null}

                {!blogsLoading && blogs.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-copper/10 bg-white p-8 text-center shadow-[0_18px_45px_rgba(43,43,43,0.08)]">
                    <div className="text-2xl font-semibold text-ink">No blogs found</div>
                    <div className="mt-3 text-sm leading-7 text-ink/60">
                      Publish your first story to start filling this feed.
                    </div>
                  </div>
                ) : null}

                {!blogsLoading
                  ? blogs.map((post, index) => (
                      <BlogCard
                        key={post.id}
                        index={index}
                        isSaved={savedBlogIds.has(String(post.id))}
                        onToggleSave={handleToggleSave}
                        post={post}
                        saveLoading={Boolean(saveLoadingMap[String(post.id)])}
                        user={user}
                      />
                    ))
                  : null}
              </div>
            </section>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Sidebar onCreate={() => setIsCreateOpen(true)} user={userLoading ? getStoredUser() : user} />
              </div>
            </aside>
          </div>
        </motion.main>
      </div>

      <CreateBlogModal
        error={createError}
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateError("");
        }}
        onSubmit={handleCreateBlog}
        submitting={submittingBlog}
        user={user}
      />
    </>
  );
}
