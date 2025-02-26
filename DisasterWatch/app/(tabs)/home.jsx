import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import HeaderBar from "../../components/headerBar";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Header */}
      <HeaderBar
        title="DisasterWatch"
        subtitle="Your safety companion"
        showBack={false}
        containerStyle={{ marginTop: 32 }}
      />

      {/* Active Warnings Section */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Active Warnings</Text>
            <Button mode="text" onPress={() => router.push("/feed")}>
              See All
            </Button>
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={{ padding: 20 }} />
          ) : error ? (
            <Text style={{ color: "red", padding: 20 }}>{error}</Text>
          ) : (
            <Text style={{ padding: 20 }}>No active warnings</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  scrollView: {
    backgroundColor: "#ffffff",
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
};

export default Home;
