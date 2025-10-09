import React, { useEffect, createContext, useState, useContext } from 'react';
import { NotionService } from '../services/NotionService';
import { getCredentials } from '../services/credentials';
import { IAccount, ITransaction } from '../types';

interface INotionContext {
  accounts: Record<string, IAccount>;
  transactions: ITransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const NotionContext = createContext<INotionContext>({} as INotionContext);

export const NotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Record<string, IAccount>>({});
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { apiKey, databaseId } = await getCredentials();
      if (!apiKey || !databaseId) {
        throw new Error('Credentials not found');
      }
      const notionService = new NotionService(apiKey, databaseId);
      console.log('NotionService', notionService);
      await notionService.getMainDatabase();
      await notionService.syncAccounts();
      await notionService.syncTransactions();

      setAccounts(notionService.accounts);
      setTransactions(notionService.transactions);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <NotionContext.Provider value={{ accounts, transactions, loading, error, refetch: loadData }}>
      {children}
    </NotionContext.Provider>
  );
};

export const useNotion = () => useContext(NotionContext);
