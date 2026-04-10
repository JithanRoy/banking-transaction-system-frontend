import { AccountsSearchCard } from "@/components/accounts/AccountsSearchCard";
import { AccountsTableCard } from "@/components/accounts/AccountsTableCard";
import { CreateAccountDialog } from "@/components/accounts/CreateAccountDialog";
import { DeleteAccountDialog } from "@/components/accounts/DeleteAccountDialog";
import { UpdateAccountDialog } from "@/components/accounts/UpdateAccountDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Account, api, ApiError } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Accounts() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchedAccount, setSearchedAccount] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data,
    isLoading: accountsLoading,
    isError: accountsError,
    refetch: refetchAccounts,
  } = useQuery({
    queryKey: ["accounts", page, limit],
    queryFn: () => api.listAccounts(page, limit),
  });

  const accounts = data?.accounts ?? [];
  const pagination = data?.pagination ?? {
    page,
    limit,
    total: accounts.length,
    totalPages: 1,
  };

  const visibleAccounts = searchedAccount
    ? [
        searchedAccount,
        ...accounts.filter(
          (account) => account.account_id !== searchedAccount.account_id,
        ),
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
      setPage(1);
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

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setEditName(account.holder_name);
    setEditBalance(account.balance);
    setEditDialogOpen(true);
  };

  const updateAccount = async () => {
    if (!editingAccount) return;

    const nextName = editName.trim();
    const nextBalance = editBalance.trim();

    if (!nextName && !nextBalance) {
      toast.error("Provide holder name and/or balance");
      return;
    }

    if (nextBalance && Number(nextBalance) < 0) {
      toast.error("Balance must be 0 or greater");
      return;
    }

    setUpdating(true);
    try {
      await api.updateAccount(editingAccount.account_id, {
        ...(nextName ? { holderName: nextName } : {}),
        ...(nextBalance ? { balance: Number(nextBalance) } : {}),
      });
      toast.success("Account updated successfully");
      setEditDialogOpen(false);
      setEditingAccount(null);
      await refetchAccounts();
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.error || "Failed to update account");
    } finally {
      setUpdating(false);
    }
  };

  const deleteAccount = async () => {
    if (!deletingAccount) return;

    setDeleting(true);
    try {
      await api.deleteAccount(deletingAccount.account_id);
      toast.success("Account deleted successfully");
      setDeletingAccount(null);
      setSearchedAccount((current) =>
        current?.account_id === deletingAccount.account_id ? null : current,
      );
      await refetchAccounts();
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.error || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage banking accounts
          </p>
        </div>
        <CreateAccountDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          newId={newId}
          newName={newName}
          newBalance={newBalance}
          setNewId={setNewId}
          setNewName={setNewName}
          setNewBalance={setNewBalance}
          creating={creating}
          onCreate={createAccount}
        />
      </div>

      <UpdateAccountDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        accountId={editingAccount?.account_id}
        name={editName}
        balance={editBalance}
        setName={setEditName}
        setBalance={setEditBalance}
        updating={updating}
        onUpdate={updateAccount}
      />

      <AccountsSearchCard
        searchId={searchId}
        setSearchId={setSearchId}
        loading={loading}
        onSearch={searchAccount}
      />

      {accountsLoading ? (
        <Card>
          <CardContent>
            <LoadingSpinner message="Loading accounts..." size="md" />
          </CardContent>
        </Card>
      ) : accountsError ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load accounts.</p>
          </CardContent>
        </Card>
      ) : visibleAccounts.length > 0 ? (
        <AccountsTableCard
          accounts={visibleAccounts}
          pagination={pagination}
          onOpenAccount={(accountId) => navigate(`/accounts/${accountId}`)}
          onEdit={openEditDialog}
          onDelete={setDeletingAccount}
          onPreviousPage={() => {
            if (pagination.page > 1) {
              setPage((current) => Math.max(1, current - 1));
            }
          }}
          onNextPage={() => {
            if (pagination.page < pagination.totalPages) {
              setPage((current) =>
                Math.min(pagination.totalPages, current + 1),
              );
            }
          }}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              No accounts available.
            </p>
          </CardContent>
        </Card>
      )}

      <DeleteAccountDialog
        open={Boolean(deletingAccount)}
        accountId={deletingAccount?.account_id}
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeletingAccount(null);
        }}
        onConfirmDelete={deleteAccount}
      />
    </div>
  );
}
