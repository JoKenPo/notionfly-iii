import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

export function AddButton() {
  const navigation = useNavigation(); // Inicialize a navegação
  const onPress = () => {
    // navigation.navigate('Tab', { screen: 'Transaction' });
    navigation.navigate('Drawer', { screen: 'Transaction' });
    // navigation.navigate('Transaction');
  };

  return (
    <TouchableOpacity
      className="absolute right-4 bottom-4 rounded-xl bg-blue-500 p-2 flex items-center justify-center"
      onPress={onPress}
    >
      {/* Ícone PlusCircle */}
      <Plus size={24} color="white" className="m-2" />

    </TouchableOpacity>
  );
}
