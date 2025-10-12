import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoryReportScreen from '../screens/CategoryReportScreen';

const Tab = createBottomTabNavigator();

type AppNavigatorProps = {
  onClear: () => void;
};

function AppTabs({ onClear }: AppNavigatorProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transações"
        component={TransactionsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={CategoryReportScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-pie" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ajustes"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}>
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
