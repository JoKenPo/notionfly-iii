import React, { useState, useEffect } from 'react';
import { getCredentials } from '../services/credentials';
import AppNavigator from './AppNavigator';
import ConfigScreen from '../screens/ConfigScreen';
import { View, ActivityIndicator } from 'react-native';

export default function AuthNavigator() {
  const [hasCredentials, setHasCredentials] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCredentials = async () => {
    setLoading(true);
    const { apiKey, databaseId } = await getCredentials();
    setHasCredentials(!!(apiKey && databaseId));
    setLoading(false);
  };

  useEffect(() => {
    checkCredentials();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (hasCredentials) {
    return <AppNavigator onClear={checkCredentials} />;
  }

  return <ConfigScreen onConfigured={checkCredentials} />;
}
