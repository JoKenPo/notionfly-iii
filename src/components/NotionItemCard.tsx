import React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ITransaction } from '../types';

interface NotionItemCardProps {
  item: ITransaction;
}

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const NotionItemCard: React.FC<NotionItemCardProps> = ({ item }) => {
  const theme = useTheme();
  const isExpense = item.amount < 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <Text variant="titleMedium" style={styles.title}>
            {item.name}
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: isExpense ? theme.colors.error : 'green',
              fontWeight: 'bold',
            }}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {item.category.join(', ')}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {new Date(item.date).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
});

export default NotionItemCard;
