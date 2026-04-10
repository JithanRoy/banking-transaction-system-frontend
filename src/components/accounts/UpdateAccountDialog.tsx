import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UpdateAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId?: string;
  name: string;
  balance: string;
  setName: (value: string) => void;
  setBalance: (value: string) => void;
  updating: boolean;
  onUpdate: () => Promise<void>;
};

export function UpdateAccountDialog({
  open,
  onOpenChange,
  accountId,
  name,
  balance,
  setName,
  setBalance,
  updating,
  onUpdate,
}: UpdateAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Account</DialogTitle>
          <DialogDescription>
            Update holder name and/or balance for {accountId}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-acc-name">Holder Name</Label>
            <Input
              id="edit-acc-name"
              placeholder="e.g. Updated User"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-acc-balance">Balance</Label>
            <Input
              id="edit-acc-balance"
              type="number"
              min="0"
              placeholder="e.g. 1500"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => void onUpdate()} disabled={updating}>
            {updating ? "Updating..." : "Update Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
