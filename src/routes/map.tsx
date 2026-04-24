import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type IssueStatus } from "@/components/StatusBadge";
import { type IssueCategory } from "@/components/CategoryIcon";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

interface MapIssue {
  id: string;
  title: string;
  category: IssueCategory;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  image_url: string | null;
}

const colorByStatus: Record<IssueStatus, string> = {
  pending: "#eab308",
  verified: "#06b6d4",
  in_progress: "#3b82f6",
  resolved: "#22c55e",
  rejected: "#ef4444",
};

const IssueMap = lazy(() => import("@/components/IssueMap"));

function MapPage() {
  const [issues, setIssues] = useState<MapIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const { data } = await supabase
        .from("issues")
        .select("id,title,category,status,latitude,longitude,image_url")
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      if (data) setIssues(data as MapIssue[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Live issue map</h1>
          <p className="mt-2 text-muted-foreground">{loading ? "Loading..." : `${issues.length} pinned issue${issues.length !== 1 ? "s" : ""}`}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {(Object.keys(colorByStatus) as IssueStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-white" style={{ background: colorByStatus[s] }} />
              <span className="capitalize">{s.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[70vh] rounded-2xl overflow-hidden border border-border shadow-elegant bg-mesh">
        {mounted ? (
          <Suspense fallback={<div className="h-full flex items-center justify-center text-muted-foreground">Loading map…</div>}>
            <IssueMap issues={issues} />
          </Suspense>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Loading map…</div>
        )}
      </div>
    </div>
  );
}
