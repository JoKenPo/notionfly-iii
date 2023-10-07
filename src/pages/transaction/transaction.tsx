import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';

import { Button, Surface, Stack } from '@react-native-material/core';
import React, { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { notion } from '../../libs/notion';
import { NotionContext } from '../../contexts/NotionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Transaction() {

  const [taskTitle, setTaskTitle] = React.useState('');
  const [secretKey, setSecretKey] = React.useState('');
  const [databaseId, setDatabaseId] = React.useState('');
  const notionCore = useContext(NotionContext);

  // console.log('notionCore: ', notionCore);

  AsyncStorage.getItem('secretKey')
    .then((value) => setSecretKey(value));
  AsyncStorage.getItem('databaseId')
    .then((value) => setDatabaseId(value));

  const createTask = async (title: string) => {
    try {
      await notion.pages.create(NewTransaction(title));
      console.log('task created');
    } catch (e) {
      console.log(`error when trying to create the task : ${e}`);
    }

    setTaskTitle('');
  };

  function NewTransaction(title: string) {
    return {
      parent: {
        type: 'database_id',
        database_id: 'f25f0022d43d4bd48df8d0f66b4f68e8',
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        // Context: {
        //   multi_select: [{name: '⛏ Task'}],
        // },
      },
    } as CreatePageParameters;
  }

  return (
    <Stack fill center spacing={2}>
      <Surface elevation={4} category="medium" style={styles.card} className="w-auto p-2">
        <Text>Enter a task name: </Text>
        <Text>{secretKey}</Text>
        <Text>{databaseId}</Text>
        <View className="bg-white border-b border-black">
          <TextInput
            editable
            // multiline
            // numberOfLines={5}
            maxLength={300}
            onSubmitEditing={(e) => createTask(e.nativeEvent.text)}
            onChangeText={(text: string) => setTaskTitle(text)}
            value={taskTitle}
            className="p-2"
          />
        </View>
        <Button
          title="Add to notion"
          style={{ alignSelf: 'center', marginTop: 40 }}
          onPress={() => createTask(taskTitle)}
        />
      </Surface>
    </Stack>
  );
}

const styles = StyleSheet.create({
  card: { width: '95%', padding: 20 },
});


