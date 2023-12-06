import { Client } from '@notionhq/client';
import { CreatePageParameters, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { get, save } from './cache';

const NAMESPACE = 'notion-page';
AsyncStorage.setItem(NAMESPACE, '');

interface ITransactions {
  id: string,
  name: string,
  amount: string,
  date: Date,
  category: Array<string>
}

interface IAccounts {
  id: string,
  type: string,
  balance: string,
}

export class Notion {
  private notion: Client;
  private transactionsDatabaseId: string;
  private accountsDatabaseId: string;

  constructor(secret_key: string, databaseId: string) {
      this.notion = new Client({
          auth: secret_key,
      });

      // this.pages = get(NAMESPACE, {});
      const loadSavedInfo = async () => {
        this.pages = await AsyncStorage.getItem(NAMESPACE);
      };
      loadSavedInfo();

      this.databaseId = databaseId;

      console.log(`Notion: restored from cache, count is ${Object.keys(this.pages).length}`);
      console.log('this.pages: ',this.pages);
  }

  save() {
    AsyncStorage.setItem(NAMESPACE, this.pages);
  }

  pages: Record<string, { id: string }> = {};
  accounts: Record<string, IAccounts> = {};
  transactions: ITransactions[] = [];
  databaseId: string;

  hasPage(name: string) {
      return !!this.pages[name];
  }

  /**
   * full-sync pages in database
   */
  async fullSyncIfNeeded() {
      if (Object.keys(this.pages).length) {
          console.log('Notion: skipped sync due to cache');
          return;
      }

      console.log('Notion: Start to get all pages');

      let hasNext = true;
      let cursor: string | undefined;

      console.log('this.databaseId: ',this.databaseId);
      while (hasNext) {
          const database: QueryDatabaseResponse = await this.notion.databases.query({
              database_id: this.databaseId,
              page_size: 100,
              start_cursor: cursor,
          });

          // this.addPages(database.results as NotionPage[]);
          await this.addPages(database.results);
          hasNext = database.has_more;
          // @ts-ignore
          cursor = database.next_cursor;
      }

      console.log(`Notion: Get all pages success, count is ${Object.keys(this.pages).length}`);

      this.save();
  }

  // addPages(pages: NotionPage[]) {
      addPages(pages) {
      pages.forEach((page) => {
          this.pages[page.properties.Name.title[0].plain_text] = {
              id: page.id,
          };
      });

      this.save();
  }

  // async insertPage(repo: Repo) {
    async insertPage(repo) {

      const data = await this.notion.pages.create({
        parent: {
          type: 'database_id',
          database_id: '103270b4887b4eecbe3ad5a5964d4564',
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: repo.name,
                },
              },
            ],
          },
          Context: {
            multi_select: [{name: '⛏ Task'}],
          },
        },
      } as CreatePageParameters);

      this.pages[repo.name] = { id: data.id };

      console.log(`insert page ${repo.name} success, page id is ${data.id}`);

      this.save();
  }


  async syncAccounts() {
    // if (Object.keys(this.pages).length) {
    //     console.log('Notion: skipped sync due to cache');
    //     return;
    // }

    if (!this.accountsDatabaseId) {
      console.log('Dont found the database wet');
      return;
    }

    console.log('Notion: Start to get all accounts');

    let hasNext = true;
    let cursor: string | undefined;

    while (hasNext) {
        const database: QueryDatabaseResponse = await this.notion.databases.query({
            database_id: this.accountsDatabaseId,
            page_size: 100,
            start_cursor: cursor,
        });

        await this.addAccounts(database.results);
        hasNext = database.has_more;
        // @ts-ignore
        cursor = database.next_cursor;
    }

    console.log(`Notion: Get all accounts success, count is ${Object.keys(this.accounts).length}`);

    console.log('this.accounts: ',this.accounts);

    // this.save();
    return this.accounts;
  }

  addAccounts(pages) {
    pages.forEach((page) => {
        this.accounts[page.properties.Name.title[0].plain_text] = {
          id: page.id,
          type: page.properties['Source Type'].select.name,
          balance: page.properties['# Balance TOTAL'].formula.number,
        };
    });

    // this.save();
  }


  async syncTransactions() {
    // if (Object.keys(this.pages).length) {
    //     console.log('Notion: skipped sync due to cache');
    //     return;
    // }

    if (!this.transactionsDatabaseId) {
      console.log('Dont found the database wet');
      return;
    }

    console.log('Notion: Start to get all transactions');

    let hasNext = true;
    let cursor: string | undefined;

    while (hasNext) {
        const database: QueryDatabaseResponse = await this.notion.databases.query({
            database_id: this.transactionsDatabaseId,
            page_size: 100,
            start_cursor: cursor,
        });

        await this.addTransactions(database.results);
        hasNext = database.has_more;
        // @ts-ignore
        cursor = database.next_cursor;
    }

    console.log(`Notion: Get all transactions success, count is ${this.transactions.length}`);

    // console.log('this.transactions: ',this.transactions);

    // this.save();
    return this.transactions;
  }

  async addTransactions(pages) {
    let newTransaction : ITransactions[] = [];
    await pages.forEach((page) => {
      newTransaction.push({
          id: page.id,
          name: page.properties.Name.title[0].plain_text,
          amount: page.properties.Amount.number,
          date: page.properties.Date.date.start,
          category: page.properties.Category.multi_select,
        });
    });

    await this.transactions.push(...newTransaction);
    // this.save();
  }

  async getMainDatabase() {
    const databases: QueryDatabaseResponse = await this.notion.databases.query({
      database_id: this.databaseId,
      filter: {
        property: 'Component',
        select: {
          equals: 'Core Databases',
        },
      },
      sorts: [],
  });

    let transactionsDatabase = {};
    let accountsDatabase = [];

    // console.log('DATA: ',JSON.stringify(databases));
    for (const db of databases.results) {
      console.log(db.id.split('-').join(''));
      const page = await this.notion.blocks.children.list({
        block_id: db.id.split('-').join(''),
      });

      for (const item of page.results) {
        if (item.type === 'child_database' && item.child_database && item.child_database.title === 'Transactions') {
          this.transactionsDatabaseId = item.id;
          console.log('this.transactionsDatabaseId: ', this.transactionsDatabaseId);
          transactionsDatabase = await this.syncTransactions();
        }

        if (item.type === 'child_database' && item.child_database && item.child_database.title === 'Accounts') {
          this.accountsDatabaseId = item.id;
          console.log('this.accountsDatabaseId: ', this.accountsDatabaseId);
          accountsDatabase = await this.syncAccounts();
        }
      }
    }


    return {
      accounts: accountsDatabase,
      transactions: transactionsDatabase,
    };
  }

}
