import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, ActivityIndicator, FAB, Text, Card } from 'react-native-paper';
import { useNotionData } from '../hooks/useNotionData';
import NotionItemCard from '../components/NotionItemCard';
import { NotionItem } from '../types';

export default function HomeScreen() {
  const { data, loading, error } = useNotionData();

  const renderItem = ({ item }: { item: NotionItem }) => (
    <NotionItemCard item={item} />
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="NotionFly III" />
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
              <Text variant="titleLarge">{data.length} Itens Carregados</Text>
            </Card.Content>
          </Card>
          <FlatList
            data={data}
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
