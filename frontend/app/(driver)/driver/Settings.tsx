import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    router.replace('/auth/signin');
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Settings</Text>

      <TouchableOpacity className="mt-8 bg-red-500 px-4 py-2 rounded" onPress={handleLogout}>
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
