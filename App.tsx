import React from 'react';
import { PaperProvider } from 'react-native-paper';
import AuthNavigator from './src/navigation/AuthNavigator';
import { NotionProvider } from './src/contexts/NotionContext';

export default function App() {
  return (
    <PaperProvider>
      <NotionProvider>
        <AuthNavigator />
      </NotionProvider>
    </PaperProvider>
  );
}
