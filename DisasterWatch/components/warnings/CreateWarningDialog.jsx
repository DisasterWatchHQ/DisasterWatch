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
        mode="outlined"
        onPress={() => setVisible(true)}
        style={styles.createButton}
      >
        Create Warning
      </Button>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Create New Warning</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <View style={styles.formContainer}>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Title"
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
                      label="Description"
                      value={value}
                      onChangeText={onChange}
                      error={!!errors.description}
                      mode="outlined"
                      multiline
                      numberOfLines={4}
                      style={styles.input}
                    />
                  )}
                />
                {errors.description && (
                  <Text style={styles.errorText}>
                    {errors.description.message}
                  </Text>
                )}

                <Controller
                  control={control}
                  name="disaster_category"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.segmentedContainer}>
                      <Text>Disaster Category</Text>
                      <SegmentedButtons
                        value={value}
                        onValueChange={onChange}
                        buttons={[
                          { value: "flood", label: "Flood" },
                          { value: "fire", label: "Fire" },
                          { value: "earthquake", label: "Earthquake" },
                          { value: "landslide", label: "Landslide" },
                          { value: "cyclone", label: "Cyclone" },
                        ]}
                      />
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="severity"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.segmentedContainer}>
                      <Text>Severity Level</Text>
                      <SegmentedButtons
                        value={value}
                        onValueChange={onChange}
                        buttons={[
                          { value: "low", label: "Low" },
                          { value: "medium", label: "Medium" },
                          { value: "high", label: "High" },
                          { value: "critical", label: "Critical" },
                        ]}
                      />
                    </View>
                  )}
                />

                {location && (
                  <View style={styles.mapContainer}>
                    <Text>Select Affected Location</Text>
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
                )}

                {address && (
                  <View style={styles.addressContainer}>
                    <Controller
                      control={control}
                      name="affected_locations.0.address.city"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          label="City"
                          value={value}
                          onChangeText={onChange}
                          mode="outlined"
                          style={styles.input}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="affected_locations.0.address.district"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          label="District"
                          value={value}
                          onChangeText={onChange}
                          mode="outlined"
                          style={styles.input}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="affected_locations.0.address.province"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          label="Province"
                          value={value}
                          onChangeText={onChange}
                          mode="outlined"
                          style={styles.input}
                        />
                      )}
                    />
                  </View>
                )}

                <Controller
                  control={control}
                  name="expected_duration.end_time"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Expected End Time (YYYY-MM-DD HH:MM)"
                      value={value}
                      onChangeText={onChange}
                      placeholder="YYYY-MM-DD HH:MM"
                      mode="outlined"
                      style={styles.input}
                    />
                  )}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
            >
              Create Warning
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  createButton: {
    marginVertical: 10,
  },
  dialog: {
    maxHeight: "80%",
  },
  formContainer: {
    gap: 16,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  segmentedContainer: {
    gap: 8,
  },
  mapContainer: {
    height: 200,
    marginVertical: 16,
  },
  map: {
    flex: 1,
    marginTop: 8,
  },
  addressContainer: {
    gap: 8,
  },
  datePickerContainer: {
    marginVertical: 8,
  },
});

export default CreateWarningDialog;
