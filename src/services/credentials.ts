import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'NOTION_API_KEY';
const DATABASE_ID_KEY = 'NOTION_DATABASE_ID';

export const saveCredentials = async (apiKey: string, databaseId: string) => {
  await AsyncStorage.setItem(API_KEY, apiKey);
  await AsyncStorage.setItem(DATABASE_ID_KEY, databaseId);
};

export const getCredentials = async () => {
  const apiKey = await AsyncStorage.getItem(API_KEY);
  const databaseId = await AsyncStorage.getItem(DATABASE_ID_KEY);
  return { apiKey, databaseId };
};

export const clearCredentials = async () => {
  await AsyncStorage.removeItem(API_KEY);
  await AsyncStorage.removeItem(DATABASE_ID_KEY);
};
