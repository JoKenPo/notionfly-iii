import { NotionPage } from '../types';

export const processNotionData = (rawData: NotionPage[]) => {
  return rawData.map((item) => ({
    id: item.id,
    title: item.properties.Name?.title?.[0]?.plain_text ?? 'No Title',
    value: item.properties.Value?.number ?? 0,
  }));
};
