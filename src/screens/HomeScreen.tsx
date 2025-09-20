import React from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useNotionData } from '../hooks/useNotionData';
import Header from '../components/Header';

export default function HomeScreen() {
  const { data, loading } = useNotionData();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
