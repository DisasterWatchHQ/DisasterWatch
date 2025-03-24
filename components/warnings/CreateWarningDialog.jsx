import React, { useState, useContext } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from 'prop-types';
import wardash from "../../api/services/wardash";
import { useUser } from "../../context/UserContext";
import WarningFormFields from "./WarningFormFields";
import WarningLocationPicker from "./WarningLocationPicker";

/**
 * @typedef {Object} CreateWarningDialogProps
 * @property {Function} onWarningCreated - Callback when warning is created successfully
 */

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
        latitude: z.number(),
        longitude: z.number(),
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

/**
 * Dialog component for creating new warnings
 * @param {CreateWarningDialogProps} props
 */
const CreateWarningDialog = ({ onWarningCreated }) => {
  const theme = useTheme();
  const { user } = useUser();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleClose = () => {
    setVisible(false);
    setError(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to create a warning. This feature is only available for authenticated users.",
        [
          { text: "Cancel", onPress: handleClose },
          { text: "Sign In", onPress: handleClose }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formattedData = {
        ...data,
        created_by: user.id,
        expected_duration: {
          start_time: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      };

      const response = await wardash.post("/warnings", formattedData);
      
      if (response.data) {
        handleClose();
        Alert.alert("Success", "Warning created successfully");
        onWarningCreated?.();
      }
    } catch (err) {
      console.error("Error creating warning:", err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to create warning"
      );
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
          onDismiss={handleClose}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          <Dialog.Title style={[styles.dialogTitle, { color: theme.colors.onSurface }]}>
            Create New Warning
          </Dialog.Title>

          <Dialog.ScrollArea style={styles.scrollArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {error && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}

              <View style={styles.formContainer}>
                <WarningFormFields 
                  control={control}
                  errors={errors}
                />

                <WarningLocationPicker
                  control={control}
                  errors={errors}
                  setValue={setValue}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            >
              Create Warning
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

CreateWarningDialog.propTypes = {
  onWarningCreated: PropTypes.func,
};

const styles = StyleSheet.create({
  createButton: {
    margin: 16,
  },
  dialog: {
    maxHeight: '90%',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollArea: {
    paddingHorizontal: 0,
  },
  scrollViewContent: {
    padding: 20,
  },
  formContainer: {
    gap: 32,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default CreateWarningDialog;
