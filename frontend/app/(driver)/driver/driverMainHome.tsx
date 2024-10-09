import React, { useState, useEffect } from 'react';
import { View, Text, Switch, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';

const DriverMainHome = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null); // Driver location
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy passenger location (this should come from your backend)
  const passengerLocation = {
    latitude: 40.730610, 
    longitude: -73.935242
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, [isOnline]);

  // Function to calculate distance using Google Distance Matrix API
  const getDistanceFromDriverToPassenger = async (driverLocation) => {
    const { latitude: driverLat, longitude: driverLng } = driverLocation;
    const { latitude: passengerLat, longitude: passengerLng } = passengerLocation;

    const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${driverLat},${driverLng}&destinations=${passengerLat},${passengerLng}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const distanceData = response.data.rows[0].elements[0].distance;
      const durationData = response.data.rows[0].elements[0].duration;
      
      setDistance({
        distance: distanceData.text,
        duration: durationData.text
      });
    } catch (error) {
      console.error('Error fetching distance:', error);
    }
  };

  // Trigger distance calculation when the driver goes online
  useEffect(() => {
    if (isOnline && location) {
      getDistanceFromDriverToPassenger(location);
    }
  }, [isOnline, location]);

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center text-gray-800">Driver Home</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
      ) : (
        <>
          <Text className="text-lg text-gray-600 mt-4 text-center">Your Location:</Text>
          {location ? (
            <Text className="text-center mt-2 text-gray-700">{`Lat: ${location.latitude}, Lng: ${location.longitude}`}</Text>
          ) : (
            <Text className="text-center mt-2 text-red-500">Location not available</Text>
          )}

          {/* Switch for Online/Offline */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-lg text-gray-800 mr-2">{isOnline ? 'You are Online' : 'You are Offline'}</Text>
            <Switch value={isOnline} onValueChange={setIsOnline} />
          </View>

          {/* Display distance to passenger if available */}
          {isOnline && distance ? (
            <View className="mt-6">
              <Text className="text-center text-lg text-gray-700">{`Distance to Passenger: ${distance.distance}, Duration: ${distance.duration}`}</Text>
            </View>
          ) : null}

          {/* Google Map */}
          <View className="w-full h-64 mt-6 rounded-lg overflow-hidden border border-gray-300">
            <MapView
              style={{ width: '100%', height: '100%' }}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {/* Driver Marker */}
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Your Location"
                description="This is your current location"
              />
              
              {/* Passenger Marker */}
              <Marker
                coordinate={passengerLocation}
                title="Passenger Location"
                description="This is the passenger location"
              />
            </MapView>
          </View>

          {/* Button to Toggle Online/Offline */}
          <TouchableOpacity
            className="bg-yellow-500 p-4 rounded-lg mt-8 flex items-center"
            onPress={() => setIsOnline(!isOnline)}
          >
            <Text className="text-white font-bold text-lg">{isOnline ? 'Go Offline' : 'Go Online'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default DriverMainHome;
