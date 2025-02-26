import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

export default function DisasterFeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Placeholder effect
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Disaster Feed</Text>
      {/* Add further components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
});
