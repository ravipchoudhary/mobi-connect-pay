import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Smartphone,
  Receipt,
  Fingerprint,
  Send,
  Wallet,
  Landmark,
  BadgePercent,
  BarChart3,
  ShieldCheck,
  Users,
  LifeBuoy,
  Bell,
  Settings,
  Banknote,
  ScrollText,
  Activity,
  KeyRound,
  UserCog,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-session";

const groups: {
  label: string;
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
}[] = [
  { label: "Overview", items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "Services",
    items: [
      { title: "Recharge", url: "/recharge", icon: Smartphone },
      { title: "BBPS", url: "/bbps", icon: Receipt },
      { title: "AEPS", url: "/aeps", icon: Fingerprint },
      { title: "DMT", url: "/dmt", icon: Send },
      { title: "DMT 2", url: "/dmt2", icon: Banknote },
    ],
  },
  {
    label: "Money",
    items: [
      { title: "Wallet", url: "/wallet", icon: Wallet },
      { title: "Credit Retailer", url: "/credit-retailer", icon: Banknote },
      { title: "Settlement", url: "/settlement", icon: Landmark },
      { title: "Commission", url: "/commission", icon: BadgePercent },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Audit Logs", url: "/audit-logs", icon: ScrollText },
      { title: "Activity", url: "/activity", icon: Activity },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "KYC", url: "/kyc", icon: ShieldCheck },
      { title: "Users", url: "/users", icon: Users },
      { title: "Roles", url: "/roles", icon: UserCog },
      { title: "API Management", url: "/api-management", icon: KeyRound },
      { title: "Support Tickets", url: "/support", icon: LifeBuoy },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { profile } = useSession();
  const name = profile?.full_name || "User";
  const initial = name[0]?.toUpperCase() ?? "U";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Pay Solution</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Business Suite</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-1">
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">{initial}</div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">+91 {profile?.mobile}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
