import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';

export function Transaction() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [originAccount, setOriginAccount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate.toISOString());
    hideDatePicker();
  };

  return (
    <View className='flex-1 p-4 items-center justify-center'>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        className='w-full p-2 border rounded'
      />
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
        className='w-full p-2 border rounded mt-2'
      />
      <TouchableOpacity
        onPress={showDatePicker}
        className='w-full p-2 border rounded mt-2'
      >
        <Text>
          {date ? new Date(date).toLocaleString() : 'Select Date'}
        </Text>
      </TouchableOpacity>
      {/* <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="datetime"
      onConfirm={handleDateConfirm}
      onCancel={hideDatePicker}
    />
    <RNPickerSelect
      placeholder={{ label: 'Select Type', value: null }}
      onValueChange={(value) => setType(value)}
      items={[
        { label: 'Deposit', value: 'Deposit' },
        { label: 'Withdraw', value: 'Withdraw' },
        { label: 'Transfer', value: 'Transfer' },
      ]}
      className='w-full p-2 border rounded mt-2'
    /> */}
      <View className='w-full mt-2 flex-row items-center justify-between'>
        <TextInput
          placeholder="Origin Account"
          value={originAccount}
          onChangeText={(text) => setOriginAccount(text)}
          className='w-1/2 p-2 border rounded'
        />
        <View
          className='w-1/12 h-12 bg-transparent items-center justify-center'
          style={{
            backgroundColor:
              type === 'Withdraw'
                ? 'red'
                : type === 'Deposit'
                  ? 'green'
                  : type === 'Transfer'
                    ? 'blue'
                    : 'transparent',
          }}
        />
        <TextInput
          placeholder="Destination Account"
          value={destinationAccount}
          onChangeText={(text) => setDestinationAccount(text)}
          className='w-1/2 p-2 border rounded'
        />
      </View>
    </View>
  );
}
