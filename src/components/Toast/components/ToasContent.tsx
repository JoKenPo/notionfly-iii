/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions} from 'react-native';

import {Toast, ToastType, ToastPosition} from '@services';

import { View, ScrollView, Text } from 'react-native';


const MAX_WIDTH = Dimensions.get('screen').width * 0.9;

interface Props {
  toast: Toast;
}
export function ToasContent({toast}: Props) {
  const position: ToastPosition = toast?.position || 'top';
  const type: ToastType = toast?.type || 'success';

  return (
    <View {...$boxStyle} style={[{[position]: 100}]}>
      {/* <Icon {...mapTypeToIcon[type]} /> */}
      <Text style={{flexShrink: 1}}>
        {toast?.message}
      </Text>
    </View>
  );
}

const mapTypeToIcon: Record<ToastType, IconProps> = {
  success: {
    color: 'success',
    name: 'checkRound',
  },
  error: {
    color: 'error',
    name: 'errorRound',
  },
};

const $boxStyle = {
  backgroundColor: 'background',
  alignItems: 'center',
  padding: 's16',
  borderRadius: 's16',
  flexDirection: 'row',
  opacity: 0.95,
  maxWidth: MAX_WIDTH,
};
