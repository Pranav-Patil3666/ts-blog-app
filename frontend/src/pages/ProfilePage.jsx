import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LogOut } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ImageUploadCard } from "@/components/ImageUploadCard";
import { PageShell } from "@/components/PageShell";
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileSummaryCard } from "@/components/ProfileSummaryCard";
import { getCurrentUser, updateUserProfile, uploadProfileImage } from "@/services/api";
import { clearAuthSession } from "@/utils/auth";

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSave = async (formData) => {
    setSavingProfile(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateUserProfile(formData);
      setUser((current) => ({ ...current, ...response.user }));
      setSuccess(response.message || "Profile updated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    setError("");
    setSuccess("");

    try {
      const response = await uploadProfileImage(file);
      setUser((current) => ({ ...current, ...response.user }));
      setSuccess(response.message || "Profile image updated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[30px] border border-white/60 bg-white/65 p-6 shadow-lg shadow-copper/10 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-copper/80">
              User profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Manage your account</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {error ? <Alert variant="error">{error}</Alert> : null}
        {success ? <Alert>{success}</Alert> : null}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center rounded-[30px] border border-white/60 bg-white/60">
            <div className="flex items-center gap-3 text-copper">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Loading your profile...</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <ProfileSummaryCard user={user} />
            <div className="space-y-6">
              <ProfileForm user={user} onSubmit={handleProfileSave} loading={savingProfile} />
              <ImageUploadCard user={user} onUpload={handleImageUpload} loading={uploadingImage} />
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
