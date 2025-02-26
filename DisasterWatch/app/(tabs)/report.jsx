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
import { Stack } from "expo-router";
import { submitReport } from "../../services/api";
import { uploadImages } from "../../services/imageUpload";
import HeaderBar from "../../components/headerBar";

const ReportScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

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
          address: {
            city: data.location.address.city,
            district: data.location.address.district,
            province: data.location.address.province,
            details: data.location.address.details || "",
          },
        },
      };
  
      console.log("Submitting data:", formattedData);
      await uploadImages(images, formattedData);
  
      reset();
      setImages([]);
      alert("Report submitted successfully!");
    } catch (error) {
      alert("Failed to submit report: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  