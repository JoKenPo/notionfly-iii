import { Client } from '@notionhq/client';
import {
  ListBlockChildrenResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { IAccount } from '../types';

export class NotionService {
  private notion: Client;
  private databaseId: string;
  public accountsDatabaseId: string | undefined;
  public transactionsDatabaseId: string | undefined;
  public accounts: Record<string, IAccount> = {};

  constructor(apiKey: string, databaseId: string) {
    this.notion = new Client({
      auth: apiKey,
    });
    this.databaseId = databaseId;
  }

  async getMainDatabase() {
    const databases = await this.notion.databases.query({
      database_id: this.databaseId,
      filter: {
        property: 'Component',
        select: {
          equals: 'Core Databases',
        },
      },
      sorts: [],
    });

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

    // Logic to process results will be added in the next TDD cycle
    return {
      accounts: [],
      transactions: [],
    };
  }

  async syncAccounts() {
    if (!this.accountsDatabaseId) {
      return;
    }

    const database: QueryDatabaseResponse = await this.notion.databases.query({
      database_id: this.accountsDatabaseId,
      page_size: 100,
      start_cursor: undefined,
    });

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
}
