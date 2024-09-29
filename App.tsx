import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Alert, View, SafeAreaView, Pressable, Button, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import Header from "./components/Header";
import NewSpotModal from "./components/NewSpotModal";
import Geolocation from "react-native-geolocation-service";
import { styles } from "./styles/appStyles";
import Map from "./components/Map"

export interface SpotData {
  name: string;
  type: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  busy_index: number;
}

export default function App() {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const watchId = useRef<number | null>(null);

  const [spots, setSpots] = useState<SpotData[]>([
    {
      name: "Marker 1",
      type: "coffee shop",
      coordinates: { latitude: 37.78825, longitude: -122.4324 },
      description: "This is marker 1",
      busy_index: 75,
    },
    {
      name: "Marker 2",
      type: "library",
      coordinates: { latitude: 37.789, longitude: -122.4334 },
      description: "This is marker 2",
      busy_index: 65,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const resetLocation = async () => {
    const result = await Geolocation.requestAuthorization("whenInUse");

    if (result === 'granted') {
      Geolocation.getCurrentPosition(
        (position) => {
          if (position && position.coords) {
            const { latitude, longitude } = position.coords;
            setRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            });
            // mapRef.current?.animateToRegion(newRegion, 1000);
          } else {
            console.log("Invalid position object:", position);
            Alert.alert("Error", "Failed to get valid location data.");
          }
        },
        (error) => {
          console.log(error.code, error.message);
          Alert.alert("Error", "Failed to get location data.")
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else {
      Alert.alert("Permission denied", "Location permission is required.");
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      const result = await Geolocation.requestAuthorization("whenInUse");
      if (result === 'granted') {
        startLocationTracking();
        resetLocation(); // Center view on current location
      } else {
        Alert.alert("Permission denied", "Location permission is required.");
      }
    };

    const startLocationTracking = () => {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          if (position && position.coords) {
            const { latitude, longitude } = position.coords;
            setRegion(prevRegion => ({
              latitude,
              longitude,
              latitudeDelta: prevRegion.latitudeDelta,
              longitudeDelta: prevRegion.longitudeDelta,
            }));
          } else {
            console.log("Invalid position object:", position);
          }
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
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current); // Clean up when the component unmounts
      }
    };
  }, []);

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header />
        <Map
          style={styles.map}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
        >
          {spots.map((spot, index) => (
            <Marker
              key={index}
              coordinate={spot.coordinates}
              title={spot.name}
              description={spot.description}
            />
          ))}
        </Map>

        <Text style={{ color: "white" }}>latitude: {region.latitude} </Text>
        <Text style={{ color: "white" }}>longitude: {region.longitude} </Text>


        <NewSpotModal
          location={{
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
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
