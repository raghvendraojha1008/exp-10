import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, categoryLabel, type IssueCategory } from "@/components/CategoryIcon";
import { toast } from "sonner";
import { MapPin, Camera, Loader2, Crosshair } from "lucide-react";

export const Route = createFileRoute("/report")({
  component: ReportPage,
});

const schema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
  description: z.string().trim().min(10, "Describe the issue (min 10 chars)").max(2000),
  category: z.enum(["road", "water", "electricity", "sanitation", "streetlight", "drainage", "other"]),
  location_text: z.string().trim().max(200).optional().or(z.literal("")),
});

function ReportPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<IssueCategory>("road");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("Location captured");
      },
      (err) => {
        setLocating(false);
        toast.error("Couldn't get location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      title: fd.get("title"),
      description: fd.get("description"),
      category,
      location_text: fd.get("location_text") ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      let image_url: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("issue-images").upload(path, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("issue-images").getPublicUrl(path);
        image_url = pub.publicUrl;
      }

      const { error: insErr } = await supabase.from("issues").insert({
        reporter_id: user.id,
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        location_text: parsed.data.location_text || null,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        image_url,
      });
      if (insErr) throw insErr;

      toast.success("Issue submitted! It's now pending verification.");
      navigate({ to: "/my-issues" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold">Report an issue</h1>
        <p className="mt-2 text-muted-foreground">Help us help your community. Submissions are verified before action.</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>New report</CardTitle>
          <CardDescription>All fields except image and exact location are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g. Large pothole near 5th Ave & Main" required maxLength={120} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as IssueCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{categoryLabel(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_text">Location description (optional)</Label>
                <Input id="location_text" name="location_text" placeholder="Nearest landmark, street name…" maxLength={200} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={5} required maxLength={2000} placeholder="Describe what's wrong, when you noticed it, and any safety concerns." />
            </div>

            <div className="space-y-2">
              <Label>Photo (optional, max 5MB)</Label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/60 transition-colors p-6 text-center">
                  <Camera className="h-6 w-6 mx-auto text-muted-foreground" />
                  <div className="mt-2 text-sm font-medium">{imageFile ? imageFile.name : "Click to upload"}</div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="preview" className="h-24 w-24 object-cover rounded-xl border border-border" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pin location</Label>
              <div className="flex items-center gap-3 flex-wrap">
                <Button type="button" variant="outline" onClick={detectLocation} disabled={locating}>
                  {locating ? <Loader2 className="animate-spin" /> : <Crosshair />}
                  {locating ? "Locating..." : "Use my current location"}
                </Button>
                {coords && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-success" />
                    {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" asChild><Link to="/my-issues">Cancel</Link></Button>
              <Button type="submit" disabled={submitting} className="bg-hero text-primary-foreground shadow-elegant hover:opacity-90">
                {submitting ? <><Loader2 className="animate-spin" /> Submitting...</> : "Submit report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
