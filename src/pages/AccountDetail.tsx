import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RefreshCw, User, Hash, Landmark } from "lucide-react";

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: account, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["account", id],
    queryFn: () => api.getAccount(id!),
    enabled: !!id,
    retry: false,
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/accounts")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Details</h1>
          <p className="text-muted-foreground text-sm">{id}</p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-40" />
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              {(error as { error?: string })?.error || "Account not found"}
            </p>
          </CardContent>
        </Card>
      ) : account ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {account.holder_name}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Account ID</p>
                  <p className="font-mono font-semibold">{account.account_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Holder</p>
                  <p className="font-semibold">{account.holder_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Landmark className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-mono text-lg font-bold">
                    ৳{parseFloat(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
