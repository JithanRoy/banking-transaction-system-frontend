const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface Account {
  id?: number;
  account_id: string;
  holder_name: string;
  balance: string;
  version: number;
}

export interface AccountsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AccountsListResponse {
  accounts: Account[];
  pagination: AccountsPagination;
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
  id?: number;
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
    id: raw.id,
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
    const candidate =
      (payload as { accounts?: unknown; data?: unknown; results?: unknown })
        .accounts ??
      (payload as { accounts?: unknown; data?: unknown; results?: unknown })
        .data ??
      (payload as { accounts?: unknown; data?: unknown; results?: unknown })
        .results;

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
  listAccounts: async (page = 1, limit = 10): Promise<AccountsListResponse> => {
    const payload = await request<{
      data?: unknown;
      pagination?: Partial<AccountsPagination>;
    }>(`/accounts?page=${page}&limit=${limit}`);

    const accounts = normalizeAccountsResponse(payload.data ?? []);
    const pagination = payload.pagination;

    return {
      accounts,
      pagination: {
        page:
          typeof pagination?.page === "number" && pagination.page > 0
            ? pagination.page
            : page,
        limit:
          typeof pagination?.limit === "number" && pagination.limit > 0
            ? pagination.limit
            : limit,
        total:
          typeof pagination?.total === "number" && pagination.total >= 0
            ? pagination.total
            : accounts.length,
        totalPages:
          typeof pagination?.totalPages === "number" &&
          pagination.totalPages > 0
            ? pagination.totalPages
            : Math.max(1, Math.ceil(accounts.length / limit)),
      },
    };
  },

  createAccount: (data: {
    accountId: string;
    holderName: string;
    balance: number;
  }) =>
    request<{ message: string }>("/accounts/create", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        accountId: normalizeAccountId(data.accountId),
      }),
    }),

  updateAccount: (
    accountId: string,
    data: { holderName?: string; balance?: number },
  ) =>
    request<{ message: string }>(
      `/accounts/update/${normalizeAccountId(accountId)}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),

  deleteAccount: (accountId: string) =>
    request<{ message: string }>(`/accounts/${normalizeAccountId(accountId)}`, {
      method: "DELETE",
    }),

  getAccount: async (id: string) =>
    normalizeAccountResponse(
      await request<unknown>(`/accounts/${normalizeAccountId(id)}`),
    ),

  deposit: (accountId: string, amount: number) =>
    request<TransactionResult>("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify({
        accountId: normalizeAccountId(accountId),
        amount,
      }),
    }),

  withdraw: (accountId: string, amount: number) =>
    request<TransactionResult>("/transactions/withdraw", {
      method: "POST",
      body: JSON.stringify({
        accountId: normalizeAccountId(accountId),
        amount,
      }),
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
