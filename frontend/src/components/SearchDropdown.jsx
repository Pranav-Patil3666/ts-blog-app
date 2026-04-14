import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchDropdown({
  isOpen,
  query,
  results,
  loading,
  onQueryChange,
  onClose,
  onSelect,
}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    inputRef.current?.focus();

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 top-[calc(100%+1rem)] z-40 w-full max-w-3xl -translate-x-1/2 px-2 sm:px-0"
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div
            ref={containerRef}
            className="overflow-hidden rounded-[1.75rem] border border-copper/10 bg-white shadow-[0_28px_80px_rgba(43,43,43,0.12)]"
          >
            <div className="border-b border-copper/10 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <Input
                  ref={inputRef}
                  className="h-12 rounded-2xl border-transparent bg-vanilla pl-11 shadow-none focus:border-copper/20"
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search blogs, topics, and ideas..."
                  value={query}
                />
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-3">
              {loading ? (
                <div className="flex items-center gap-3 rounded-2xl px-4 py-5 text-sm text-copper">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Searching blogs...
                </div>
              ) : null}

              {!loading && query.trim() && results.length === 0 ? (
                <div className="rounded-2xl bg-vanilla px-4 py-5 text-sm text-ink/60">
                  No blogs found for &quot;{query}&quot;.
                </div>
              ) : null}

              {!loading && results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => {
                    const authorFallback = `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
                      result.author?.name || "Author"
                    )}`;

                    return (
                      <button
                        key={result.id}
                        className="w-full rounded-2xl px-4 py-3 text-left transition hover:bg-copper/6"
                        onClick={() => onSelect(result)}
                        type="button"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            alt={result.author?.name || "Author"}
                            className="h-10 w-10 rounded-full object-cover"
                            src={result.author?.image || authorFallback}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-ink">{result.title}</div>
                            <div className="mt-1 line-clamp-2 text-sm leading-6 text-ink/60">
                              {result.description}
                            </div>
                            <div className="mt-2 text-xs font-medium text-copper">
                              {result.author?.name || "Unknown author"}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
