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
  