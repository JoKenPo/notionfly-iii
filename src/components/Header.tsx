import React from 'react';
import { View, StyleSheet } from 'react-native';
import Logo from '../../assets/logo.svg';

const Header = () => {
  return (
    <View style={styles.container}>
      <Logo width={120} height={40} testID="header-logo" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default Header;
