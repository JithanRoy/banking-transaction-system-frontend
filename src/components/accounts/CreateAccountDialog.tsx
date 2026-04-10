import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

type CreateAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newId: string;
  newName: string;
  newBalance: string;
  setNewId: (value: string) => void;
  setNewName: (value: string) => void;
  setNewBalance: (value: string) => void;
  creating: boolean;
  onCreate: () => Promise<void>;
};

export function CreateAccountDialog({
  open,
  onOpenChange,
  newId,
  newName,
  newBalance,
  setNewId,
  setNewName,
  setNewBalance,
  creating,
  onCreate,
}: CreateAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5 h-4 w-4" /> Create Account
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
          <Button onClick={() => void onCreate()} disabled={creating}>
            {creating ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
