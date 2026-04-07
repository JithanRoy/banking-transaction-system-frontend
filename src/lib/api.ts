const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface Account {
  account_id: string;
  holder_name: string;
  balance: string;
  version: number;
}

export interface TransactionResult {
  success: boolean;
  type?: string;
  accountId?: string;
  amount?: number;
  balance?: number;
}

export interface TransferResult {
  success: boolean;
  fromAccount: { accountId: string; balance: number };
  toAccount: { accountId: string; balance: number };
}

export interface ApiError {
  error: string;
  code: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      error: "Network error",
      code: "NETWORK_ERROR",
    }));
    throw err;
  }
  return res.json();
}

export const api = {
  createAccount: (data: { accountId: string; holderName: string; balance: number }) =>
    request<{ message: string }>("/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAccount: (id: string) => request<Account>(`/accounts/${id}`),

  deposit: (accountId: string, amount: number) =>
    request<TransactionResult>("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify({ accountId, amount }),
    }),

  withdraw: (accountId: string, amount: number) =>
    request<TransactionResult>("/transactions/withdraw", {
      method: "POST",
      body: JSON.stringify({ accountId, amount }),
    }),

  transfer: (fromAccountId: string, toAccountId: string, amount: number) =>
    request<TransferResult>("/transactions/transfer", {
      method: "POST",
      body: JSON.stringify({ fromAccountId, toAccountId, amount }),
    }),
};
