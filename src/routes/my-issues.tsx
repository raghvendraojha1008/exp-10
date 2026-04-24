import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, type IssueStatus } from "@/components/StatusBadge";
import { CategoryIcon, categoryLabel, type IssueCategory } from "@/components/CategoryIcon";
import { FilePlus2, MapPin, Calendar, Inbox } from "lucide-react";

export const Route = createFileRoute("/my-issues")({
  component: MyIssuesPage,
});

interface IssueRow {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  image_url: string | null;
  location_text: string | null;
  assigned_department: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

function MyIssuesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchIssues = useCallback(async (uid: string) => {
    setFetching(true);
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("reporter_id", uid)
      .order("created_at", { ascending: false });
    if (!error && data) setIssues(data as IssueRow[]);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
    if (user) fetchIssues(user.id);
  }, [user, loading, navigate, fetchIssues]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold">My reports</h1>
          <p className="mt-2 text-muted-foreground">{issues.length} issue{issues.length !== 1 && "s"} submitted</p>
        </div>
        <Button asChild className="bg-hero text-primary-foreground shadow-elegant hover:opacity-90">
          <Link to="/report"><FilePlus2 /> New report</Link>
        </Button>
      </div>

      {fetching ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : issues.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">No reports yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Submit your first civic issue to get started.</p>
            <Button asChild className="mt-6 bg-hero text-primary-foreground shadow-elegant"><Link to="/report"><FilePlus2 /> Report an issue</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {issues.map((iss) => (
            <Card key={iss.id} className="shadow-card hover:shadow-elegant transition-shadow overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {iss.image_url ? (
                  <img src={iss.image_url} alt={iss.title} className="sm:w-48 h-40 sm:h-auto object-cover" />
                ) : (
                  <div className="sm:w-48 h-40 sm:h-auto bg-mesh flex items-center justify-center">
                    <CategoryIcon category={iss.category} className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CategoryIcon category={iss.category} className="h-3.5 w-3.5" />
                        {categoryLabel(iss.category)}
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{iss.title}</h3>
                    </div>
                    <StatusBadge status={iss.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{iss.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {iss.location_text && (
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {iss.location_text}</span>
                    )}
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(iss.created_at).toLocaleDateString()}</span>
                    {iss.assigned_department && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">→ {iss.assigned_department}</span>
                    )}
                  </div>
                  {iss.admin_notes && (
                    <div className="mt-3 rounded-lg bg-info/10 border border-info/30 p-3 text-xs">
                      <span className="font-semibold">Admin note: </span>{iss.admin_notes}
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
