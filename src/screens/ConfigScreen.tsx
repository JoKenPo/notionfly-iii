import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { saveCredentials } from '../services/credentials';
import Logo from '../../assets/logo.svg';

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
      <Logo width={120} height={60} style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Welcome to Notionfly III</Text>
      <Text style={styles.subtitle}>Please enter your credentials:</Text>
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
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});