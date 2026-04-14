import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginWithGoogle } from "@/services/api";
import { markLoginTransition } from "@/utils/auth";

export function CallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const providerError = params.get("error");

    if (providerError) {
      setError("Google login was cancelled or denied. Please try again.");
      return;
    }

    if (!code) {
      setError("No authorization code was returned from Google.");
      return;
    }

    const exchangeCode = async () => {
      try {
        await loginWithGoogle(code);
        markLoginTransition();
        navigate("/", { replace: true });
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    exchangeCode();
  }, [location.search, navigate]);

  return (
    <PageShell className="flex items-center justify-center bg-vanilla">
      <Card className="w-full max-w-lg rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(43,43,43,0.1)]">
        <CardHeader>
          <CardTitle className="text-3xl font-black tracking-tight text-ink">Signing you in</CardTitle>
          <CardDescription className="text-ink/65">
            We&apos;re exchanging your Google authorization with the backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl bg-vanilla px-4 py-4 text-sm font-medium text-copper">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Waiting for a secure session...
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
