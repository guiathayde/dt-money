import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

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

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function fetchTransactions(query?: string) {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    });

    setTransactions(response.data);
  }

  async function createTransaction(
    data: Omit<Transaction, 'id' | 'createdAt'>
  ) {
    const { description, type, category, price } = data;

    const response = await api.post('/transactions', {
      description,
      type,
      category,
      price,
      createdAt: new Date(),
    });

    const newTransaction = response.data;

    setTransactions((oldTransactions) => [...oldTransactions, newTransaction]);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      'useTransactions must be used within an TransactionsProvider'
    );
  }

  return context;
}
