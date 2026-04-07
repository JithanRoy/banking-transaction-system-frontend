import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function DepositForm() {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ balance: number } | null>(null);
  const qc = useQueryClient();

  const submit = async () => {
    if (!accountId.trim() || !amount.trim() || parseFloat(amount) <= 0) {
      toast.error("Valid account ID and positive amount required");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.deposit(accountId.trim(), parseFloat(amount));
      setResult({ balance: res.balance! });
      toast.success(`Deposited $${parseFloat(amount).toFixed(2)} successfully`);
      qc.invalidateQueries({ queryKey: ["account"] });
    } catch (err) {
      toast.error((err as ApiError).error || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Account ID</Label>
        <Input placeholder="e.g. ACC1001" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input type="number" min="0.01" step="0.01" placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <Button onClick={submit} disabled={loading} className="w-full">
        {loading ? "Processing..." : "Deposit"}
      </Button>
      {result && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span>New balance: <strong className="font-mono">${result.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
        </div>
      )}
    </div>
  );
}

function WithdrawForm() {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ balance: number } | null>(null);
  const qc = useQueryClient();

  const submit = async () => {
    if (!accountId.trim() || !amount.trim() || parseFloat(amount) <= 0) {
      toast.error("Valid account ID and positive amount required");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.withdraw(accountId.trim(), parseFloat(amount));
      setResult({ balance: res.balance! });
      toast.success(`Withdrew $${parseFloat(amount).toFixed(2)} successfully`);
      qc.invalidateQueries({ queryKey: ["account"] });
    } catch (err) {
      toast.error((err as ApiError).error || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Account ID</Label>
        <Input placeholder="e.g. ACC1001" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input type="number" min="0.01" step="0.01" placeholder="e.g. 250" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <Button onClick={submit} disabled={loading} variant="destructive" className="w-full">
        {loading ? "Processing..." : "Withdraw"}
      </Button>
      {result && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span>New balance: <strong className="font-mono">${result.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
        </div>
      )}
    </div>
  );
}

function TransferForm() {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ from: number; to: number } | null>(null);
  const qc = useQueryClient();

  const submit = async () => {
    if (!fromId.trim() || !toId.trim() || !amount.trim() || parseFloat(amount) <= 0) {
      toast.error("All fields required with a positive amount");
      return;
    }
    if (fromId.trim() === toId.trim()) {
      toast.error("Source and destination must differ");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.transfer(fromId.trim(), toId.trim(), parseFloat(amount));
      setResult({ from: res.fromAccount.balance, to: res.toAccount.balance });
      toast.success(`Transferred $${parseFloat(amount).toFixed(2)} successfully`);
      qc.invalidateQueries({ queryKey: ["account"] });
    } catch (err) {
      toast.error((err as ApiError).error || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>From Account</Label>
        <Input placeholder="e.g. ACC1001" value={fromId} onChange={(e) => setFromId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>To Account</Label>
        <Input placeholder="e.g. ACC1002" value={toId} onChange={(e) => setToId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input type="number" min="0.01" step="0.01" placeholder="e.g. 100" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <Button onClick={submit} disabled={loading} className="w-full">
        {loading ? "Processing..." : "Transfer"}
      </Button>
      {result && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>From balance: <strong className="font-mono">${result.from.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
          </div>
          <div className="flex items-center gap-2 pl-6">
            <span>To balance: <strong className="font-mono">${result.to.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Transactions() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Deposit, withdraw, or transfer funds
        </p>
      </div>

      <Tabs defaultValue="deposit">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit" className="gap-1.5">
            <ArrowDownCircle className="h-3.5 w-3.5" /> Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="gap-1.5">
            <ArrowUpCircle className="h-3.5 w-3.5" /> Withdraw
          </TabsTrigger>
          <TabsTrigger value="transfer" className="gap-1.5">
            <ArrowLeftRight className="h-3.5 w-3.5" /> Transfer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deposit Funds</CardTitle>
              <CardDescription>Add money to an existing account</CardDescription>
            </CardHeader>
            <CardContent><DepositForm /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Withdraw Funds</CardTitle>
              <CardDescription>Withdraw money from an account</CardDescription>
            </CardHeader>
            <CardContent><WithdrawForm /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transfer Funds</CardTitle>
              <CardDescription>Move money between two accounts</CardDescription>
            </CardHeader>
            <CardContent><TransferForm /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
