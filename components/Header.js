import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#6200ee",
    padding: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
});

export default Header;
