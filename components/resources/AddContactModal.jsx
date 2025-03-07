import React, { useState, useEffect } from "react";
import {
  Modal,
  Portal,
  TextInput,
  Button,
  Surface,
  Text,
  SegmentedButtons,
} from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";

const AddContactModal = ({ visible, onDismiss, onSubmit, editingContact }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "emergency_contact",
    type: "emergency_number",
    contact: {
      phone: "",
      email: "",
    },
    emergency_level: "medium",
    metadata: {
      serviceHours: "24/7",
    },
    tags: [],
    status: "active",
  });

  useEffect(() => {
    if (editingContact) {
      setFormData(editingContact);
    }
  }, [editingContact]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const emergencyLevels = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <Text style={styles.title}>
            {editingContact ? "Edit Contact" : "Add Emergency Contact"}
          </Text>

          <TextInput
            label="Contact Name"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            style={styles.input}
          />

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
            keyboardType="email-address"
          />

          <Text style={styles.label}>Emergency Level</Text>
          <SegmentedButtons
            value={formData.emergency_level}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, emergency_level: value }))
            }
            buttons={emergencyLevels}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Service Hours"
            value={formData.metadata.serviceHours}
            onChangeText={(text) =>
              setFormData((prev) => ({
                ...prev,
                metadata: { ...prev.metadata, serviceHours: text },
              }))
            }
            style={styles.input}
          />

          <View style={styles.buttons}>
            <Button onPress={onDismiss} style={styles.button}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              {editingContact ? "Update Contact" : "Add Contact"}
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
  segmentedButtons: {
    marginBottom: 16,
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

export default AddContactModal;