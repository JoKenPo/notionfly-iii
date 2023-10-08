import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu } from 'lucide-react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Dashboards } from '../pages/dashboards';
import { Transaction } from '../pages/transaction';
// import { TabRoutes } from './tab.routes';
// import { NotionProvider } from '../contexts/NotionContext';

const Drawer = createDrawerNavigator();

export function CustomDrawerContent({ navigation }) {
  return (
    <View className="flex-1 mt-8">
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
        onPress={() => navigation.navigate('Dashboards')}
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

export function DrawerRoutes() {

  return (
    // <NotionProvider>
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: 'blue', // Cor do link ativo no menu
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboards" component={Dashboards} />
      <Drawer.Screen name="Transaction" component={Transaction} />

      {/* <Drawer.Screen name="Tab" component={TabRoutes} /> */}
    </Drawer.Navigator>
    // </NotionProvider>
  );
}
