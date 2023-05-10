import { ReactNode, useEffect, useState, useCallback } from 'react';
import { createContext } from 'use-context-selector';

import { api } from '../lib/axios';

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  category: string;
  price: number;
  createdAt: string;
}

interface TransactionsContextData {
  transactions: Transaction[];
  fetchTransactions(query?: string): Promise<void>;
  createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    });

    setTransactions(response.data);
  }, []);

  const createTransaction = useCallback(
    async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
      const { description, type, category, price } = data;

      const response = await api.post('/transactions', {
        description,
        type,
        category,
        price,
        createdAt: new Date(),
      });

      const newTransaction = response.data;

      setTransactions((oldTransactions) => [
        ...oldTransactions,
        newTransaction,
      ]);
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
