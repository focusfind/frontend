import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Alert, View, SafeAreaView, Pressable, Button, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import Header from "./components/Header";
import NewSpotModal from "./components/NewSpotModal";
import Geolocation from "react-native-geolocation-service";
import { styles } from "./styles/appStyles";
import Map, { DefaultRegion } from "./components/Map"

interface MarkerData {
  latlng: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
}

export default function App() {
  const [region, setRegion] = useState<Region>(DefaultRegion);
  const [markers, setMarkers] = useState<MarkerData[]>([
    {
      latlng: { latitude: 37.78825, longitude: -122.4324 },
      title: "Marker 1",
      description: "This is marker 1",
    },
    {
      latlng: { latitude: 37.789, longitude: -122.4334 },
      title: "Marker 2",
      description: "This is marker 2",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  let watchId: number | null = null; // Store the watch position id

  const resetLocation = async () => {
    const result = await Geolocation.requestAuthorization("whenInUse");

    if (result) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => {
          console.log(error.code, error.message);
          Alert.alert("Error", "Failed to get location data.")
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      const result = await Geolocation.requestAuthorization("whenInUse");
      if (result) {
        startLocationTracking();
      } else {
        Alert.alert("Permission denied", "Location permission is required.");
      }
    };

    resetLocation; // Center view on current location

    const startLocationTracking = () => {
      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => {
          console.log(error.code, error.message);
          Alert.alert("Error", "Failed to get location data.");
        },
        { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 }
      );
    };

    requestLocationPermission();

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId); // Clean up when the component unmounts
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header />
        <Map
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newLocation) => setRegion(newLocation)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </Map>

        <Text style={{ color: "white" }}>latitude: {region.latitude} </Text>
        <Text style={{ color: "white" }}>longitude: {region.longitude} </Text>


        <NewSpotModal
          location={{
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonOpen} onPress={resetLocation}>
            <Text style={styles.buttonText}>Recenter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOpen} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>New Spot</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView >
  );
}
