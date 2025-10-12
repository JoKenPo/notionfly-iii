import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, DataTable, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useNotion } from '../contexts/NotionContext';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export default function CategoryReportScreen() {
  const { transactions, loading } = useNotion();
  const [currentDate, setCurrentDate] = useState(new Date());

  const categoryExpenses = useMemo(() => {
    const targetMonth = currentDate.getMonth();
    const targetYear = currentDate.getFullYear();

    const expenses = transactions.filter(t => {
      const tDate = new Date(t.date);
      return (
        t.amount < 0 &&
        tDate.getMonth() === targetMonth &&
        tDate.getFullYear() === targetYear
      );
    });

    const grouped: Record<string, number> = {};
    expenses.forEach(expense => {
      const categories = expense.category.length > 0 ? expense.category : ['Sem Categoria'];
      categories.forEach(cat => {
        grouped[cat] = (grouped[cat] || 0) + expense.amount;
      });
    });

    return Object.entries(grouped)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => a.total - b.total); // Sort by most expensive first

  }, [transactions, currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Relatório por Categoria" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <ScrollView>
          <Card style={styles.filterCard}>
            <Card.Title
              title={currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
              titleStyle={{ textTransform: 'capitalize' }}
            />
            <Card.Actions>
              <Button onPress={goToPreviousMonth}>Mês Anterior</Button>
              <Button onPress={goToNextMonth}>Próximo Mês</Button>
            </Card.Actions>
          </Card>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Categoria</DataTable.Title>
              <DataTable.Title numeric>Total Gasto</DataTable.Title>
            </DataTable.Header>

            {categoryExpenses.length > 0 ? (
              categoryExpenses.map(item => (
                <DataTable.Row key={item.name}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={{ color: 'red' }}>{formatCurrency(item.total)}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhuma despesa encontrada para este mês.</Text>
            )}
          </DataTable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCard: {
    margin: 16,
  },
  noDataText: {
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
  },
});
