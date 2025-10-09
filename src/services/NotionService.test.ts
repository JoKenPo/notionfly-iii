import { Client } from '@notionhq/client';
import { NotionService } from './NotionService';

// Mock the Notion client
jest.mock('@notionhq/client');

const mockRequest = jest.fn().mockResolvedValue({ results: [] });
const mockChildrenList = jest.fn().mockResolvedValue({ results: [] });

// Mock the implementation of the Client
const MockClient = Client as jest.MockedClass<typeof Client>;

beforeEach(() => {
  // Clear all instances and calls to constructor and methods before each test
  MockClient.mockClear();
  mockRequest.mockClear();
  mockChildrenList.mockClear();
  // @ts-expect-error A mock implementation is provided for the test environment.
  MockClient.mockImplementation(() => {
    return {
      request: mockRequest,
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
    expect(MockClient).toHaveBeenCalledWith({ auth: 'test_api_key', fetch: fetch });
  });

  describe('getMainDatabase', () => {
    it('should call the low-level request method with correct parameters', async () => {
      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      await notionService.getMainDatabase();

      expect(mockRequest).toHaveBeenCalledWith({
        path: 'databases/test_database_id/query',
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
      });
    });

    it('should fetch children for each database found', async () => {
      const fakeDbPage = { id: 'fake-page-id' };
      mockRequest.mockResolvedValueOnce({ results: [fakeDbPage] });

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
      mockRequest.mockResolvedValueOnce({ results: [fakeDbPage] });
      mockChildrenList.mockResolvedValueOnce({ results: [fakeAccountsDb] });

      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      await notionService.getMainDatabase();

      expect(notionService.accountsDatabaseId).toBe('fake-accounts-db-id');
    });
  });

  describe('syncAccounts', () => {
    it('should call the low-level request method with correct parameters', async () => {
      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      notionService.accountsDatabaseId = 'fake-accounts-db-id';

      await notionService.syncAccounts();

      expect(mockRequest).toHaveBeenCalledWith({
        path: 'databases/fake-accounts-db-id/query',
        method: 'post',
        body: {
          page_size: 100,
          start_cursor: undefined,
        },
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
      mockRequest.mockResolvedValueOnce({ results: [fakeAccountPage] });

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

  describe('syncTransactions', () => {
    it('should call the low-level request method with correct parameters', async () => {
      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      notionService.transactionsDatabaseId = 'fake-transactions-db-id';

      await notionService.syncTransactions();

      expect(mockRequest).toHaveBeenCalledWith({
        path: 'databases/fake-transactions-db-id/query',
        method: 'post',
        body: {
          page_size: 100,
          start_cursor: undefined,
        },
      });
    });

    it('should process and store the fetched transactions', async () => {
      const fakeTransactionPage = {
        id: 'fake-tx-id',
        properties: {
          Name: { title: [{ plain_text: 'Coffee' }] },
          Amount: { number: -4.5 },
          Date: { date: { start: '2025-09-20T12:00:00Z' } },
          Category: { multi_select: [{ name: 'Food' }, { name: 'Coffee' }] },
        },
      };
      mockRequest.mockResolvedValueOnce({ results: [fakeTransactionPage] });

      const notionService = new NotionService(
        'test_api_key',
        'test_database_id',
      );
      notionService.transactionsDatabaseId = 'fake-transactions-db-id';

      await notionService.syncTransactions();

      expect(notionService.transactions[0]).toEqual({
        id: 'fake-tx-id',
        name: 'Coffee',
        amount: -4.5,
        date: '2025-09-20T12:00:00Z',
        category: ['Food', 'Coffee'],
      });
    });
  });
});