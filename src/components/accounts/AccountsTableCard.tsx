import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Account, AccountsPagination } from "@/lib/api";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";

type AccountsTableCardProps = {
  accounts: Account[];
  pagination: AccountsPagination;
  onOpenAccount: (accountId: string) => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function AccountsTableCard({
  accounts,
  pagination,
  onOpenAccount,
  onEdit,
  onDelete,
  onPreviousPage,
  onNextPage,
}: AccountsTableCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Account ID</TableHead>
              <TableHead>Holder Name</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow
                key={account.account_id}
                className="cursor-pointer"
                onClick={() => onOpenAccount(account.account_id)}
              >
                <TableCell className="text-muted-foreground">
                  {account.id ?? "-"}
                </TableCell>
                <TableCell className="font-mono font-medium">
                  {account.account_id}
                </TableCell>
                <TableCell>{account.holder_name}</TableCell>
                <TableCell className="text-right font-mono">
                  ৳
                  {parseFloat(account.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(account);
                      }}
                      aria-label={`Edit ${account.account_id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(account);
                      }}
                      aria-label={`Delete ${account.account_id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} | Total{" "}
            {pagination.total} accounts
          </p>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPreviousPage();
                  }}
                  className={
                    pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNextPage();
                  }}
                  className={
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
