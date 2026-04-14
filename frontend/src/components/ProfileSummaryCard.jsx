import { Globe, Instagram, Linkedin, Mail, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const socialLinks = [
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "linkedn", label: "LinkedIn", icon: Linkedin },
];

export function ProfileSummaryCard({ user }) {
  const imageFallback = `https://ui-avatars.com/api/?background=A75F37&color=fff&name=${encodeURIComponent(
    user?.name || "User"
  )}`;

  return (
    <Card className="overflow-hidden">
      <div className="h-28 bg-[linear-gradient(135deg,#A75F37_0%,#C57D52_45%,#F2E7DD_100%)]" />
      <CardContent className="-mt-14 space-y-5">
        <img
          src={user?.image || imageFallback}
          alt={user?.name || "User"}
          className="h-28 w-28 rounded-[24px] border-4 border-white object-cover shadow-lg"
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-ink">{user?.name || "Unnamed User"}</h1>
          <div className="flex items-center gap-2 text-sm text-ink/65">
            <Mail className="h-4 w-4" />
            <span>{user?.email || "No email available"}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-vanilla/70 p-4 text-sm leading-6 text-ink/75">
          {user?.bio || "Add a bio so readers and collaborators know what you care about."}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Globe className="h-4 w-4 text-copper" />
            Social links
          </div>
          <div className="space-y-2">
            {socialLinks.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={user?.[key] || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-copper/10 bg-white/80 px-4 py-3 text-sm text-ink/75 transition hover:border-copper/25 hover:text-copper"
              >
                <Icon className="h-4 w-4" />
                <span>{user?.[key] || `No ${label} link yet`}</span>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
