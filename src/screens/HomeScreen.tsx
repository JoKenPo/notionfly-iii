import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, ActivityIndicator, FAB, Text, Card } from 'react-native-paper';
import { useNotion } from '../contexts/NotionContext';
import NotionItemCard from '../components/NotionItemCard';
import { ITransaction } from '../types';

export default function HomeScreen() {
  const { accounts, transactions, loading, error, refetch } = useNotion();

  // --- Dashboard Logic ---

  // 1. Calculate total expenses for the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return (
        t.amount < 0 &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // 2. Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // --- Render Logic ---

  const renderItem = ({ item }: { item: ITransaction }) => (
    <NotionItemCard item={item} />
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="refresh" onPress={refetch} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <>
          <Card style={styles.summaryCard}>
            <Card.Title title="Despesas do Mês" />
            <Card.Content>
              <Text variant="displayMedium" style={{ color: 'red' }}>
                {formatCurrency(monthlyExpenses)}
              </Text>
            </Card.Content>
          </Card>

          <Text variant="titleLarge" style={styles.listTitle}>
            Últimas Transações
          </Text>

          <FlatList
            data={recentTransactions}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Pressed')}
      />
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
  summaryCard: {
    margin: 16,
  },
  listTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 80, // To avoid FAB overlap
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});