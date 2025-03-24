import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  Alert,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import wardash from "../../api/services/wardash";

export const WarningActions = ({ warning, onUpdate }) => {
  const [visible, setVisible] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [severityChange, setSeverityChange] = useState("");

  const handleAddUpdate = async () => {
    try {
      const userString = await SecureStore.getItemAsync("userSession");
      const user = JSON.parse(userString);

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const updateData = {
        update_text: updateText,
        updated_by: user.user.id,
        updated_at: new Date(),
        severity_change: severityChange || undefined,
      };

      const response = await wardash.post(
        `/warnings/${warning._id}/updates`,
        updateData,
      );
      onUpdate && onUpdate(response.data);
      setVisible(false);
      setUpdateText("");
      setSeverityChange("");
    } catch (error) {
      console.error("Error adding update:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        Alert.alert("Error", error.response.data.error || "Failed to add update");
      } else {
        Alert.alert("Error", "Failed to add update");
      }
    }
  };

  const handleResolveWarning = async () => {
    try {
      const userString = await SecureStore.getItemAsync("userSession");
      const user = JSON.parse(userString);

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const resolutionData = {
        resolution_notes: "Warning resolved through dashboard",
        resolved_by: user.user.id,
        resolved_at: new Date(),
      };

      const response = await wardash.post(
        `/warnings/${warning._id}/resolve`,
        resolutionData,
      );

      onUpdate && onUpdate(response.data);
    } catch (error) {
      console.error("Error resolving warning:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        Alert.alert("Error", error.response.data.error || "Failed to resolve warning");
      } else {
        Alert.alert("Error", "Failed to resolve warning");
      }
    }
  };

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Button mode="outlined" onPress={() => setVisible(true)}>
        Add Update
      </Button>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Add Warning Update</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Update details"
              value={updateText}
              onChangeText={setUpdateText}
              multiline
              numberOfLines={3}
            />
            <SegmentedButtons
              value={severityChange}
              onValueChange={setSeverityChange}
              buttons={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleAddUpdate} disabled={!updateText.trim()}>
              Submit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {warning.status !== "resolved" && (
        <Button mode="contained-tonal" onPress={handleResolveWarning}>
          Resolve Warning
        </Button>
      )}
    </View>
  );
};
