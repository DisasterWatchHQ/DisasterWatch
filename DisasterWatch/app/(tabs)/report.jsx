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
