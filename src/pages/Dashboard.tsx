import { useSocketContext } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const eventConfig: Record<
  string,
  { icon: typeof CheckCircle2; color: string; label: string }
> = {
  "transaction:created": {
    icon: CheckCircle2,
    color: "text-accent",
    label: "Created",
  },
  "balance:updated": {
    icon: ArrowUpCircle,
    color: "text-primary",
    label: "Balance Updated",
  },
  "transaction:failed": {
    icon: XCircle,
    color: "text-destructive",
    label: "Failed",
  },
};

export default function Dashboard() {
  const { connected, events } = useSocketContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time overview of your banking system
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-accent" /> Deposits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the Transactions page to deposit funds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-destructive" /> Withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Withdraw funds with concurrency protection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-primary" /> Transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Transfer between accounts safely
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Real-Time Activity
            {connected ? (
              <Badge
                variant="outline"
                className="text-accent border-accent/30 text-[10px]"
              >
                LIVE
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground text-[10px]"
              >
                OFFLINE
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Socket.IO events from your backend</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-3 opacity-40" />
              <p className="text-sm">
                No events yet. Perform a transaction to see live updates.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {events.map((evt) => {
                const config =
                  eventConfig[evt.event] || eventConfig["transaction:created"];
                const Icon = config.icon;
                return (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 rounded-lg border p-3 text-sm"
                  >
                    <Icon
                      className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.label}</span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-mono"
                        >
                          {evt.event}
                        </Badge>
                      </div>
                      <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap break-all">
                        {JSON.stringify(evt.data, null, 2)}
                      </pre>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDistanceToNow(evt.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
