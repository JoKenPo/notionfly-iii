import { Client } from '@notionhq/client';
import { NotionService } from './NotionService';

// Mock the Notion client
jest.mock('@notionhq/client');

const mockQuery = jest.fn().mockResolvedValue({ results: [] });
const mockChildrenList = jest.fn().mockResolvedValue({ results: [] });

// Mock the implementation of the Client
const MockClient = Client as jest.MockedClass<typeof Client>;

beforeEach(() => {
  // Clear all instances and calls to constructor and methods before each test
  MockClient.mockClear();
  mockQuery.mockClear();
  mockChildrenList.mockClear();
  // @ts-expect-error A mock implementation is provided for the test environment.
  MockClient.mockImplementation(() => {
    return {
      databases: {
        query: mockQuery,
      },
      blocks: {
        children: {
          list: mockChildrenList,
        },
      },
    };
  });
});

describe('NotionService', () => {
  it('should be able to create an instance', () => {
    const notionService = new NotionService('test_api_key', 'test_database_id');
    expect(notionService).toBeInstanceOf(NotionService);
    expect(MockClient).toHaveBeenCalledWith({ auth: 'test_api_key' });
  });

  describe('getMainDatabase', () => {
    it('should query the main database with the correct filter', async () => {
      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      await notionService.getMainDatabase();

      expect(mockQuery).toHaveBeenCalledWith({
        database_id: 'test_database_id',
        filter: {
          property: 'Component',
          select: {
            equals: 'Core Databases',
          },
        },
        sorts: [],
      });
    });

    it('should fetch children for each database found', async () => {
      const fakeDbPage = { id: 'fake-page-id' };
      mockQuery.mockResolvedValueOnce({ results: [fakeDbPage] });

      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      await notionService.getMainDatabase();

      expect(mockChildrenList).toHaveBeenCalledWith({
        block_id: 'fakepageid',
      });
    });

    it('should identify and store the accounts database ID', async () => {
      const fakeDbPage = { id: 'fake-page-id' };
      const fakeAccountsDb = {
        id: 'fake-accounts-db-id',
        type: 'child_database',
        child_database: { title: 'Accounts' },
      };
      mockQuery.mockResolvedValueOnce({ results: [fakeDbPage] });
      mockChildrenList.mockResolvedValueOnce({ results: [fakeAccountsDb] });

      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      await notionService.getMainDatabase();

      expect(notionService.accountsDatabaseId).toBe('fake-accounts-db-id');
    });

    it('should identify and store the transactions database ID', async () => {
      const fakeDbPage = { id: 'fake-page-id' };
      const fakeTransactionsDb = {
        id: 'fake-transactions-db-id',
        type: 'child_database',
        child_database: { title: 'Transactions' },
      };
      mockQuery.mockResolvedValueOnce({ results: [fakeDbPage] });
      mockChildrenList.mockResolvedValueOnce({ results: [fakeTransactionsDb] });

      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      await notionService.getMainDatabase();

      expect(notionService.transactionsDatabaseId).toBe(
        'fake-transactions-db-id',
      );
    });
  });

  describe('syncAccounts', () => {
    it('should query the accounts database if the ID is set', async () => {
      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      notionService.accountsDatabaseId = 'fake-accounts-db-id'; // Manually set for this test

      await notionService.syncAccounts();

      expect(mockQuery).toHaveBeenCalledWith({
        database_id: 'fake-accounts-db-id',
        page_size: 100,
        start_cursor: undefined,
      });
    });

    it('should process and store the fetched accounts', async () => {
      const fakeAccountPage = {
        id: 'fake-account-id',
        properties: {
          Name: { title: [{ plain_text: 'My Bank' }] },
          'Source Type': { select: { name: 'Checking' } },
          '# Balance TOTAL': { formula: { number: 1234.56 } },
        },
      };
      mockQuery.mockResolvedValueOnce({ results: [fakeAccountPage] });

      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      notionService.accountsDatabaseId = 'fake-accounts-db-id';

      await notionService.syncAccounts();

      expect(notionService.accounts['My Bank']).toEqual({
        id: 'fake-account-id',
        type: 'Checking',
        balance: 1234.56,
      });
    });
  });
});
