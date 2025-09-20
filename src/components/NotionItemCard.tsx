import React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface NotionItemCardProps {
  item: {
    id: string;
    title: string;
    value: string;
  };
}

const NotionItemCard: React.FC<NotionItemCardProps> = ({ item }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
          {item.value}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default NotionItemCard;
