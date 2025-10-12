
export const mockAccountsResponse = {
  results: [
    {
      id: 'account-1',
      properties: {
        'Name': { title: [{ plain_text: 'Nubank' }] },
        'Source Type': { select: { name: 'Bank' } },
        '# Balance TOTAL': { formula: { number: 1500.75 } },
      },
    },
    {
      id: 'account-2',
      properties: {
        'Name': { title: [{ plain_text: 'Carteira' }] },
        'Source Type': { select: { name: 'Cash' } },
        '# Balance TOTAL': { formula: { number: 350.0 } },
      },
    },
    {
      id: 'account-3',
      properties: {
        'Name': { title: [{ plain_text: 'Binance' }] },
        'Source Type': { select: { name: 'Investments' } },
        '# Balance TOTAL': { formula: { number: 12500.0 } },
      },
    },
  ],
};

export const mockTransactionsResponse = {
  results: [
    {
      id: 'txn-1',
      properties: {
        'Name': { title: [{ plain_text: 'Salário' }] },
        'Amount': { number: 5000 },
        'Date': { date: { start: '2025-10-05' } },
        'Category': { multi_select: [{ name: 'Receita' }] },
      },
    },
    {
      id: 'txn-2',
      properties: {
        'Name': { title: [{ plain_text: 'Aluguel' }] },
        'Amount': { number: -1200 },
        'Date': { date: { start: '2025-10-05' } },
        'Category': { multi_select: [{ name: 'Moradia' }] },
      },
    },
    {
      id: 'txn-3',
      properties: {
        'Name': { title: [{ plain_text: 'Supermercado' }] },
        'Amount': { number: -450.5 },
        'Date': { date: { start: '2025-10-07' } },
        'Category': { multi_select: [{ name: 'Alimentação' }] },
      },
    },
  ],
};
