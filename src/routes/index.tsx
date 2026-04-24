import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MapPin, FilePlus2, ShieldCheck, Activity, Users, ArrowRight } from "lucide-react";
import { CATEGORIES, CategoryIcon, categoryLabel } from "@/components/CategoryIcon";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live civic reporting platform
              </div>
              <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Your city, <span className="bg-hero bg-clip-text text-transparent">heard</span>.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Spot a pothole, broken streetlight, or burst pipe? Report it in seconds, drop a pin, and watch
                it move from <span className="font-semibold text-foreground">Pending → Resolved</span> with full transparency.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-hero text-primary-foreground hover:opacity-90 shadow-elegant hover:shadow-glow transition-shadow">
                  <Link to="/report"><FilePlus2 /> Report an issue</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/map"><MapPin /> Explore the map</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-8 text-sm">
                <div>
                  <div className="font-display text-2xl font-bold">5-step</div>
                  <div className="text-muted-foreground">verification flow</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="font-display text-2xl font-bold">7</div>
                  <div className="text-muted-foreground">issue categories</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="font-display text-2xl font-bold">100%</div>
                  <div className="text-muted-foreground">public tracking</div>
                </div>
              </div>
            </div>

            {/* Visual card stack */}
            <div className="relative h-[480px] hidden lg:block">
              <div className="absolute inset-0 bg-hero rounded-3xl shadow-glow opacity-90" />
              <div className="absolute inset-6 rounded-2xl bg-card shadow-elegant p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                      <CategoryIcon category="road" className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Pothole on 5th Ave</div>
                      <div className="text-xs text-muted-foreground">Downtown · Reported 2h ago</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">In Progress</span>
                </div>
                <div className="mt-4 aspect-video rounded-xl bg-mesh border border-border" />
                <div className="mt-4 space-y-2 text-sm">
                  {[
                    { l: "Pending", c: "bg-warning" },
                    { l: "Verified", c: "bg-info" },
                    { l: "In Progress", c: "bg-primary" },
                    { l: "Resolved", c: "bg-muted" },
                  ].map((s) => (
                    <div key={s.l} className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${s.c}`} />
                      <span className="text-muted-foreground">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card shadow-card border border-border p-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                <div>
                  <div className="text-xs font-semibold">Verified by Admin</div>
                  <div className="text-[11px] text-muted-foreground">Roads Dept assigned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-bold">How it works</h2>
          <p className="mt-3 text-muted-foreground">From snapshot to solution — transparent at every step.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: FilePlus2, title: "1. Report", desc: "Snap a photo, pin the location, pick a category. Done in 30 seconds." },
            { icon: ShieldCheck, title: "2. Verify", desc: "Admins review and route your report to the right department." },
            { icon: Activity, title: "3. Track", desc: "Watch live status updates until your issue is resolved." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-hero flex items-center justify-center shadow-elegant">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold">Report any civic issue</h2>
              <p className="mt-2 text-muted-foreground">Seven categories cover the most common urban problems.</p>
            </div>
            <Button asChild variant="ghost"><Link to="/report">Start reporting <ArrowRight /></Link></Button>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((c) => (
              <div key={c} className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-card transition-all">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                  <CategoryIcon category={c} className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-xs font-medium">{categoryLabel(c)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-hero shadow-glow p-10 lg:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative">
            <Users className="h-12 w-12 mx-auto opacity-90" />
            <h2 className="mt-4 font-display text-4xl font-bold">Be the change in your neighborhood</h2>
            <p className="mt-3 max-w-xl mx-auto opacity-90">Join thousands of citizens making cities better, one report at a time.</p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to="/auth">Create free account <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
