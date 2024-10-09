import React, { useEffect, useCallback } from "react";
import { BackHandler, Alert, Platform, View, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useNavigation } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@/context/userContext";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { DrawerActions } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useUser(); // Ensure you have these functions in your context to update the state
  const navigation = useNavigation();

  const drawerAction = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="flex h-screen items-center justify-center relative">
      <TouchableOpacity
        onPress={drawerAction}
        className="absolute top-16 left-8 bg-slate-50 p-2 rounded-full shadow"
      >
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      <Text className="text-4xl text-blue-600 font-bold ">Passenger Side</Text>
      <Text className="text-blue-600 mt-4">
        switch to driver side from the drawer
      </Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
