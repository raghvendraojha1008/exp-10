import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, Shield, FilePlus2, LayoutDashboard, Megaphone } from "lucide-react";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero shadow-elegant group-hover:shadow-glow transition-shadow">
            <Megaphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">CivicVoice</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/map"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "px-3 py-2 text-sm font-medium text-foreground" }}
          >
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Map</span>
          </Link>
          {user && (
            <>
              <Link
                to="/report"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-medium text-foreground" }}
              >
                <span className="inline-flex items-center gap-1.5"><FilePlus2 className="h-4 w-4" /> Report</span>
              </Link>
              <Link
                to="/my-issues"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-medium text-foreground" }}
              >
                My Issues
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  activeProps={{ className: "px-3 py-2 text-sm font-medium text-foreground" }}
                >
                  <span className="inline-flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Admin</span>
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              <Shield className="h-3 w-3" /> Admin
            </span>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })}>Sign in</Button>
              <Button size="sm" className="bg-hero text-primary-foreground hover:opacity-90 shadow-elegant" onClick={() => navigate({ to: "/auth" })}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
