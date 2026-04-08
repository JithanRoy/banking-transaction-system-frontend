import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api, Account, ApiError } from "@/lib/api";
import { Plus, Search, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Accounts() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchedAccount, setSearchedAccount] = useState<Account | null>(null);

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isError: accountsError,
    refetch: refetchAccounts,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: api.listAccounts,
  });

  const visibleAccounts = searchedAccount
    ? [
        searchedAccount,
        ...accounts.filter((account) => account.account_id !== searchedAccount.account_id),
      ]
    : accounts;

  const searchAccount = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    try {
      const acc = await api.getAccount(searchId.trim());
      setSearchedAccount(acc);
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.error || "Account not found");
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    if (!newId.trim() || !newName.trim() || !newBalance.trim()) {
      toast.error("All fields are required");
      return;
    }
    setCreating(true);
    try {
      await api.createAccount({
        accountId: newId.trim(),
        holderName: newName.trim(),
        balance: parseFloat(newBalance),
      });
      toast.success("Account created successfully");
      setDialogOpen(false);
      setNewId("");
      setNewName("");
      setNewBalance("");
      setSearchedAccount(null);
      await refetchAccounts();
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.error || "Failed to create account");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage banking accounts
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1.5" /> Create Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new banking account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="acc-id">Account ID</Label>
                <Input
                  id="acc-id"
                  placeholder="e.g. ACC1001"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-name">Holder Name</Label>
                <Input
                  id="acc-name"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-balance">Initial Balance</Label>
                <Input
                  id="acc-balance"
                  type="number"
                  min="0"
                  placeholder="e.g. 1000"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createAccount} disabled={creating}>
                {creating ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Available Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Account ID (e.g. ACC1001)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchAccount()}
            />
            <Button onClick={searchAccount} disabled={loading} variant="secondary">
              <Search className="h-4 w-4 mr-1.5" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {accountsLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Loading accounts...</p>
          </CardContent>
        </Card>
      ) : accountsError ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load accounts.</p>
          </CardContent>
        </Card>
      ) : visibleAccounts.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Holder Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleAccounts.map((acc) => (
                  <TableRow
                    key={acc.account_id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/accounts/${acc.account_id}`)}
                  >
                    <TableCell className="font-mono font-medium">{acc.account_id}</TableCell>
                    <TableCell>{acc.holder_name}</TableCell>
                    <TableCell className="text-right font-mono">
                      ৳{parseFloat(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">No accounts available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
