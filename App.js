import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { Marker } from "react-native-maps";
import Header from "./components/Header";
import NewSpotModal from "./components/NewSpotModal";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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

export default function App() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState([
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
      <View style={styles.contentContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          region={region}
          onRegionChange={(newRegion) => setRegion(newRegion)}
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

        <NewSpotModal
          buttonText="New Spot"
          location={{ latitude: region.latitude, longitude: region.longitude }}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </SafeAreaView>
  );
}
