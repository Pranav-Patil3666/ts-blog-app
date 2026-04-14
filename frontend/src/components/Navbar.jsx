import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, PenSquare, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "@/utils/auth";

const navItems = [
  { label: "Home", icon: null },
  { label: "Search", icon: Search },
  { label: "Create", icon: PenSquare },
  { label: "About", icon: null },
];

export function Navbar({ user, onCreate, onToggleSearch, isSearchOpen = false }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const closeMenus = () => {
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
    };

    window.addEventListener("resize", closeMenus);
    return () => window.removeEventListener("resize", closeMenus);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const avatarFallback = `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
    user?.name || "User"
  )}`;

  const handleNavClick = (item) => {
    if (item === "Create") {
      onCreate();
    }

    if (item === "Search") {
      onToggleSearch?.();
    }

    if (item === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-4 z-50">
      <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-white/60 bg-white/65 px-4 py-3 shadow-[0_18px_45px_rgba(43,43,43,0.08)] backdrop-blur-xl sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            className="text-left text-2xl font-extrabold tracking-[-0.05em] text-ink"
            onClick={() => navigate("/")}
            type="button"
          >
            Just <span className="text-copper">BLOG</span> it
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  label === "Search" && isSearchOpen
                    ? "bg-copper/10 text-copper"
                    : "text-ink/70 hover:bg-copper/8 hover:text-copper"
                }`}
                onClick={() => handleNavClick(label)}
                type="button"
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="relative">
              <button
                className="flex items-center gap-3 rounded-full bg-white px-2 py-2 shadow-sm ring-1 ring-copper/10"
                onClick={() => setIsDropdownOpen((current) => !current)}
                type="button"
              >
                <img
                  alt={user?.name || "User avatar"}
                  className="h-10 w-10 rounded-full object-cover"
                  src={user?.image || avatarFallback}
                />
                <div className="hidden text-left lg:block">
                  <div className="text-sm font-semibold text-ink">{user?.name || "Writer"}</div>
                  <div className="text-xs text-ink/55">Personal workspace</div>
                </div>
                <ChevronDown className="h-4 w-4 text-ink/55" />
              </button>

              <AnimatePresence>
                {isDropdownOpen ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-[calc(100%+0.75rem)] w-44 rounded-2xl border border-copper/10 bg-white p-2 shadow-xl"
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <button
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-copper/8 hover:text-copper"
                      onClick={() => {
                        navigate("/profile");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                    >
                      Profile
                    </button>
                    <button
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      onClick={handleLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink shadow-sm ring-1 ring-copper/10 md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden md:hidden"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mt-4 space-y-2 border-t border-copper/10 pt-4">
                {navItems.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      label === "Search" && isSearchOpen
                        ? "bg-copper/10 text-copper"
                        : "text-ink/75 hover:bg-copper/8 hover:text-copper"
                    }`}
                    onClick={() => handleNavClick(label)}
                    type="button"
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {label}
                  </button>
                ))}
                <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-copper/10">
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      alt={user?.name || "User avatar"}
                      className="h-10 w-10 rounded-full object-cover"
                      src={user?.image || avatarFallback}
                    />
                    <div>
                      <div className="text-sm font-semibold text-ink">{user?.name || "Writer"}</div>
                      <div className="text-xs text-ink/55">{user?.email || "Signed in"}</div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <button
                      className="rounded-xl px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-copper/8 hover:text-copper"
                      onClick={() => navigate("/profile")}
                      type="button"
                    >
                      Profile
                    </button>
                    <button
                      className="rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      onClick={handleLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
