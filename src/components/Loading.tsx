import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export function Loading() {
  return (
    <ActivityIndicator size="large" color="#000" />
  );
}
