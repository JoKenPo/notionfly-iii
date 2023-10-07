import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu } from 'lucide-react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Dashboards } from '../pages/dashboards/dashboards';
import { Transaction } from '../pages/transaction/transaction';

const Drawer = createDrawerNavigator();

export function CustomDrawerContent({ navigation }) {
  return (
    <View className="flex-1">
      {/* Cabeçalho do Menu Lateral */}
      <View className="p-4">
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          {/* Ícone de Fechar o Menu */}
          <Menu size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Links para as Páginas */}
      <TouchableOpacity
        className="p-4 border-b border-gray-300"
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text className="text-lg">
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-4"
        onPress={() => navigation.navigate('Transaction')}
      >
        <Text className="text-lg">
          Transaction
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function Navigation() {

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Dashboards"
        useLegacyImplementation
        drawerContent={({ navigation }) => (
          <CustomDrawerContent navigation={navigation} />
        )}
      >
        <Drawer.Screen name="Dashboards" component={Dashboards} />
        <Drawer.Screen name="Transaction" component={Transaction} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export function Header({ title }) {
  return (
    <View className="flex-row items-center justify-center py-4">
      <TouchableOpacity
        className="absolute left-4"
        onPress={() => navigation.closeDrawer()}
      >
        {/* Botão de Menu */}
        <Menu size={24} color="black" />
      </TouchableOpacity>
      <Text className="text-xl font-bold">{title}</Text>

      <Navigation />
    </View>
  );
}
