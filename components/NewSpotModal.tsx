import React, { useState } from "react";
import {
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { Region } from "react-native-maps";
import Slider from "@react-native-community/slider";

export interface NewSpotModalProps {
  location: Region;
  modalVisible: boolean;
  style?: any;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface coordinates {
  latitude: number;
  longitude: number;
}

interface SpotData {
  name: string;
  type: string;
  description: string;
  coordinates: coordinates;
  busy_index: number;
}

const URL = "http://localhost:42069";

export default function NewSpotModal({ location, modalVisible, setModalVisible }: NewSpotModalProps): JSX.Element {
  const [spotName, setSpotName] = useState<string>("");
  const [spotDescription, setSpotDescription] = useState<string>("");
  const [spotType, setSpotType] = useState<string>("");
  const [busyIndex, setBusyIndex] = useState<number>(0);

  const handleSubmit = async () => {
    if (spotName.trim()) {
      const spotData: SpotData = {
        name: spotName,
        type: spotType,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        description: spotDescription,
        busy_index: busyIndex,
      };

      const jsonData = JSON.stringify(spotData);

      try {
        const response = await fetch(`${URL}/spots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        await response.json();

        Alert.alert(
          spotName,
          `Submitted!\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`
        );
        setModalVisible(false);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          if (error.message.includes("Duplicate entry for latitude/longitude") || error.message.includes("A spot already exists within 100 meters of this location")) {
            Alert.alert("Error", "A spot already here! Contribute to a nearby spot instead?");
          } else if (error.message.includes("Duplicate entry for name")) {
            Alert.alert("Error", "A spot with this name already exists!");
          } else {
            Alert.alert("Error", "Failed to submit the spot, please try again.");
          }
        }
      }
    } else {
      Alert.alert("Error", "Please enter a spot name.");
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add New Spot</Text>
            <TextInput
              style={styles.input}
              onChangeText={setSpotName}
              value={spotName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setSpotDescription}
              value={spotDescription}
              placeholder="Description"
            />
            <TextInput
              style={styles.input}
              onChangeText={setSpotType}
              value={spotType}
              placeholder="Type"
            />
            <Text>{Math.floor(busyIndex)}</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={(value) => setBusyIndex(Math.floor(value))}
              value={busyIndex}
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonSave]}
                onPress={handleSubmit}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonOpen: {
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonSave: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#FF3B30",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
