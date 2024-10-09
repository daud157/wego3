import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useUser } from "@/context/userContext";
import { Redirect, router } from "expo-router";

const Index = () => {
  const { user, loading, isLoggedIn } = useUser();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-xl font-bold">Loading...</Text>
      </View>
    );
  }

  if (isLoggedIn) {
    return user?.currentProfileStatus === "driver" ? <Redirect href="/driver" /> : <Redirect href="/home" />;
  }

  const handlePress = () => {
    router.push('/signin');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="relative w-full h-full justify-center items-center">
          {/* Logo Container */}
          <View className="relative w-1/2 h-1/2 justify-center items-center z-20">
            <Image source={require('../assets/images/Logo.png')} className="w-full h-full" resizeMode="contain" />

            {/* Background Circles around Logo */}
            <View className="absolute w-10 h-10 bg-yellow-400 opacity-60 rounded-full top-4 -left-16" />
            <View className="absolute w-4 h-4 bg-yellow-400 opacity-60 rounded-full top-40 -left-16" />

            <View className="absolute w-3 h-3 bg-yellow-400 opacity-60 rounded-full top-0 right-18" />
            <View className="absolute w-10 h-10 bg-yellow-400 opacity-60 rounded-full bottom-12 -right-16" />
            <View className="absolute w-8 h-8 bg-yellow-400 opacity-60 rounded-full bottom-10 -left-12" />

            <View className="absolute w-4 h-4 bg-yellow-400 opacity-60 rounded-full bottom-4 right-2" />
            <View className="absolute w-4 h-4 bg-yellow-400 opacity-60 rounded-full -bottom-0 right-18" />

            <View className="absolute w-8 h-8 bg-yellow-400 opacity-60 rounded-full top-16 left-52" />
            <View className="absolute w-4 h-4 bg-yellow-400 opacity-60 rounded-full top-0 left-40" />
            <View className="absolute w-5 h-5 bg-yellow-400 opacity-60 rounded-full top-40 left-60" />


          </View>

          {/* Continue Button */}
          <TouchableOpacity onPress={handlePress} className="mt-20 bg-yellow-400 py-2 px-6 rounded-full">
            <Text className="text-lg font-bold text-black text-center">Let's Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
