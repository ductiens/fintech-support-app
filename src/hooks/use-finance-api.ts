import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';

export type UserResponseData = {
  user_id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  role: string;
  kyc_status: string;
  created_at: string;
};

export type WalletResponseData = {
  wallet_id: string;
  user_id: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
};

export type TransactionResponseData = {
  transaction_id: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  type: string; // DEPOSIT, WITHDRAWAL, TRANSFER
  status: string; // SUCCESS, FAILED, PENDING
  fee: number;
  recipient_user_id?: string | null;
  recipient_wallet_id?: string | null;
  description?: string | null;
  idempotency_key?: string | null;
  created_at: string;
};

export type TransactionListResponseData = {
  transactions: TransactionResponseData[];
  total: number;
  limit: number;
  skip: number;
};

export type SendMoneyPayload = {
  amount: number;
  type: string; // DEPOSIT, WITHDRAWAL, TRANSFER
  recipient_user_id?: string | null;
  description?: string | null;
  idempotency_key?: string | null;
};

export function useUserMe() {
  const api = useApi();
  return useQuery({
    queryKey: ['userMe'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: UserResponseData }>('/api/v1/finance/users/me');
      return response.data;
    },
  });
}

export function useWallet() {
  const api = useApi();
  return useQuery({
    queryKey: ['walletMe'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: WalletResponseData }>('/api/v1/finance/users/me/wallet');
      return response.data;
    },
  });
}

export function useTransactions(limit: number = 20, skip: number = 0) {
  const api = useApi();
  return useQuery({
    queryKey: ['transactionsMe', limit, skip],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: TransactionListResponseData }>(
        `/api/v1/finance/users/me/transactions?limit=${limit}&skip=${skip}`
      );
      return response.data;
    },
  });
}

export function useSendMoney() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendMoneyPayload) => {
      const response = await api.post<{ success: boolean; data: TransactionResponseData }>(
        '/api/v1/finance/transactions',
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletMe'] });
      queryClient.invalidateQueries({ queryKey: ['transactionsMe'] });
    },
  });
}
