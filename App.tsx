import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { Marker } from "react-native-maps";
import Header from "./components/Header";
import NewSpotModal from "./components/NewSpotModal";
import Geolocation from "react-native-geolocation-service";

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

const defaultLocation = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};


export default function App() {

  const [location, setLocation] = useState<Region>(defaultLocation);

  const getLocation = async () => {
    const result = await Geolocation.requestAuthorization("whenInUse");

      if (result) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
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
        console.log(location);
      }
  };

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
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={location}
        scrollEnabled={true}
        onRegionChange={(newLocation) => setLocation(newLocation)}
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
        <View
          style={{ marginTop: 10, padding: 10, borderRadius: 10, width: "40%" }}
        >
          <Button title="Get Location" onPress={getLocation} />
        </View>
        <Text>latitude: </Text>
        <Text>longitude: </Text>
        <View
          style={{ marginTop: 10, padding: 10, borderRadius: 10, width: "40%" }}
        >
          <Button title="Send Location" />
        </View>
      </View>

      <NewSpotModal
        buttonText="New Spot"
        location={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
}
