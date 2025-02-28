import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  Text,
  ActivityIndicator,
  useTheme,
  Surface,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import wardash from "../../services/wardash";
import { UserContext } from "../../constants/globalProvider";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  disaster_category: z.enum([
    "flood",
    "fire",
    "earthquake",
    "landslide",
    "cyclone",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  affected_locations: z
    .array(
      z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        address: z.object({
          city: z.string().min(1, "City is required"),
          district: z.string().min(1, "District is required"),
          province: z.string().min(1, "Province is required"),
          details: z.string().optional(),
        }),
      }),
    )
    .min(1, "At least one location must be specified"),
  expected_duration: z.object({
    start_time: z.string(),
    end_time: z.string().optional(),
  }),
});

const CreateWarningDialog = () => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [address, setAddress] = useState(null);
  const [endTime, setEndTime] = useState(new Date());

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      expected_duration: {
        start_time: new Date().toISOString(),
        end_time: "",
      },
    },
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response[0]) {
        const addressData = response[0];
        setAddress({
          city: addressData.city || addressData.subregion || "",
          district: addressData.district || addressData.region || "",
          province: addressData.region || "",
          details:
            `${addressData.street || ""} ${addressData.name || ""}`.trim(),
        });

        setValue("affected_locations.0.address", {
          city: addressData.city || addressData.subregion || "",
          district: addressData.district || addressData.region || "",
          province: addressData.region || "",
          details:
            `${addressData.street || ""} ${addressData.name || ""}`.trim(),
        });
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const onMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setValue("affected_locations.0.latitude", latitude);
    setValue("affected_locations.0.longitude", longitude);
    reverseGeocode(latitude, longitude);
  };

  const handleEndTimeInput = (text) => {
    setValue("expected_duration.end_time", text);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Current user:", user);
      if (!user) {
        throw new Error("User not authenticated");
      }

      const formattedData = {
        ...data,
        created_by: user.user.id,
        expected_duration: {
          start_time: new Date(data.expected_duration.start_time),
          end_time: data.expected_duration.end_time
            ? new Date(data.expected_duration.end_time)
            : undefined,
        },
        affected_locations: [
          {
            latitude: location?.latitude,
            longitude: location?.longitude,
            address: data.affected_locations[0].address,
          },
        ],
      };

      try {
        console.log("Submitting data:", formattedData); // Debug log
        const response = await wardash.post("/warning/", formattedData);
        console.log("Response:", response.data);
        if (response.data) {
          return response.data;
        }
      } catch (error) {
        console.error("Error creating warning:", error);
        if (error.response) {
          throw new Error(
            error.response.data.error || "Failed to create warning",
          );
        }
        throw error;
      }
      setVisible(false);
      reset();
      // Add success notification here
    } catch (error) {
      console.error("Error creating warning:", error);
      // Add error notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        mode="contained"
        onPress={() => setVisible(true)}
        style={styles.createButton}
        icon="plus"
      >
        Create New Warning
      </Button>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Create New Warning
          </Dialog.Title>
          <Dialog.ScrollArea style={styles.scrollArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.formContainer}>
                {/* Basic Information */}
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Basic Information
                  </Text>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        label="Warning Title"
                        value={value}
                        onChangeText={onChange}
                        error={!!errors.title}
                        mode="outlined"
                        style={styles.input}
                      />
                    )}
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                  )}

                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        label="Detailed Description"
                        value={value}
                        onChangeText={onChange}
                        error={!!errors.description}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                      />
                    )}
                  />
                </View>

                {/* Disaster Category */}
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Disaster Category
                  </Text>
                  <Controller
                    control={control}
                    name="disaster_category"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.buttonGroup}>
                        <Button
                          mode={value === "flood" ? "contained" : "outlined"}
                          onPress={() => onChange("flood")}
                          style={styles.categoryButton}
                        >
                          Flood
                        </Button>
                        <Button
                          mode={value === "fire" ? "contained" : "outlined"}
                          onPress={() => onChange("fire")}
                          style={styles.categoryButton}
                        >
                          Fire
                        </Button>
                        <Button
                          mode={
                            value === "earthquake" ? "contained" : "outlined"
                          }
                          onPress={() => onChange("earthquake")}
                          style={styles.categoryButton}
                        >
                          Earthquake
                        </Button>
                        <Button
                          mode={
                            value === "landslide" ? "contained" : "outlined"
                          }
                          onPress={() => onChange("landslide")}
                          style={styles.categoryButton}
                        >
                          Landslide
                        </Button>
                        <Button
                          mode={value === "cyclone" ? "contained" : "outlined"}
                          onPress={() => onChange("cyclone")}
                          style={styles.categoryButton}
                        >
                          Cyclone
                        </Button>
                      </View>
                    )}
                  />
                </View>

                {/* Severity Level */}
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Severity Level
                  </Text>
                  <Controller
                    control={control}
                    name="severity"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.buttonGroup}>
                        <Button
                          mode={value === "low" ? "contained" : "outlined"}
                          onPress={() => onChange("low")}
                          style={styles.severityButton}
                        >
                          Low
                        </Button>
                        <Button
                          mode={value === "medium" ? "contained" : "outlined"}
                          onPress={() => onChange("medium")}
                          style={styles.severityButton}
                        >
                          Medium
                        </Button>
                        <Button
                          mode={value === "high" ? "contained" : "outlined"}
                          onPress={() => onChange("high")}
                          style={styles.severityButton}
                        >
                          High
                        </Button>
                        <Button
                          mode={value === "critical" ? "contained" : "outlined"}
                          onPress={() => onChange("critical")}
                          style={styles.severityButton}
                        >
                          Critical
                        </Button>
                      </View>
                    )}
                  />
                </View>

                {/* Location */}
                {location && (
                  <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Location
                    </Text>
                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        onPress={onMapPress}
                      >
                        <Marker
                          coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                          }}
                        />
                      </MapView>
                    </View>
                  </View>
                )}

                {/* Address Details */}
                {address && (
                  <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Address Details
                    </Text>
                    <View style={styles.addressFields}>
                      {/* ... address input fields ... */}
                    </View>
                  </View>
                )}

                {/* Duration */}
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Expected Duration
                  </Text>
                  <Controller
                    control={control}
                    name="expected_duration.end_time"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        label="End Time (YYYY-MM-DD HH:MM)"
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        style={styles.input}
                      />
                    )}
                  />
                </View>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions style={styles.dialogActions}>
            <Button mode="outlined" onPress={() => setVisible(false)}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  dialog: {
    width: "90%",
    alignSelf: "center",
    maxHeight: "80%",
  },
  scrollArea: {
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
  },
  categoryButton: {
    flex: 1,
    minWidth: "45%",
    marginBottom: 8,
  },
  severityButton: {
    flex: 1,
    minWidth: "45%",
    marginBottom: 8,
  },
  mapContainer: {
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  addressFields: {
    gap: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  dialogActions: {
    padding: 15,
    gap: 10,
  },
});

export default CreateWarningDialog;
