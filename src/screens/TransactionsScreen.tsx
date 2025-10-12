import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Text, ActivityIndicator } from 'react-native-paper';
import { useNotion } from '../contexts/NotionContext';
import NotionItemCard from '../components/NotionItemCard';
import { ITransaction } from '../types';

export default function TransactionsScreen() {
  const { transactions, loading, error } = useNotion();

  // Sort transactions by date, most recent first
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const renderItem = ({ item }: { item: ITransaction }) => (
    <NotionItemCard item={item} />
  );

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
        <Appbar.Content title="Todas as Transações" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <FlatList
          data={sortedTransactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    paddingVertical: 8,
  },
});
