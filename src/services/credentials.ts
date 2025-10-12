import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'NOTION_API_KEY';
const PAGE_ID_KEY = 'NOTION_PAGE_ID';

export const saveCredentials = async (apiKey: string, pageId: string) => {
  console.log(`SAVING credentials... API Key: ${apiKey ? 'SET' : 'NULL'}, Page ID: ${pageId ? 'SET' : 'NULL'}`);
  await AsyncStorage.setItem(API_KEY, apiKey);
  await AsyncStorage.setItem(PAGE_ID_KEY, pageId);
  console.log('Credentials SAVED.');
};

export const getCredentials = async () => {
  console.log('GETTING credentials...');
  const apiKey = await AsyncStorage.getItem(API_KEY);
  const pageId = await AsyncStorage.getItem(PAGE_ID_KEY);
  console.log(`Credentials FOUND - API Key: ${apiKey ? 'FOUND' : 'NULL'}, Page ID: ${pageId ? 'FOUND' : 'NULL'}`);
  return { apiKey, pageId };
};

export const clearCredentials = async () => {
  console.log('CLEARING credentials...');
  await AsyncStorage.removeItem(API_KEY);
  await AsyncStorage.removeItem(PAGE_ID_KEY);
  console.log('Credentials CLEARED.');
};
