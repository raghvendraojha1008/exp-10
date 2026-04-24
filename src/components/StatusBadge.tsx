import { cn } from "@/lib/utils";

export type IssueStatus = "pending" | "verified" | "in_progress" | "resolved" | "rejected";

const styles: Record<IssueStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  verified: "bg-info/15 text-info-foreground border-info/40",
  in_progress: "bg-primary/15 text-primary border-primary/40",
  resolved: "bg-success/15 text-success-foreground border-success/40",
  rejected: "bg-destructive/15 text-destructive border-destructive/40",
};

const labels: Record<IssueStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export function StatusBadge({ status, className }: { status: IssueStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
