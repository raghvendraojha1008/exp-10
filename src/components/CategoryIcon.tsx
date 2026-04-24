import { Construction, Droplets, Zap, Trash2, Lightbulb, Waves, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IssueCategory = "road" | "water" | "electricity" | "sanitation" | "streetlight" | "drainage" | "other";

const map: Record<IssueCategory, { icon: LucideIcon; label: string }> = {
  road: { icon: Construction, label: "Road" },
  water: { icon: Droplets, label: "Water" },
  electricity: { icon: Zap, label: "Electricity" },
  sanitation: { icon: Trash2, label: "Sanitation" },
  streetlight: { icon: Lightbulb, label: "Streetlight" },
  drainage: { icon: Waves, label: "Drainage" },
  other: { icon: AlertCircle, label: "Other" },
};

export function categoryLabel(c: IssueCategory) { return map[c].label; }

export function CategoryIcon({ category, className }: { category: IssueCategory; className?: string }) {
  const Icon = map[category].icon;
  return <Icon className={className} />;
}

export const CATEGORIES: IssueCategory[] = ["road", "water", "electricity", "sanitation", "streetlight", "drainage", "other"];
