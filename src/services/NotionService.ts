import { Client } from '@notionhq/client';
import {
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { IAccount, ITransaction } from '../types';

export class NotionService {
  private notion: Client;
  private databaseId: string;
  public accountsDatabaseId: string | undefined;
  public transactionsDatabaseId: string | undefined;
  public accounts: Record<string, IAccount> = {};
  public transactions: ITransaction[] = [];

  constructor(apiKey: string, databaseId: string) {
    this.notion = new Client({
      auth: apiKey,
      fetch: fetch,
    });
    this.databaseId = databaseId;
  }

  async getMainDatabase() {
    const databases = (await this.notion.request({
      path: `databases/${this.databaseId}/query`,
      method: 'post',
      body: {
        filter: {
          property: 'Component',
          select: {
            equals: 'Core Databases',
          },
        },
        sorts: [],
      },
    })) as { results: any[] };
    console.log('databases', databases);
    for (const db of databases.results) {
      const page: ListBlockChildrenResponse = await this.notion.blocks.children.list({
        block_id: db.id.split('-').join(''),
      });

      for (const item of page.results) {
        if ('type' in item && item.type === 'child_database' && item.child_database) {
          if (item.child_database.title === 'Accounts') {
            this.accountsDatabaseId = item.id;
          }
          if (item.child_database.title === 'Transactions') {
            this.transactionsDatabaseId = item.id;
          }
        }
      }
    }

    return {
      accounts: [],
      transactions: [],
    };
  }

  async syncAccounts() {
    if (!this.accountsDatabaseId) {
      return;
    }

    const database = (await this.notion.request({
      path: `databases/${this.accountsDatabaseId}/query`,
      method: 'post',
      body: {
        page_size: 100,
        start_cursor: undefined,
      },
    })) as { results: any[] };

    this.addAccounts(database.results);
  }

  private addAccounts(pages: any[]) {
    pages.forEach((page) => {
      this.accounts[page.properties.Name.title[0].plain_text] = {
        id: page.id,
        type: page.properties['Source Type'].select.name,
        balance: page.properties['# Balance TOTAL'].formula.number,
      };
    });
  }

  async syncTransactions() {
    if (!this.transactionsDatabaseId) {
      return;
    }

    const database = (await this.notion.request({
      path: `databases/${this.transactionsDatabaseId}/query`,
      method: 'post',
      body: {
        page_size: 100,
        start_cursor: undefined,
      },
    })) as { results: any[] };

    this.addTransactions(database.results);
  }

  private addTransactions(pages: any[]) {
    const newTransactions: ITransaction[] = pages.map((page) => ({
      id: page.id,
      name: page.properties.Name.title[0].plain_text,
      amount: page.properties.Amount.number,
      date: page.properties.Date.date.start,
      category: page.properties.Category.multi_select.map((c: any) => c.name),
    }));

    this.transactions.push(...newTransactions);
  }
}