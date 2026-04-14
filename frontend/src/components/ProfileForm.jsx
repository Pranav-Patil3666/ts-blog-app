import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  name: "",
  bio: "",
  instagram: "",
  facebook: "",
  linkedn: "",
};

export function ProfileForm({ user, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        instagram: user.instagram || "",
        facebook: user.facebook || "",
        linkedn: user.linkedn || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>
          Update your public identity, bio, and social handles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedn">LinkedIn</Label>
              <Input
                id="linkedn"
                name="linkedn"
                value={formData.linkedn}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell people a little about yourself"
            />
          </div>

          <Button className="w-full sm:w-auto" disabled={loading} type="submit">
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving changes..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
