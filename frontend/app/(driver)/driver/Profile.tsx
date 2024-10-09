import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Profile</Text>
      <Text className="mt-4">Name: John Doe</Text>
      <Text className="mt-2">Vehicle: Sedan (ABC123)</Text>

      <TouchableOpacity className="mt-8 bg-yellow-500 px-4 py-2 rounded">
        <Text className="text-white">Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
