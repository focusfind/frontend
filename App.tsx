import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Alert, View, SafeAreaView, Button } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import Header from "./components/Header";
import NewSpotModal from "./components/NewSpotModal";
import Geolocation from "react-native-geolocation-service";
import { getEnforcing } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  hud: {
    alignItems: "center",
  },
  button: {
    position: "absolute",
    justifyContent: "center",
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

interface MarkerData {
  latlng: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
}

const defaultRegion: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const [region, setRegion] = useState<Region>(defaultRegion);
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
      <MapView
        style={styles.map}
        region={region}
        scrollEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChange={(newLocation) => setRegion(newLocation)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>

      <Header />

      <View style={{ backgroundColor: "white" }}>
        <View style={{ marginTop: 10, padding: 10, borderRadius: 10, width: "40%" }}>
          <Button title="Recenter" onPress={resetLocation} />
        </View>
        <Text>latitude: {region.latitude} </Text>
        <Text>longitude: {region.longitude} </Text>
        <View style={{ marginTop: 10, padding: 10, borderRadius: 10, width: "40%" }}>
          <Button title="Send Location" />
        </View>
      </View>

      <NewSpotModal
        buttonText="New Spot"
        location={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
}
