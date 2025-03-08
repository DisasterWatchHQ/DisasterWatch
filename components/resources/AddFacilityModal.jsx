import React, { useState, useEffect } from "react";
import {
  Modal,
  Portal,
  TextInput,
  Button,
  Surface,
  Text,
  SegmentedButtons,
  Switch,
} from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";

const AddFacilityModal = ({
  visible,
  onDismiss,
  onSubmit,
  editingFacility,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "facility",
    type: "hospital",
    contact: {
      phone: "",
      email: "",
    },
    location: {
      type: "point",
      coordinates: [0, 0],
      address: {
        formatted_address: "",
        city: "",
        district: "",
        province: "",
        details: "",
      },
    },
    availability_status: "open",
    metadata: {
      capacity: 0,
    },
    capacity: 0,
    operating_hours: {
      monday: { open: "09:00", close: "17:00", is24Hours: false },
      tuesday: { open: "09:00", close: "17:00", is24Hours: false },
      wednesday: { open: "09:00", close: "17:00", is24Hours: false },
      thursday: { open: "09:00", close: "17:00", is24Hours: false },
      friday: { open: "09:00", close: "17:00", is24Hours: false },
      saturday: { open: "09:00", close: "17:00", is24Hours: false },
      sunday: { open: "09:00", close: "17:00", is24Hours: false },
    },
    tags: [],
    status: "active",
  });

  useEffect(() => {
    if (editingFacility) {
      setFormData(editingFacility);
    }
  }, [editingFacility]);

  const facilityTypes = [
    { label: "Hospital", value: "hospital" },
    { label: "Shelter", value: "shelter" },
    { label: "Police", value: "police_station" },
    { label: "Fire", value: "fire_station" },
    { label: "Clinic", value: "clinic" },
  ];

  const availabilityStatuses = [
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
    { label: "Maintenance", value: "under_maintenance" },
  ];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>
            {editingFacility ? "Edit Facility" : "Add New Facility"}
          </Text>

          <TextInput
            label="Facility Name"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            style={styles.input}
          />

          <Text style={styles.label}>Facility Type</Text>
          <SegmentedButtons
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
            buttons={facilityTypes}
            style={styles.segmentedButtons}
          />

          <Text style={styles.label}>Availability Status</Text>
          <SegmentedButtons
            value={formData.availability_status}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, availability_status: value }))
            }
            buttons={availabilityStatuses}
            style={styles.segmentedButtons}
          />

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TextInput
              label="Phone Number"
              value={formData.contact.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: text },
                }))
              }
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={formData.contact.email}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: text },
                }))
              }
              style={styles.input}
            />
          </View>

          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.coordinatesContainer}>
              <TextInput
                label="Longitude"
                value={String(formData.location.coordinates[0])}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: [Number(text), prev.location.coordinates[1]],
                    },
                  }))
                }
                style={[styles.input, styles.coordinateInput]}
                keyboardType="numeric"
              />
              <TextInput
                label="Latitude"
                value={String(formData.location.coordinates[1])}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: [prev.location.coordinates[0], Number(text)],
                    },
                  }))
                }
                style={[styles.input, styles.coordinateInput]}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              label="Address"
              value={formData.location.address.formatted_address}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    address: {
                      ...prev.location.address,
                      formatted_address: text,
                    },
                  },
                }))
              }
              style={styles.input}
            />

            <View style={styles.addressDetailsContainer}>
              <TextInput
                label="City"
                value={formData.location.address.city}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      address: { ...prev.location.address, city: text },
                    },
                  }))
                }
                style={[styles.input, styles.addressDetailInput]}
              />
              <TextInput
                label="Province"
                value={formData.location.address.province}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      address: { ...prev.location.address, province: text },
                    },
                  }))
                }
                style={[styles.input, styles.addressDetailInput]}
              />
            </View>
          </View>

          {formData.type === "shelter" && (
            <TextInput
              label="Capacity"
              value={String(formData.metadata.capacity)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  metadata: { ...prev.metadata, capacity: Number(text) },
                  capacity: Number(text),
                }))
              }
              style={styles.input}
              keyboardType="numeric"
            />
          )}

          <TextInput
            label="Tags (comma-separated)"
            value={formData.tags.join(", ")}
            onChangeText={(text) =>
              setFormData((prev) => ({
                ...prev,
                tags: text.split(",").map((tag) => tag.trim()),
              }))
            }
            style={styles.input}
          />

          <View style={styles.buttons}>
            <Button onPress={onDismiss} style={styles.button}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => onSubmit(formData)}
              style={styles.button}
            >
              {editingFacility ? "Update Facility" : "Add Facility"}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    transform: [{ translateY: 0 }],
    position: "relative",
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  coordinatesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  coordinateInput: {
    flex: 1,
  },
  addressDetailsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  addressDetailInput: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});

export default AddFacilityModal;
