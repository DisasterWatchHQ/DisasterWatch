import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as ImagePicker from "expo-image-picker";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Portal,
  Dialog,
  List,
  MD3Colors,
  ActivityIndicator,
} from "react-native-paper";
import { submitReport } from "../../api/services/api";
// import { uploadImages } from "../../services/imageUpload";
import HeaderBar from "../../components/HeaderBar";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  disaster_category: z.enum([
    "flood",
    "fire",
    "earthquake",
    "landslide",
    "cyclone",
    "other",
  ]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.object({
    address: z.object({
      city: z.string().min(1, "City is required"),
      district: z.string().min(1, "District is required"),
      province: z.string().min(1, "Province is required"),
      details: z.string().optional(),
    }),
  }),
});

const disasterCategories = [
  "flood",
  "fire",
  "earthquake",
  "landslide",
  "cyclone",
  "other",
];

const ReportScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      disaster_category: undefined,
      description: "",
      location: {
        address: {
          city: "",
          district: "",
          province: "",
          details: "",
        },
      },
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const formattedData = {
        ...data,
        location: {
          type: "Point",
          coordinates: [0, 0], // You might want to add actual coordinates
          address: {
            city: data.location.address.city,
            district: data.location.address.district,
            province: data.location.address.province,
            details: data.location.address.details || "",
          },
        },
      };

      const result = await submitReport(formattedData);

      reset();
      alert("Report submitted successfully! Thank you for your contribution.");
    } catch (error) {
      console.error("Report submission error:", error);
      alert(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Report Submition"
        subtitle="Report Disasters"
        showBack={false}
        containerStyle={{ marginTop: 32 }}
        showBell={false}
        showCog={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic Information
          </Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Title"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.title}
                  style={styles.input}
                />
                {errors.title && (
                  <HelperText type="error">{errors.title.message}</HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="disaster_category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setShowCategoryDialog(true)}
                  icon="menu-down"
                  style={styles.categoryButton}
                >
                  {value || "Select Disaster Category"}
                </Button>
                {errors.disaster_category && (
                  <HelperText type="error">
                    {errors.disaster_category.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Description"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  error={!!errors.description}
                  style={styles.textArea}
                />
                {errors.description && (
                  <HelperText type="error">
                    {errors.description.message}
                  </HelperText>
                )}
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Location Details
          </Text>

          <Controller
            control={control}
            name="location.address.city"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="City"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.location?.address?.city}
                  style={styles.input}
                />
                {errors.location?.address?.city && (
                  <HelperText type="error">
                    {errors.location.address.city.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="location.address.district"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="District"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.location?.address?.district}
                  style={styles.input}
                />
                {errors.location?.address?.district && (
                  <HelperText type="error">
                    {errors.location.address.district.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="location.address.province"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Province"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.location?.address?.province}
                  style={styles.input}
                />
                {errors.location?.address?.province && (
                  <HelperText type="error">
                    {errors.location.address.province.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="location.address.details"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Address Details"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Photos (Optional)
          </Text>
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <Button
                  icon="close"
                  mode="contained"
                  onPress={() => removeImage(index)}
                  style={styles.removeImageButton}
                  contentStyle={styles.removeImageButtonContent}
                  compact={true}
                />
              </View>
            ))}
            {images.length < 3 && (
              <Button
                icon="camera-plus"
                mode="outlined"
                onPress={pickImage}
                style={styles.addImageButton}
              >
                Add
              </Button>
            )}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          {isSubmitting ? (
            <ActivityIndicator color={MD3Colors.primary100} />
          ) : (
            "Submit Report"
          )}
        </Button>
      </ScrollView>

      <Portal>
        <Dialog
          visible={showCategoryDialog}
          onDismiss={() => setShowCategoryDialog(false)}
        >
          <Dialog.Title>Select Disaster Category</Dialog.Title>
          <Dialog.Content>
            {disasterCategories.map((category) => (
              <List.Item
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
                onPress={() => {
                  setValue("disaster_category", category);
                  setShowCategoryDialog(false);
                }}
                style={styles.dialogItem}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
    gap: 8,
    paddingBottom: 75,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2c3e50",
    letterSpacing: 0.3,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  textArea: {
    backgroundColor: "#ffffff",
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  categoryButton: {
    width: "100%",
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 12,
  },
  imageWrapper: {
    position: "relative",
    width: 140,
    height: 140,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    padding: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    minWidth: 0,
  },
  removeImageButtonContent: {
    width: 24,
    height: 24,
    margin: 0,
    left: 5,
  },
  addImageButton: {
    width: 140,
    height: 140,
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#bdc3c7",
    backgroundColor: "#f8f9fa",
  },
  submitButton: {
    marginVertical: 24,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dialogItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  helperText: {
    fontSize: 12,
    color: "#e74c3c",
    marginTop: 4,
    marginLeft: 4,
  },
});
export default ReportScreen;
