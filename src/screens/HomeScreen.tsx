import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, ActivityIndicator, FAB, Text, Card } from 'react-native-paper';
import { useNotion } from '../contexts/NotionContext';
import NotionItemCard from '../components/NotionItemCard';
import { ITransaction } from '../types';

export default function HomeScreen() {
  const { accounts, transactions, loading, error, refetch } = useNotion();

  const renderItem = ({ item }: { item: ITransaction }) => (
    <NotionItemCard
      item={{
        id: item.id,
        title: item.name,
        value: item.amount.toString(), // NotionItemCard expects a string value
      }}
    />
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
        <Appbar.Content title="NotionFly III" />
        <Appbar.Action icon="refresh" onPress={refetch} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <>
          <Card style={styles.summaryCard}>
            <Card.Title title="Visão Geral" />
            <Card.Content>
              <Text variant="bodyMedium">
                {Object.keys(accounts).length} Contas e {transactions.length} Transações Carregadas
              </Text>
            </Card.Content>
          </Card>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
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