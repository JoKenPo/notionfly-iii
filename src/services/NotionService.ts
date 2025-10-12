import { Client } from '@notionhq/client';
import {
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { IAccount, ITransaction } from '../types';
import { mockAccountsResponse, mockTransactionsResponse } from './mockData';

export class NotionService {
  private notion: Client;
  private pageId: string;
  private apiKey: string;

  public accountsDatabaseId: string | undefined;
  public transactionsDatabaseId: string | undefined;
  public accounts: Record<string, IAccount> = {};
  public transactions: ITransaction[] = [];
  private useMockData: boolean;

  constructor(apiKey: string, pageId: string, useMockData = false) {
    this.notion = new Client({
      auth: apiKey,
      fetch: window.fetch.bind(window),
    });
    this.pageId = pageId;
    this.apiKey = apiKey;

    this.useMockData = useMockData;
  }

    async getMainDatabase() {

      // Step 1: Find the 'System' database ID from the main page's children

      const page = await this.notion.blocks.children.list({

        block_id: this.pageId,

      });

  

      const systemDbId = page.results

        .map(item => {

          if ('type' in item && item.type === 'child_database' && item.child_database.title === 'System') {

            return item.id;

          }

          return null;

        })

        .find(id => id !== null);

  

              if (!systemDbId) {

  

                throw new Error("Could not find the 'System' database on the main page.");

  

              }

  

          

  

              // Step 2: Query the 'System' database to find the pages for 'Accounts' and 'Transactions'

  

                                          const systemDbContent = (await fetch(

  

                                            `https://api.notion.com/v1/databases/${systemDbId}/query`,

  

                                            {

  

                                              method: 'POST',

  

                                              headers: {

  

                                                Authorization: `Bearer ${this.apiKey}`,

  

                                                'Content-Type': 'application/json',

  

                                                'Notion-Version': '2022-06-28',

  

                                              },

  

                                              body: JSON.stringify({ page_size: 100 }),

  

                                            }

  

                                          ).then((res) => res.json())) as { results: any[] };

        

            // Step 3: For each page ('Accounts', 'Transactions'), find the real database ID within it

            for (const page of systemDbContent.results) {

              const title = (page as any).properties?.Name?.title?.[0]?.plain_text;

              const pageId = page.id;

        

              if (title === 'Accounts' || title === 'Transactions') {

                const children = await this.notion.blocks.children.list({

                  block_id: pageId,

                });

        

                const childDb = children.results.find(child => 'type' in child && child.type === 'child_database');

        

                if (childDb && 'id' in childDb) {

                  if (title === 'Accounts') {

                    this.accountsDatabaseId = childDb.id;

                  } else if (title === 'Transactions') {

                    this.transactionsDatabaseId = childDb.id;

                  }

                }

              }

            }

    return {
      accounts: [],
      transactions: [],
    };
  } async syncAccounts() {
    if (this.useMockData) {
      this.addAccounts(mockAccountsResponse.results);
      return;
    }

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
    if (this.useMockData) {
      this.addTransactions(mockTransactionsResponse.results);
      return;
    }
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