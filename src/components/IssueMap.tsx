import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { StatusBadge, type IssueStatus } from "@/components/StatusBadge";
import { categoryLabel, type IssueCategory } from "@/components/CategoryIcon";

export interface MapIssue {
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

function makeIcon(status: IssueStatus) {
  const color = colorByStatus[status];
  return L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function IssueMap({ issues }: { issues: MapIssue[] }) {
  const center: [number, number] =
    issues.length > 0
      ? [
          issues.reduce((s, i) => s + i.latitude, 0) / issues.length,
          issues.reduce((s, i) => s + i.longitude, 0) / issues.length,
        ]
      : [40.7128, -74.006];

  return (
    <MapContainer center={center} zoom={issues.length > 0 ? 13 : 11} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((iss) => (
        <Marker key={iss.id} position={[iss.latitude, iss.longitude]} icon={makeIcon(iss.status)}>
          <Popup>
            <div className="space-y-2 min-w-[180px]">
              {iss.image_url && <img src={iss.image_url} alt="" className="w-full h-24 object-cover rounded" />}
              <div className="font-semibold text-sm">{iss.title}</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{categoryLabel(iss.category)}</span>
                <StatusBadge status={iss.status} />
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export { colorByStatus };
