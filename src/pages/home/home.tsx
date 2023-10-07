import { useState } from 'react';
// import { getMainDatabase } from '../../libs/notion';
import { Surface, Stack } from '@react-native-material/core';
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

export function Home() {
  const [taskTitle, setDatabase] = useState('');


  console.log('Querying database...');
  // getMainDatabase();

  return (
    <Stack fill center spacing={2}>
      <Surface elevation={4} category="medium" >
        <Text>Enter a task name: </Text>
        <View />
      </Surface>
    </Stack>
  );
}
