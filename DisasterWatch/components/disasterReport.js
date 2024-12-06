import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const disasterTypes = [
  'Flood',
  'Landslide',
  'Fire',
  'Earthquake',
  'Tsunami',
  'Storm',
  'Other'
];

const DisasterReport = ({ onSubmit, isLoading = false }) => {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Handle image picking
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images.');
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

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedType) {
      alert('Please select a disaster type');
      return;
    }
    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }

    onSubmit({
      type: selectedType,
      description,
      images
    });
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-5">
        <Text className="text-neutral-100 text-lg mb-2 font-semibold">Disaster Type *</Text>
        <TouchableOpacity
          className=" flex-row bg-neutral-700 p-3 rounded-lg justify-between items-center"
          onPress={() => setShowTypeSelector(!showTypeSelector)}
        >
          <Text className="text-neutral-200 text-lg">
            {selectedType || 'Select disaster type'}
          </Text>
          <MaterialIcons 
            name={showTypeSelector ? 'arrow-drop-up' : 'arrow-drop-down'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        {showTypeSelector && (
          <View className="bg-neutral-600 rounded-lg mt-4 overflow-hidden">
            {disasterTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className="p-3 border-1 border-neutral-300"
                onPress={() => {
                  setSelectedType(type);
                  setShowTypeSelector(false);
                }}
              >
                <Text className="text-neutral-100 text-lg">{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Description Input */}
      <View className="mb-5">
        <Text className="text-neutral-100 text-lg mb-2 font-semibold">Description *</Text>
        <TextInput
          className="bg-neutral-700 rounded-lg p-3 text-neutral-200 text-lg align-top min-h-[100px]"
          multiline
          numberOfLines={4}
          placeholder="Describe the situation..."
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Image Upload Section */}
      <View className="mb-5">
        <Text className="text-neutral-100 text-lg mb-2 font-semibold">Photos (Optional)</Text>
        <View className="flex-row flex-wrap gap-5">
          {images.map((uri, index) => (
            <View key={index} className="position-relative">
              <Image source={{ uri }} className="w-[100px] h-[100px] rounded-lg" />
              <TouchableOpacity
                className="position-absolute w-6 -top-28 -right-24 bg-secondary-700 rounded-2xl"
                onPress={() => removeImage(index)}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 3 && (
            <TouchableOpacity className="w-[100px] h-[100px] bg-neutral-600 rounded-lg justify-center items-center" onPress={pickImage}>
              <MaterialIcons name="add-photo-alternate" size={24} color="white" />
              <Text className="text-neutral-100 mt-2 text-sm">Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <MaterialIcons name="send" size={24} color="white" />
            <Text className="text-neutral-100 text-lg font-bold">Submit Report</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#FF4444',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default DisasterReport;