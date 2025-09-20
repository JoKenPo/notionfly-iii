import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'notionfly-refactored',
  slug: 'notionfly-refactored',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID
  }
};

export default config;
