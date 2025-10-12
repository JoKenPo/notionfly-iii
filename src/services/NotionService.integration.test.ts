import 'dotenv/config';
import { NotionService } from './NotionService';

// This is an integration test and will make real API calls to Notion.
// Ensure your .env file has the correct NOTION_API_KEY and NOTION_PAGE_ID.

describe('NotionService Integration', () => {
  // Increase timeout for real network requests
  jest.setTimeout(30000);

  it('should connect to Notion, fetch main database, and sync data', async () => {
    const apiKey = process.env.NOTION_API_KEY;
    const pageId = process.env.NOTION_PAGE_ID;

    // Guard clause to ensure credentials are in .env
    if (!apiKey || !pageId) {
      throw new Error(
        'Missing NOTION_API_KEY or NOTION_PAGE_ID in .env file'
      );
    }

    console.log(`Attempting to use Page ID: "${pageId}"`);

    try {
      const notionService = new NotionService(apiKey, pageId);

      console.log('Fetching main database...');
      const mainDbResult = await notionService.getMainDatabase();
      console.log('Main DB Result:', mainDbResult);
      console.log('Accounts DB ID:', notionService.accountsDatabaseId);
      console.log('Transactions DB ID:', notionService.transactionsDatabaseId);

      expect(notionService.accountsDatabaseId).toBeDefined();
      expect(notionService.transactionsDatabaseId).toBeDefined();

      console.log('Syncing accounts...');
      await notionService.syncAccounts();
      console.log('Synced Accounts:', notionService.accounts);

      console.log('Syncing transactions...');
      await notionService.syncTransactions();
      console.log('Synced Transactions:', notionService.transactions);

      expect(notionService.transactions.length).toBeGreaterThan(0);
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        console.error('Notion API Error Code:', (error as any).code);
      }
      console.error('Full error:', error);
      // Re-throw to make the test fail
      throw error;
    }
  });
});
