
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { saveCredentials } from '../services/credentials';

type ConfigScreenProps = {
  onConfigured: () => void;
};

export default function ConfigScreen({ onConfigured }: ConfigScreenProps) {
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');

  const handleSave = async () => {
    if (apiKey && databaseId) {
      await saveCredentials(apiKey, databaseId);
      onConfigured();
    } else {
      Alert.alert('Error', 'Please enter both API Key and Database ID.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Notion API Key"
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Notion Database ID"
        value={databaseId}
        onChangeText={setDatabaseId}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
