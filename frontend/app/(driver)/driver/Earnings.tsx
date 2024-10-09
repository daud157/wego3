import React from 'react';
import { View, Text } from 'react-native';

const EarningsScreen = () => {
  const earnings = 1200; // Example earnings data

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Earnings</Text>
      <Text className="mt-4">Total Earnings: ${earnings}</Text>
    </View>
  );
};

export default EarningsScreen;
