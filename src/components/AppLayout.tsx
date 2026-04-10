import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useSocket, SocketEvent } from "@/hooks/use-socket";
import { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";
import type { Account } from "@/lib/api";

interface SocketContextType {
  connected: boolean;
  events: SocketEvent[];
}

const SocketContext = createContext<SocketContextType>({ connected: false, events: [] });
export const useSocketContext = () => useContext(SocketContext);

function normalizeAccountId(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim().toUpperCase() : null;
}

function normalizeBalance(value: unknown): string | null {
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

export default function AppLayout() {
  const { connected, events } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (events.length === 0) return;
    const latest = events[0];
    const accountId = normalizeAccountId(latest.data.accountId);
    const balance = normalizeBalance(latest.data.balance);

    const updateAccountCache = () => {
      if (!accountId || balance === null) return;

      queryClient.setQueryData<Account[]>(["accounts"], (current) =>
        current?.map((account) =>
          account.account_id === accountId ? { ...account, balance } : account,
        ) ?? current,
      );

      queryClient.setQueryData<Account | undefined>(["account", accountId], (current) =>
        current ? { ...current, balance } : current,
      );
    };

    if (latest.event === "transaction:created") {
      updateAccountCache();
      toast.success("Transaction completed", {
        description: `${(latest.data.type as string) || "Transaction"} of ৳${latest.data.amount} on ${latest.data.accountId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
    } else if (latest.event === "balance:updated") {
      updateAccountCache();
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
    } else if (latest.event === "transaction:failed") {
      toast.error("Transaction failed", {
        description: latest.data.error as string,
      });
    }
  }, [events, queryClient]);

  return (
    <SocketContext.Provider value={{ connected, events }}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
              <SidebarTrigger className="ml-0" />
              <div className="flex items-center gap-2 text-xs">
                {connected ? (
                  <span className="flex items-center gap-1.5 text-accent">
                    <Wifi className="h-3.5 w-3.5" /> Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <WifiOff className="h-3.5 w-3.5" /> Offline
                  </span>
                )}
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SocketContext.Provider>
  );
}
