import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export function FirstAccess() {
  const [secretKey, setSecretKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');

  const navigation = useNavigation(); // Inicialize a navegação

  // Carregar as informações salvas ao iniciar a tela
  useEffect(() => {
    const loadSavedInfo = async () => {
      try {
        const savedSecretKey = await AsyncStorage.getItem('secretKey');
        const savedDatabaseId = await AsyncStorage.getItem('databaseId');

        if (savedSecretKey !== null && savedDatabaseId !== null) {
          setSecretKey(savedSecretKey);
          setDatabaseId(savedDatabaseId);

          // navigation.navigate('Drawer', { screen: 'Dashboards' });
        }
      } catch (error) {
        console.error('Erro ao carregar informações salvas:', error);
      }
    };

    loadSavedInfo();
  }, []);

  const handleLogin = async () => {
    // Salvar as informações inseridas localmente
    try {
      await AsyncStorage.setItem('secretKey', secretKey);
      await AsyncStorage.setItem('databaseId', databaseId);
      console.log('Informações salvas com sucesso.');

      navigation.navigate('Drawer', { screen: 'Dashboards' });
    } catch (error) {
      console.error('Erro ao salvar informações:', error);
    }

    // Aqui você pode adicionar lógica para processar os dados inseridos e fazer a autenticação, por exemplo.
    // Lembre-se de validar e tratar os dados antes de enviá-los.
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Image source={require('../../../assets/images/logo.png')} className="w-24 h-12 mb-4" />
      <Text className="text-lg text-center mb-4">
        Bem-vindo ao meu aplicativo. Insira suas credenciais:
      </Text>
      <TextInput
        className="w-full h-10 border border-gray-400 rounded px-2 mb-2"
        placeholder="Secret Key"
        value={secretKey}
        onChangeText={(text) => setSecretKey(text)}
      />
      <TextInput
        className="w-full h-10 border border-gray-400 rounded px-2 mb-2"
        placeholder="Database ID"
        value={databaseId}
        onChangeText={(text) => setDatabaseId(text)}
      />
      <TouchableOpacity
        className="w-full h-10 bg-blue-500 rounded items-center justify-center"
        onPress={handleLogin}
      >
        <Text className="text-white font-bold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
