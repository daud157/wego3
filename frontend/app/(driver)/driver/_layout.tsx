import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import axios from "axios";

import { useUser } from "@/context/userContext";
export function CustomDrawerContent(props: any) {
  const { setUser, setIsLoggedIn, user } = useUser();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("isLoggedIn");
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  const route = async () => {
    const updatedStatus = "passenger";
    const token = await SecureStore.getItemAsync("token");
    axios
      .post("http://192.168.100.25:3000/auth/updateCurrentStatus", {
        token,
        updatedStatus,
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error:", error.response.data.error);
          alert(error.response.data.error);
        } else if (error.request) {
          console.log("Request Error:", error.request);
          alert("No response from server. Please try again later.");
        } else {
          console.log("General Error:", error.message);
          alert("An unexpected error occurred.");
        }
      });

    router.replace("/");
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1 px-4">
        {/* User Profile */}
        <View className="items-center mt-6 mb-4">
          {user ? (
            <>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                className="w-24 h-24 rounded-full"
              />
              <Text className="mt-2 text-lg font-semibold">
                {user.firstname}
              </Text>
              <Text className="text-sm text-gray-500">{user.email}</Text>
            </>
          ) : (
            <Text className="mt-2 text-lg font-semibold">Guest</Text>
          )}
        </View>

        {/* Drawer Links */}
        <View className="mt-4 flex-1">
          <DrawerItemList {...props} />
        </View>

        {/* Logout Button */}
        <View
          className="mb-4"
          style={{
            marginBottom: bottom,
          }}
        >
          <TouchableOpacity
            className="bg-yellow-500 py-3 px-4 rounded-full items-center mb-4"
            onPress={route}
          >
            <Text className="text-white text-lg font-semibold">
              Switch to Passenger
            </Text>
          </TouchableOpacity>
        </View>
        <View
          className="mb-4"
          style={{
            marginBottom: bottom,
          }}
        >
          <TouchableOpacity
            className="bg-yellow-500  py-3 px-4 rounded-full items-center mb-2 "
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

// Drawer navigator setup
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./home";

const Drawer = createDrawerNavigator();
export default function App() {
  const { user } = useUser();

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
      <StatusBar style="dark" />
    </>
  );
}
