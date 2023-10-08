import React, { useEffect } from 'react';
import { createContext } from 'react';

// import { notion, getMainDatabase } from '../libs/notion';

import { Notion } from '../libs/notion';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IProps { children: React.ReactNode; }

interface IAccount {
  id: string
  name: string
}

interface INotion {
  transactionsDatabaseId?: string
  accountsDatabaseId?: string
  accounts?: IAccount[]
  transactions?: any
  notion: any
  loading: boolean,
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

  const [transactionsDatabaseId, setTransactionsDatabase] = React.useState<string>();
  const [accountsDatabaseId, setAccountsDatabase] = React.useState<string>();
  const [accounts, setAccounts] = React.useState<IAccount[]>([]);
  const [transactions, setTransactions] = React.useState();
  const [notion, setNotion] = React.useState<Notion>();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    loadSavedInfo();
  }, []);

  const loadSavedInfo = async () => {
    try {

      const savedSecretKey = await AsyncStorage.getItem('secretKey');
      const savedDatabaseId = await AsyncStorage.getItem('databaseId');

      if (savedSecretKey !== null && savedDatabaseId !== null) {
        // const databasesIds = getMainDatabase();

        // setTransactionsDatabase(databasesIds.transactionsDatabaseId);
        // setAccountsDatabase(databasesIds.accountsDatabaseId);
        await setNotion(await new Notion(savedSecretKey, savedDatabaseId));
        // notion.fullSyncIfNeeded();
      }

    } catch (error) {
      console.log('error: ', error);
      // navigation.navigate('FirstAccess');
    }
  };

  const getNotionDatabases = async () => {
    if (notion) {

      await notion.getMainDatabase()
        .then(() => {
          setAccounts(notion.accounts)
          setTransactions(notion.transactions)
        })
        .catch((error) => {
          console.log("Error when tryng to get main databases from notion: ", error)
        })
    }
  }

  useEffect(() => {
    getNotionDatabases()
  }, [notion])

  useEffect(() => {
    setTransactions(notion?.transactions)
    if (notion?.transactions.length) setLoading(false)
  }, [notion?.transactions.length])
  // const navigation = useNavigation(); // Inicialize a navegação

  return (
    <NotionContext.Provider value={{ accounts, transactions, accountsDatabaseId, transactionsDatabaseId, notion, loading }}>
      {children}
    </NotionContext.Provider>
  );

};


export { NotionProvider };
export const useNotion = () => React.useContext(NotionContext);
