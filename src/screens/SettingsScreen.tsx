import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { clearCredentials } from '../services/credentials';

type SettingsScreenProps = {
  onClear: () => void;
};

export default function SettingsScreen({ onClear }: SettingsScreenProps) {
  const handleClear = async () => {
    await clearCredentials();
    onClear();
  };

  return (
    <View style={styles.container}>
      <Button title="Clear Credentials" onPress={handleClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
