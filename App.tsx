import React from 'react';
import { PaperProvider } from 'react-native-paper';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthNavigator />
    </PaperProvider>
  );
}
