import { useState } from "react";
import { Activity, BookOpenText, LayoutGrid, MessagesSquare } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { FeatureCard } from "@/components/FeatureCard";
import { PageShell } from "@/components/PageShell";

const features = [
  {
    title: "Create Blogs",
    eyebrow: "Editor",
    icon: BookOpenText,
    className: "col-span-2 min-h-[320px]",
    preview: (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm">
          <div className="h-3 w-28 rounded-full bg-copper/20" />
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-copper/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-copper/15" />
          </div>
        </div>
        <div className="rounded-[1.35rem] border border-copper/10 bg-white p-4 shadow-sm">
          <div className="rounded-xl border border-copper/10 bg-vanilla/45 px-3 py-2.5">
            <div className="h-3 w-3/4 rounded-full bg-copper/25" />
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="h-2.5 w-full rounded-full bg-ink/8" />
            <div className="h-2.5 w-full rounded-full bg-ink/8" />
            <div className="h-2.5 w-10/12 rounded-full bg-ink/8" />
            <div className="h-2.5 w-8/12 rounded-full bg-ink/8" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-copper/8 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="h-2.5 w-20 rounded-full bg-copper/20" />
          </div>
          <div className="flex gap-2">
            <div className="rounded-full border border-copper/15 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-copper">
              Draft
            </div>
            <div className="rounded-full bg-copper px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              Publish
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Explore Categories",
    eyebrow: "Discovery",
    icon: LayoutGrid,
    className: "min-h-[220px]",
    preview: (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {["Tech", "Travel", "Design", "Writing"].map((tag, index) => (
            <span
              key={tag}
              className={
                index === 0 || index === 2
                  ? "rounded-full bg-copper px-3 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full border border-copper/15 bg-white px-3 py-1.5 text-xs font-semibold text-copper"
              }
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="h-2.5 w-16 rounded-full bg-copper/18" />
            <div className="mt-3 h-14 rounded-xl bg-vanilla-deep/70" />
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="h-2.5 w-12 rounded-full bg-copper/18" />
            <div className="mt-3 h-14 rounded-xl bg-copper/10" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Real-time Updates",
    eyebrow: "Live Feed",
    icon: Activity,
    className: "min-h-[220px]",
    preview: (
      <div className="space-y-3">
        {["User updated blog", "New comment added"].map((label, index) => (
          <div key={label} className="flex items-start gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm">
            <span className={index === 0 ? "mt-1 h-2.5 w-2.5 rounded-full bg-copper" : "mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400"} />
            <div className="flex-1">
              <div className="text-sm font-medium text-ink">{label}</div>
              <div className="mt-1 h-2.5 w-4/5 rounded-full bg-ink/7" />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-copper/80">
          <span className="h-2 w-2 animate-pulse rounded-full bg-copper" />
          Live syncing
        </div>
      </div>
    ),
  },
  {
    title: "Engage with Community",
    eyebrow: "Community",
    icon: MessagesSquare,
    className: "col-span-2 min-h-[220px]",
    preview: (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#A75F37,#D29A77)]" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-20 rounded-full bg-copper/20" />
              <div className="h-2.5 w-10 rounded-full bg-ink/8" />
            </div>
            <div className="h-2.5 w-full rounded-full bg-ink/8" />
            <div className="h-2.5 w-10/12 rounded-full bg-ink/8" />
            <div className="inline-flex rounded-full bg-copper/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-copper">
              Reply thread
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="h-7 w-7 rounded-full border-2 border-white bg-copper/80" />
            <div className="h-7 w-7 rounded-full border-2 border-white bg-amber-400" />
            <div className="h-7 w-7 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="text-xs font-medium text-ink/60">12 new responses today</div>
        </div>
      </div>
    ),
  },
];

function buildGoogleOAuthUrl() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri =
    import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:5173/auth/callback";

  if (!clientId) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID. Add it to your frontend environment.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    let oauthUrl = "";

    try {
      oauthUrl = buildGoogleOAuthUrl();
    } catch (oauthError) {
      setError(oauthError.message);
      return;
    }

    setError("");
    setLoading(true);
    window.location.assign(oauthUrl);
  };

  return (
    <PageShell className="flex items-center bg-vanilla">
      <div className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-12 xl:gap-10">
        <section className="rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.24))] p-8 shadow-[0_25px_80px_rgba(43,43,43,0.08)] ring-1 ring-white/60 sm:p-10 xl:col-span-8 xl:p-12">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-copper/15 bg-white/75 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-copper shadow-sm">
                Modern blogging workspace
              </div>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] xl:items-end">
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-6xl font-extrabold tracking-[-0.06em] text-ink sm:text-7xl">
                    Just <span className="text-copper">BLOG</span> it
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-ink/72 xl:text-xl">
                    A cleaner writing workspace for publishing ideas, organizing topics, and building a living community around every post.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-copper/10 bg-white/70 p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-semibold text-ink">Content performance</div>
                    <div className="rounded-full bg-copper/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-copper">
                      This week
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-ink/60">
                        <span>Drafts completed</span>
                        <span>84%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-copper/10">
                        <div className="h-2.5 w-[84%] rounded-full bg-copper" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-vanilla p-3">
                        <div className="text-xl font-bold text-ink">28</div>
                        <div className="text-xs text-ink/55">Posts</div>
                      </div>
                      <div className="rounded-2xl bg-vanilla p-3">
                        <div className="text-xl font-bold text-ink">12k</div>
                        <div className="text-xs text-ink/55">Views</div>
                      </div>
                      <div className="rounded-2xl bg-vanilla p-3">
                        <div className="text-xl font-bold text-ink">316</div>
                        <div className="text-xs text-ink/55">Replies</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="xl:col-span-4">
          <div className="xl:sticky xl:top-10">
            <AuthCard error={error} loading={loading} onGoogleLogin={handleGoogleLogin} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
