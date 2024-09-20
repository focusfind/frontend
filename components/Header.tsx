import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>📍 FocusFind</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "black",
    padding: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
});

export default Header;
