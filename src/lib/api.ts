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

type RawAccount = {
  account_id?: string;
  accountId?: string;
  holder_name?: string;
  holderName?: string;
  balance?: string | number;
  version?: number;
};

function normalizeAccountId(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeAccount(raw: RawAccount): Account {
  return {
    account_id: normalizeAccountId(raw.account_id ?? raw.accountId ?? ""),
    holder_name: raw.holder_name ?? raw.holderName ?? "",
    balance: String(raw.balance ?? "0"),
    version: raw.version ?? 0,
  };
}

function normalizeAccountsResponse(payload: unknown): Account[] {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeAccount(item as RawAccount));
  }

  if (payload && typeof payload === "object") {
    const candidate = (payload as { accounts?: unknown; data?: unknown; results?: unknown }).accounts
      ?? (payload as { accounts?: unknown; data?: unknown; results?: unknown }).data
      ?? (payload as { accounts?: unknown; data?: unknown; results?: unknown }).results;

    if (Array.isArray(candidate)) {
      return candidate.map((item) => normalizeAccount(item as RawAccount));
    }
  }

  return [];
}

function normalizeAccountResponse(payload: unknown): Account {
  return normalizeAccount(payload as RawAccount);
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
  listAccounts: async () => normalizeAccountsResponse(await request<unknown>("/accounts")),

  createAccount: (data: { accountId: string; holderName: string; balance: number }) =>
    request<{ message: string }>("/accounts/create", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        accountId: normalizeAccountId(data.accountId),
      }),
    }),

  getAccount: async (id: string) =>
    normalizeAccountResponse(await request<unknown>(`/accounts/${normalizeAccountId(id)}`)),

  deposit: (accountId: string, amount: number) =>
    request<TransactionResult>("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify({ accountId: normalizeAccountId(accountId), amount }),
    }),

  withdraw: (accountId: string, amount: number) =>
    request<TransactionResult>("/transactions/withdraw", {
      method: "POST",
      body: JSON.stringify({ accountId: normalizeAccountId(accountId), amount }),
    }),

  transfer: (fromAccountId: string, toAccountId: string, amount: number) =>
    request<TransferResult>("/transactions/transfer", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: normalizeAccountId(fromAccountId),
        toAccountId: normalizeAccountId(toAccountId),
        amount,
      }),
    }),
};
