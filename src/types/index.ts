export interface NotionItem {
  id: string;
  title: string;
  value: string;
}

// Represents a simplified raw page object from the Notion API
export interface NotionPage {
  id: string;
  properties: {
    Name?: {
      title?: {
        plain_text: string;
      }[];
    };
    Value?: {
      number?: number;
    };
  };
}

export interface IAccount {
  id: string;
  type: string;
  balance: number;
}

export interface ITransaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string[];
}
