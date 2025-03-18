import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
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
});

const CreateWarningDialog = ({ onWarningCreated }) => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

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
      setValue("affected_locations.0.latitude", currentLocation.coords.latitude);
      setValue("affected_locations.0.longitude", currentLocation.coords.longitude);
      
      // Get initial address
      const response = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (response[0]) {
        const addressData = response[0];
        const initialAddress = {
          city: addressData.city || addressData.subregion || "",
          district: addressData.district || addressData.region || "",
          province: addressData.region || "",
          details: `${addressData.street || ""} ${addressData.name || ""}`.trim(),
        };
        setAddress(initialAddress);
        setValue("affected_locations.0.address", initialAddress);
      }
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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!user) {
        Alert.alert(
          "Authentication Required",
          "Please sign in to create a warning. This feature is only available for authenticated users.",
          [
            { text: "Cancel", onPress: () => setVisible(false) },
            { text: "Sign In", onPress: () => setVisible(false) }
          ]
        );
        return;
      }

      const formattedData = {
        ...data,
        created_by: user.id,
        expected_duration: {
          start_time: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        affected_locations: [
          {
            latitude: location?.latitude,
            longitude: location?.longitude,
            address: data.affected_locations[0].address,
          },
        ],
      };

      try {
        const response = await wardash.post("/warnings", formattedData);
        if (response.data) {
          setVisible(false);
          reset();
          Alert.alert("Success", "Warning created successfully");
          if (onWarningCreated) {
            onWarningCreated();
          }
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
    } catch (error) {
      console.error("Error creating warning:", error);
      Alert.alert("Error", error.message || "Failed to create warning");
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
                  {errors.description && (
                    <Text style={styles.errorText}>{errors.description.message}</Text>
                  )}
                </View>

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

                {address && (
                  <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Address Details
                    </Text>
                    <View style={styles.addressFields}>
                      <Controller
                        control={control}
                        name="affected_locations.0.address.city"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            label="City"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.affected_locations?.[0]?.address?.city}
                            mode="outlined"
                            style={styles.input}
                          />
                        )}
                      />
                      {errors.affected_locations?.[0]?.address?.city && (
                        <Text style={styles.errorText}>
                          {errors.affected_locations[0].address.city.message}
                        </Text>
                      )}

                      <Controller
                        control={control}
                        name="affected_locations.0.address.district"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            label="District"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.affected_locations?.[0]?.address?.district}
                            mode="outlined"
                            style={styles.input}
                          />
                        )}
                      />
                      {errors.affected_locations?.[0]?.address?.district && (
                        <Text style={styles.errorText}>
                          {errors.affected_locations[0].address.district.message}
                        </Text>
                      )}

                      <Controller
                        control={control}
                        name="affected_locations.0.address.province"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            label="Province"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.affected_locations?.[0]?.address?.province}
                            mode="outlined"
                            style={styles.input}
                          />
                        )}
                      />
                      {errors.affected_locations?.[0]?.address?.province && (
                        <Text style={styles.errorText}>
                          {errors.affected_locations[0].address.province.message}
                        </Text>
                      )}

                      <Controller
                        control={control}
                        name="affected_locations.0.address.details"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            label="Additional Details"
                            value={value}
                            onChangeText={onChange}
                            mode="outlined"
                            style={styles.input}
                          />
                        )}
                      />
                    </View>
                  </View>
                )}
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
