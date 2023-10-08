import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
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
  accounts: Record<string, { id: string }> = {};
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
      if (repo.description && repo.description.length >= 2000) {
          repo.description = repo.description.substr(0, 120) + '...';
      }
      const data = await this.notion.pages.create({
          parent: {
              database_id: this.databaseId,
          },
          properties: {
              Name: {
                  type: 'title',
                  title: [
                      {
                          type: 'text',
                          text: {
                              content: repo.nameWithOwner,
                          },
                      },
                  ],
              },
              Type: {
                  type: 'select',
                  select: {
                      name: 'Star',
                  },
              },
              Link: {
                  type: 'url',
                  url: repo.url,
              },
              Description: {
                  type: 'rich_text',
                  rich_text: [
                      {
                          type: 'text',
                          text: {
                              content: repo.description || '',
                          },
                      },
                  ],
              },
              'Primary Language': {
                  type: 'select',
                  select: {
                      name: repo?.primaryLanguage?.name || 'null',
                  },
              },
              'Repository Topics': {
                  type: 'multi_select',
                  multi_select: repo.repositoryTopics || [],
              },
              'Starred At': {
                  type: 'date',
                  date: {
                      start: repo.starredAt,
                      end: repo.starredAt,
                  },
              },
          },
      });

      this.pages[repo.nameWithOwner] = { id: data.id };

      console.log(`insert page ${repo.nameWithOwner} success, page id is ${data.id}`);

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

    // console.log('this.accounts: ',this.accounts);

    // this.save();
    return this.accounts
  }

  addAccounts(pages) {
    pages.forEach((page) => {
        this.accounts[page.properties.Name.title[0].plain_text] = {
          id: page.id,
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
    return this.transactions
  }

  async addTransactions(pages) {
    let newTransaction : ITransactions[] = []
    await pages.forEach((page) => {
      newTransaction.push({
          id: page.id,
          name: page.properties.Name.title[0].plain_text,
          amount: page.properties.Amount.number,
          date: page.properties.Date.date.start,
          category: page.properties.Category.multi_select
        });
    });

    await this.transactions.push(...newTransaction)
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