import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
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

const Signup: React.FC = () => {
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [navigating, setNavigating] = useState<boolean>(false); // State to handle navigation loading

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const {
    loading: userLoading,
    isLoggedIn,
    setIsLoggedIn,
    setUser,
  } = useUser();

  if (!userLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignup = async () => {
    setLoading(true);

    let valid = true;
    let errors = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    };

    if (!firstname.trim()) {
      errors.firstname = "First Name is required.";
      valid = false;
    }
    if (!lastname.trim()) {
      errors.lastname = "Last Name is required.";
      valid = false;
    }
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
      const data = {
        firstname,
        lastname,
        email,
        password,
      };
      axios
        .post("http://192.168.100.25:3000/auth/register", { data })
        .then((response) => {
          console.log(response.data.message);
          SecureStore.setItemAsync("isLoggedIn", "true");
          SecureStore.setItemAsync("token", response.data.token);
          setUser(response.data.user);
          setIsLoggedIn(true);
          router.push("/home");
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

      setLoading(false);
    }
  };

  const handleNavigation = () => {
    setNavigating(true); // Start showing the loading spinner
    router.push("/signin");
    setNavigating(false); // Stop showing spinner after navigation completes
  };

  return (
    <SafeAreaView className="bg-white h-full px-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className=" -left-0">
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <View className="mt-4">
          <Text className="text-3xl font-bold">Create your</Text>
          <Text className="text-3xl font-bold">Account</Text>
        </View>

        {/* Input Fields */}
        <View className="mt-4">
          <TextInput
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstname}
            className="bg-transparent border-b border-gray-300 rounded-b-lg py-4 px-5 text-black"
          />
          {errors.firstname ? (
            <Text className="text-red-500 text-xs font-semibold mt-1 ml-1">
              {errors.firstname}
            </Text>
          ) : null}

          <TextInput
            onChangeText={setLastname}
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={lastname}
            className="bg-transparent border-b border-gray-300 rounded-b-lg  py-4 px-5 text-black"
          />
          {errors.lastname ? (
            <Text className="text-red-500 text-xs font-semibold mt-1 ml-1">
              {errors.lastname}
            </Text>
          ) : null}

          <TextInput
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            className="bg-transparent border-b border-gray-300 rounded-b-lg  py-4 px-5 text-black"
          />
          {errors.email ? (
            <Text className="text-red-500 text-xs font-semibold mt-1 ml-1">
              {errors.email}
            </Text>
          ) : null}

          <TextInput
            secureTextEntry={true}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            className="bg-transparent border-b border-gray-300 rounded-b-lg  py-4 px-5 text-black"
          />
          {errors.password ? (
            <Text className="text-red-500 text-xs font-semibold mt-1 ml-1">
              {errors.password}
            </Text>
          ) : null}
        </View>

        {/* Remember Me Switch */}
        <View className="flex flex-row items-center mt-6">
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text className="ml-3 text-black">Remember me</Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="bg-yellow-500 items-center justify-center p-4 w-full rounded-lg mt-6"
          onPress={handleSignup}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold">Sign up</Text>
          )}
        </TouchableOpacity>

        {/* Or Continue With */}
        <View className="flex-row items-center justify-center mt-4">
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
        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-500">Already have an account?</Text>
          <TouchableOpacity onPress={handleNavigation} disabled={navigating}>
            {navigating ? (
              <ActivityIndicator size="small" color="#yellow" />
            ) : (
              <Text className="text-yellow-500 font-semibold ml-1">Sign in</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
