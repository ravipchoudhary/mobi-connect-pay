import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ModulePagePlaceholderProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  accent?: string;
}

export function ModulePagePlaceholder({
  title,
  subtitle,
  icon: Icon,
  features,
  accent = "chart-1",
}: ModulePagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Module
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="secondary" className="rounded-full">Coming soon</Badge>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="relative overflow-hidden p-8 shadow-elegant sm:p-12">
          <div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: `var(--${accent})` }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-5">
              <div className="grid h-14 w-14 place-items-center rounded-2xl text-white shadow-glow" style={{ background: `var(--${accent})` }}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold sm:text-2xl">This module is being crafted with care.</h2>
              <p className="max-w-lg text-sm text-muted-foreground">
                We're finalising the workflow, receipts, reports, and API integrations for {title}. In the next iteration you'll be able to transact end-to-end from this page.
              </p>
              <div className="flex gap-3">
                <Button variant="hero" size="lg">
                  Request early access <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">View docs</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Planned features</div>
              <ul className="mt-4 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">✓</span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
