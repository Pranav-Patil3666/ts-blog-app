import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageUploadCard({ user, onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.image || "");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(user?.image || "");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile image</CardTitle>
        <CardDescription>
          Upload a new image and see the preview before saving it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4 rounded-3xl bg-vanilla/70 p-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] bg-white shadow-sm">
            {preview ? (
              <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-copper/50" />
            )}
          </div>
          <div className="text-sm text-ink/70">
            Pick a JPG or PNG file, then upload it to your user profile.
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="profile-image">Choose image</Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <Button className="w-full sm:w-auto" disabled={loading || !file} type="submit">
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Uploading..." : "Upload image"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
