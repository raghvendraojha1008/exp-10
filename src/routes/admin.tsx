import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge, type IssueStatus } from "@/components/StatusBadge";
import { CategoryIcon, categoryLabel, type IssueCategory } from "@/components/CategoryIcon";
import { toast } from "sonner";
import { ShieldAlert, MapPin, Calendar, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

interface IssueRow {
  id: string;
  reporter_id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  image_url: string | null;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  assigned_department: string | null;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES: IssueStatus[] = ["pending", "verified", "in_progress", "resolved", "rejected"];
const DEPARTMENTS = ["Roads & Transport", "Water Supply", "Electricity Board", "Sanitation", "Public Lighting", "Drainage", "General Services"];

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState<IssueStatus | "all">("pending");
  const [editing, setEditing] = useState<IssueRow | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchIssues = useCallback(async () => {
    setFetching(true);
    let q = supabase.from("issues").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    if (data) setIssues(data as IssueRow[]);
    setFetching(false);
  }, [filter]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    if (!isAdmin) { toast.error("Admin access required"); navigate({ to: "/" }); return; }
    fetchIssues();
  }, [user, isAdmin, loading, navigate, fetchIssues]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const status = fd.get("status") as IssueStatus;
    const assigned_department = (fd.get("department") as string) || null;
    const admin_notes = ((fd.get("notes") as string) ?? "").trim() || null;

    setSaving(true);
    const { error } = await supabase
      .from("issues")
      .update({ status, assigned_department, admin_notes })
      .eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Issue updated");
      setEditing(null);
      fetchIssues();
    }
  };

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5" /> Admin Console
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold">Issue management</h1>
          <p className="mt-1 text-muted-foreground">Verify reports, assign departments, update statuses.</p>
        </div>
        <div className="w-full sm:w-56">
          <Label className="text-xs">Filter by status</Label>
          <Select value={filter} onValueChange={(v) => setFilter(v as IssueStatus | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {fetching ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : issues.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-16 text-center text-muted-foreground">No issues match this filter.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {issues.map((iss) => (
            <Card key={iss.id} className="shadow-card overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {iss.image_url ? (
                  <img src={iss.image_url} alt="" className="md:w-48 h-40 md:h-auto object-cover" />
                ) : (
                  <div className="md:w-48 h-40 md:h-auto bg-mesh flex items-center justify-center">
                    <CategoryIcon category={iss.category} className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CategoryIcon category={iss.category} className="h-3.5 w-3.5" />
                        {categoryLabel(iss.category)}
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold">{iss.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{iss.description}</p>
                    </div>
                    <StatusBadge status={iss.status} />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {iss.location_text && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {iss.location_text}</span>}
                    {iss.latitude && <span className="font-mono">{iss.latitude.toFixed(4)}, {iss.longitude?.toFixed(4)}</span>}
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(iss.created_at).toLocaleString()}</span>
                    {iss.assigned_department && <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">→ {iss.assigned_department}</span>}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={() => setEditing(iss)} className="bg-hero text-primary-foreground shadow-elegant">Manage</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Manage issue</DialogTitle>
            <DialogDescription>{editing?.title}</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={editing.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign department</Label>
                <Select name="department" defaultValue={editing.assigned_department ?? ""}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Admin note (visible to reporter)</Label>
                <Textarea id="notes" name="notes" rows={3} maxLength={500} defaultValue={editing.admin_notes ?? ""} />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-hero text-primary-foreground shadow-elegant">
                  {saving ? <><Loader2 className="animate-spin" /> Saving...</> : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

