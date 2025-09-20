import { processNotionData } from './notionProcessor'; // Arquivo ainda não existe

describe('processNotionData', () => {
  it('should process raw notion data into a clean format', () => {
    // Dados brutos simulando a resposta da API do Notion
    const rawData = [
      {
        id: '123',
        properties: {
          Name: {
            title: [{ plain_text: 'Item 1' }],
          },
          Value: {
            number: 100,
          },
        },
      },
      {
        id: '456',
        properties: {
          Name: {
            title: [{ plain_text: 'Item 2' }],
          },
          Value: {
            number: 200,
          },
        },
      },
    ];

    const expectedData = [
      { id: '123', title: 'Item 1', value: 100 },
      { id: '456', title: 'Item 2', value: 200 },
    ];

    const result = processNotionData(rawData);

    expect(result).toEqual(expectedData);
  });
});
