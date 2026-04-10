import { LayoutDashboard, Users, ArrowLeftRight, Building2 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Accounts", url: "/accounts", icon: Users },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          "border-b border-sidebar-border py-5",
          collapsed ? "items-center px-1.5" : "px-4",
        )}
      >
        <div className={cn("flex w-full items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white shadow-[0_10px_30px_-12px_rgba(20,184,166,0.85)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_55%)]" />
            <Building2 className="relative z-10 h-5 w-5" />
            <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold tracking-tight text-sidebar-primary-foreground font-['Space_Grotesk']">
                TakaLedger
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Real-Time Banking</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
