import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUser } from "@/context/userContext";
import { Redirect } from "expo-router";

const Signin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [validation, setValidation] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const {
    loading: userLoading,
    isLoggedIn,
    setUser,
    setIsLoggedIn,
  } = useUser();

  if (!userLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignin = async () => {
    let valid = true;
    setValidation(null);
    let errors = {
      email: "",
      password: "",
    };

    if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      setLoading(true);

      try {        const res = await axios.post("http://192.168.100.25:3000/auth/login", {
          email,
          password,
        });

        await SecureStore.setItemAsync("token", res.data.token);
        await SecureStore.setItemAsync("isLoggedIn", "true");
        setUser(res.data.user);
        setIsLoggedIn(true);
        router.push("/");
      } catch (err: any) {
        if (err.response && err.response.data) {
          setValidation(err.response.data.error);
        } else {
          setValidation("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="bg-white h-full px-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="mt-4 ml-2">
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <View className="mt-4">
          <Text className="text-3xl font-bold">Login to your</Text>
          <Text className="text-3xl font-bold">Account</Text>
        </View>

        {/* Email Input */}
        <View className="mt-8">
          <View className="flex flex-row items-center bg-gray-100 rounded-lg px-4 py-4 mt-4">
            <Icon name="envelope" size={20} color="gray" />
            <TextInput
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              className="ml-3 text-black flex-grow"
            />
          </View>
          {errors.email ? (
            <Text className="text-red-500 font-semibold ml-0.5 mt-2">
              {errors.email}
            </Text>
          ) : null}

          {/* Password Input */}
          <View className="flex flex-row items-center bg-gray-100 rounded-lg px-4 py-4 mt-4 justify-between">
            <Icon name="lock" size={20} color="gray" />
            <TextInput
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              className="ml-3 text-black flex-grow"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Icon name="eye-slash" size={20} color="gray" />
              ) : (
                <Icon name="eye" size={20} color="gray" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text className="text-red-500 font-semibold ml-0.5 mt-2">
              {errors.password}
            </Text>
          ) : null}
        </View>

        {/* Remember Me Switch */}
        <View className="flex flex-row items-center mt-6">
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text className="ml-3 text-black">Remember me</Text>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className="bg-yellow-500 items-center justify-center p-4 w-full rounded-lg mt-6"
          onPress={handleSignin}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold">Sign in</Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password Link */}
        {/* <View className="mt-4 items-center">
          <TouchableOpacity onPress={}>
            <Text className="text-yellow-500 font-semibold">Forgot the password?</Text>
          </TouchableOpacity>
        </View> */}

        {/* Or Continue with */}
        <View className="flex-row items-center justify-center mt-8">
          <View className="flex-grow h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or continue with</Text>
          <View className="flex-grow h-px bg-gray-300" />
        </View>

        {/* Social Media Login Buttons */}
        <View className="flex-row justify-around mt-6">
          <TouchableOpacity className="bg-blue-600 p-4 rounded-full">
            <Icon name="facebook" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 p-4 rounded-full border border-gray-300">
            <Icon name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 p-4 rounded-full border border-gray-300">
            <Icon name="apple" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Signup Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-500">Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="text-yellow-500 font-semibold ml-1">Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
