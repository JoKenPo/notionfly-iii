import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

type AppNavigatorProps = {
  onClear: () => void;
};

function AppTabs({ onClear }: AppNavigatorProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} onClear={onClear} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator({ onClear }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <AppTabs onClear={onClear} />
    </NavigationContainer>
  );
}
