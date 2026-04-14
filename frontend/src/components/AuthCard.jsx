import { Chrome, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tabs = ["Signup", "Login"];

export function AuthCard({ onGoogleLogin, loading, error }) {
  return (
    <Card className="w-full rounded-[2rem] border border-copper/10 bg-white px-1 py-2 shadow-[0_28px_80px_rgba(43,43,43,0.12)]">
      <CardHeader className="space-y-5 pb-5">
        <div className="flex rounded-2xl bg-vanilla p-1">
          {tabs.map((tab, index) => (
            <div
              key={tab}
              className={cn(
                "flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold transition",
                index === 1 ? "bg-white text-copper shadow-sm" : "text-ink/55"
              )}
            >
              {tab}
            </div>
          ))}
        </div>
        <div>
          <CardTitle className="text-3xl font-black tracking-tight text-ink">Welcome back</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6 text-ink/65">
            Continue with Google to access your profile, publish faster, and keep your blog identity synced.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[1.4rem] border border-copper/10 bg-[linear-gradient(180deg,#fffdfb_0%,#f7ede4_100%)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-copper/20" />
            <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Secure
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full bg-ink/8" />
            <div className="h-2.5 w-10/12 rounded-full bg-ink/8" />
          </div>
        </div>
        <Button
          className="h-12 w-full rounded-2xl bg-copper text-white hover:bg-copper-dark"
          disabled={loading}
          onClick={onGoogleLogin}
          size="lg"
        >
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to Google...
            </>
          ) : (
            <>
              <Chrome className="mr-2 h-4 w-4" />
              Login with Google
            </>
          )}
        </Button>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
