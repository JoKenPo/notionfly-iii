import { renderHook, waitFor } from '@testing-library/react-native';
import { useNotionData } from './useNotionData';
import { getDatabase } from '../services/notion';

// Mock do serviço do Notion
jest.mock('../services/notion', () => ({
  getDatabase: jest.fn(),
}));

// Tipando o mock para ter acesso aos métodos do jest
const mockedGetDatabase = getDatabase as jest.Mock;

describe('useNotionData', () => {
  it('should fetch data from notion and update state', async () => {
    // 1. Arrange: Preparamos o nosso cenário com dados brutos
    const rawMockData = [
      {
        id: '1',
        properties: {
          Name: { title: [{ plain_text: 'Test Page' }] },
          Value: { number: 123 },
        },
      },
    ];
    const processedMockData = [{ id: '1', title: 'Test Page', value: 123 }];
    mockedGetDatabase.mockResolvedValue(rawMockData);

    // 2. Act: Executamos o hook
    const { result } = renderHook(() => useNotionData());

    // 3. Assert: Verificamos o estado inicial
    expect(result.current.loading).toBe(true);

    // Esperamos a promessa ser resolvida e o estado ser atualizado
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(processedMockData);
    });

    // Verificamos se a função foi chamada
    expect(mockedGetDatabase).toHaveBeenCalledTimes(1);
  });
});
