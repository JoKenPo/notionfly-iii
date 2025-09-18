import { useState, useEffect } from 'react';
import { getDatabase } from '../services/notion';
import { processNotionData } from '../services/notionProcessor';
import { getCredentials } from '../services/credentials';

export const useNotionData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const { apiKey, databaseId } = await getCredentials();

    if (apiKey && databaseId) {
      try {
        const rawData = await getDatabase(apiKey, databaseId);
        if (rawData) {
          const processedData = processNotionData(rawData);
          setData(processedData);
        }
      } catch (e) {
        setError('Failed to fetch data from Notion. Check your credentials.');
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};