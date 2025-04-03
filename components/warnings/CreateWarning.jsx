import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  Text,
  useTheme,
  DropDown,
  Menu,
} from "react-native-paper";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import wardash from "../../api/services/wardash";

const CreateWarning = ({ visible, onDismiss, onWarningCreated }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSeverityMenu, setShowSeverityMenu] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    disaster_category: "",
    severity: "",
    affected_locations: [
      {
        latitude: null,
        longitude: null,
        address: {
          city: "",
          district: "",
          province: "",
          details: "",
        },
      },
    ],
  });

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const disasterCategories = [
    { label: "Flood", value: "flood" },
    { label: "Fire", value: "fire" },
    { label: "Earthquake", value: "earthquake" },
    { label: "Landslide", value: "landslide" },
    { label: "Cyclone", value: "cyclone" },
  ];

  const severityLevels = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Critical", value: "critical" },
  ];

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      updateFormLocation(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
      );
      await getAddressFromCoords(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
      );
    } catch (err) {
      setError("Error getting location");
      console.error(err);
    }
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (response[0]) {
        const address = response[0];
        setFormData((prev) => ({
          ...prev,
          affected_locations: [
            {
              ...prev.affected_locations[0],
              latitude,
              longitude,
              address: {
                city: address.city || address.subregion || "",
                district: address.district || address.region || "",
                province: address.region || "",
                details: `${address.street || ""} ${address.name || ""}`.trim(),
              },
            },
          ],
        }));
      }
    } catch (err) {
      console.error("Error getting address:", err);
    }
  };

  const updateFormLocation = (latitude, longitude) => {
    setFormData((prev) => ({
      ...prev,
      affected_locations: [
        {
          ...prev.affected_locations[0],
          latitude,
          longitude,
        },
      ],
    }));
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    updateFormLocation(latitude, longitude);
    getAddressFromCoords(latitude, longitude);
  };

  React.useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!formData.disaster_category) {
      setError("Please select a disaster category");
      return;
    }
    if (!formData.severity) {
      setError("Please select a severity level");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const warningData = {
        ...formData,
        expected_duration: {
          start_time: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      };

      const response = await wardash.post("/warnings", warningData);

      if (response.data) {
        onWarningCreated?.();
        onDismiss();
        setFormData({
          title: "",
          description: "",
          disaster_category: "",
          severity: "",
          affected_locations: [
            {
              latitude: null,
              longitude: null,
              address: {
                city: "",
                district: "",
                province: "",
                details: "",
              },
            },
          ],
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to create warning",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Create New Warning</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            <View style={styles.formSection}>
              <TextInput
                label="Warning Title"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, title: text }))
                }
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <Menu
                visible={showCategoryMenu}
                onDismiss={() => setShowCategoryMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setShowCategoryMenu(true)}
                    style={styles.dropdownButton}
                  >
                    {formData.disaster_category
                      ? disasterCategories.find(
                          (cat) => cat.value === formData.disaster_category,
                        )?.label
                      : "Select Disaster Category"}
                  </Button>
                }
              >
                {disasterCategories.map((category) => (
                  <Menu.Item
                    key={category.value}
                    onPress={() => {
                      setFormData((prev) => ({
                        ...prev,
                        disaster_category: category.value,
                      }));
                      setShowCategoryMenu(false);
                    }}
                    title={category.label}
                  />
                ))}
              </Menu>

              <Menu
                visible={showSeverityMenu}
                onDismiss={() => setShowSeverityMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setShowSeverityMenu(true)}
                    style={styles.dropdownButton}
                  >
                    {formData.severity
                      ? severityLevels.find(
                          (sev) => sev.value === formData.severity,
                        )?.label
                      : "Select Severity Level"}
                  </Button>
                }
              >
                {severityLevels.map((level) => (
                  <Menu.Item
                    key={level.value}
                    onPress={() => {
                      setFormData((prev) => ({
                        ...prev,
                        severity: level.value,
                      }));
                      setShowSeverityMenu(false);
                    }}
                    title={level.label}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Location Details</Text>
              {location && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    }}
                    onPress={handleMapPress}
                  >
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                    />
                  </MapView>
                </View>
              )}

              <TextInput
                label="City"
                value={formData.affected_locations[0].address.city}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    affected_locations: [
                      {
                        ...prev.affected_locations[0],
                        address: {
                          ...prev.affected_locations[0].address,
                          city: text,
                        },
                      },
                    ],
                  }))
                }
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="District"
                value={formData.affected_locations[0].address.district}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    affected_locations: [
                      {
                        ...prev.affected_locations[0],
                        address: {
                          ...prev.affected_locations[0].address,
                          district: text,
                        },
                      },
                    ],
                  }))
                }
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Province"
                value={formData.affected_locations[0].address.province}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    affected_locations: [
                      {
                        ...prev.affected_locations[0],
                        address: {
                          ...prev.affected_locations[0].address,
                          province: text,
                        },
                      },
                    ],
                  }))
                }
                mode="outlined"
                style={styles.input}
              />
            </View>
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            Create Warning
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxHeight: "80%",
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 16,
  },
  formSection: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
  dropdownButton: {
    width: "100%",
    marginVertical: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
});

export default CreateWarning;
