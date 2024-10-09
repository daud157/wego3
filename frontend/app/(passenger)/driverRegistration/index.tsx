import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@/context/userContext";
import { Redirect } from "expo-router";

const Signup: React.FC = () => {
  const [licenseNumber, setlicenseNumber] = useState<string>("");
  const [vehicleType, setvehicleType] = useState<string>("");
  const [vehicleNumber, setvehicleNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const [errors, setErrors] = useState({
    licenseNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    password: "",
  });

  const { setUser, user } = useUser();

  //   if (user?.isDriver) {
  //     return <Redirect href="/home" />;
  //   }

  const getToken = async (): Promise<string | null> => {
    const token = await SecureStore.getItemAsync("token");
    return token || null;
  };

  const handleSubmit = async () => {
    setLoading(true);

    let valid = true;
    let errors = {
      licenseNumber: "",
      vehicleType: "",
      vehicleNumber: "",
      password: "",
    };

    if (!licenseNumber.trim()) {
      errors.licenseNumber = "Please Enter Licence Number.";
      valid = false;
    }
    if (!vehicleType.trim()) {
      errors.vehicleType = "Please Enter Vehicle Type.";
      valid = false;
    }
    if (!vehicleNumber.trim()) {
      errors.vehicleNumber = "Please Enter Vehicle Number.";
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      const token = await getToken();
      console.log("🚀 ~ handleSubmit ~ token:", token);

      if (!token) {
        alert("Something went wrong. Please try again later.");
        return;
      }
      const data = {
        licenseNumber,
        vehicleType,
        vehicleNumber,
      };
      axios
        .post("http://192.168.100.25:3000/auth/addDriverProfile", {
          token,
          data,
        })
        .then((response) => {
          console.log(response.data.message);
          setUser(response.data.data);
          //   router.push("/home");
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

  return (
    <SafeAreaView className="bg-white h-full px-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mt-12">
          <Text className="text-4xl font-bold pb-3 w-full">
            Welcome Captain!
          </Text>
          <Text className="font-normal text-lg text-gray-500">
            Register as a driver to start your journey with us.
          </Text>
        </View>
        <View className="mt-12">
          <TextInput
            onChangeText={setlicenseNumber}
            keyboardType="number-pad"
            placeholder={"License Number"}
            placeholderTextColor={"#000000"}
            value={licenseNumber}
            className="bg-slate-100 shadow-sm text-black rounded-lg py-5 px-5"
          />
          {errors.licenseNumber ? (
            <Text className="text-red-500 text-xs font-semibold ml-0.5 mt-1.5">
              {errors.licenseNumber}
            </Text>
          ) : null}
          <TextInput
            onChangeText={setvehicleType}
            placeholder={"Vehicle Type"}
            placeholderTextColor={"#000000"}
            value={vehicleType}
            className="bg-slate-100 shadow-sm text-black mt-3 rounded-lg py-5 px-5"
          />
          {errors.vehicleType ? (
            <Text className="text-red-500 text-xs font-semibold ml-0.5 mt-1.5">
              {errors.vehicleType}
            </Text>
          ) : null}
          <TextInput
            onChangeText={setvehicleNumber}
            placeholder={"Vehicle Registration Number"}
            placeholderTextColor={"#000000"}
            value={vehicleNumber}
            className="bg-slate-100 shadow-sm text-black mt-3 rounded-lg py-5 px-5"
          />
          {errors.vehicleNumber ? (
            <Text className="text-red-500 text-xs font-semibold ml-0.5 mt-1.5">
              {errors.vehicleNumber}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          className="bg-yellow-500 items-center justify-center p-5 w-full rounded-lg mt-6"
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffff" />
          ) : (
            <Text className="text-white font-bold">Lets Go</Text>
          )}
        </TouchableOpacity>
        <View className="mt-8 flex flex-row items-center justify-center">
          <Text className="text-black">Wanna think again?</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text className="font-extrabold text-yellow-600 ml-1">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
