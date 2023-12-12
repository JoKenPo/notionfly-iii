import React, { useEffect, createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notion } from '../libs/notion';

interface IProps {
  children: React.ReactNode;
}

interface IAccount {
  id: string;
  name: string;
}

interface INotion {
  transactionsDatabaseId?: string;
  accountsDatabaseId?: string;
  accounts: IAccount[];
  transactions: any[];
  notion: Notion | undefined;
  loading: boolean;
}

export const NotionContext = createContext<INotion>({
  transactionsDatabaseId: undefined,
  accountsDatabaseId: undefined,
  accounts: [],
  transactions: [],
  notion: undefined,
  loading: false,
});

const NotionProvider = ({ children }: IProps) => {
  const [transactionsDatabaseId, setTransactionsDatabaseId] = useState<string | undefined>();
  const [accountsDatabaseId, setAccountsDatabaseId] = useState<string | undefined>();
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notion, setNotion] = useState<Notion | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSavedInfo = async () => {
      try {
        const savedSecretKey = await AsyncStorage.getItem('secretKey');
        const savedDatabaseId = await AsyncStorage.getItem('databaseId');

        if (savedSecretKey && savedDatabaseId) {
          const newNotion = new Notion(savedSecretKey, savedDatabaseId);
          await setNotion(newNotion);
          setTransactionsDatabaseId(newNotion.transactionsDatabaseId);
          setAccountsDatabaseId(newNotion.accountsDatabaseId);
        }
      } catch (error) {
        console.log('Error loading saved info:', error);
      }
    };

    loadSavedInfo();
  }, []);

  useEffect(() => {
    const getNotionDatabases = async () => {
      try {
        if (notion) {
          await notion.getMainDatabase();
          setAccounts(notion.accounts);
          setTransactions(notion.transactions);
        }
      } catch (error) {
        console.log('Error when trying to get main databases from Notion:', error);
        AsyncStorage.removeItem('secretKey')
        AsyncStorage.removeItem('databaseId')
      }
    };

    getNotionDatabases();
  }, [notion]);

  useEffect(() => {
    if (notion?.transactions.length) {
      setLoading(false);
    }
  }, [notion?.transactions.length]);

  const newTransaction = async (data: any) => {
    if (notion) {
      await notion.insertPage(data);
    }
  };

  return (
    <NotionContext.Provider value={{ accounts, transactions, accountsDatabaseId, transactionsDatabaseId, notion, loading }}>
      {children}
    </NotionContext.Provider>
  );
};

export { NotionProvider };
export const useNotion = () => React.useContext(NotionContext);
