import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Plus } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

import { Transaction } from '../pages/transaction/transaction';
import { Dashboards } from '../pages/dashboards/dashboards';
import { TouchableOpacity, View } from 'react-native';

const CustomTabButton = ({ children, onPress }) => (
  <TouchableOpacity
    className="justify-center items-center"
    onPress={onPress}
  >
    <View>
      {children}
    </View>
  </TouchableOpacity>
);

export function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboards" component={Dashboards} />
      <Tab.Screen name="Transaction" component={Transaction}
        options={{
          tabBarIcon: ({ focused }) => (
            <Plus size={24} color="white" className="m-2" />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
