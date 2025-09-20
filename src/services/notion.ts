import { Client } from '@notionhq/client';

export const getDatabase = async (apiKey: string, databaseId: string) => {
  const notion = new Client({ auth: apiKey });

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    return [];
  }
};
