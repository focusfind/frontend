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

export interface NewSpotModalProps {
  location: Region;
  modalVisible: boolean;
  style?: any,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function NewSpotModal({ location, modalVisible, setModalVisible }: NewSpotModalProps): JSX.Element {
  const [spotName, setSpotName] = useState("");

  function onSave(spotName: string) {
    Alert.alert(
      spotName,
      `Submitted!\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`,
    );
  }

  const handleSave = () => {
    if (spotName.trim()) {
      onSave(spotName);
      setModalVisible(false);
      setSpotName("");
    } else {
      Alert.alert("Error", "Please enter a name for the spot.");
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
              placeholder="Enter spot name"
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonSave]}
                onPress={handleSave}
              >
                <Text style={styles.textStyle}>Save</Text>
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
