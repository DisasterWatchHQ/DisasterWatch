import React, { useState, useEffect } from "react";
import {
  Modal,
  Portal,
  TextInput,
  Button,
  Surface,
  Text,
  Chip,
} from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";

const AddGuideModal = ({ visible, onDismiss, onSubmit, editingGuide }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "guide",
    type: "disaster_guide",
    description: "",
    content: "",
    contact: {
      phone: "",
      email: "",
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
    },
    tags: [],
    status: "active",
  });

  const [tag, setTag] = useState("");

  useEffect(() => {
    if (visible) {
      if (editingGuide) {
        setFormData(editingGuide);
      } else {
        setFormData({
          name: "",
          category: "guide",
          type: "disaster_guide",
          description: "",
          content: "",
          contact: {
            phone: "",
            email: "",
          },
          metadata: {
            lastUpdated: new Date().toISOString(),
          },
          tags: [],
          status: "active",
        });
      }
    }
  }, [visible, editingGuide]);

  const handleSubmit = () => {
    const updatedData = {
      ...formData,
      metadata: {
        ...formData.metadata,
        lastUpdated: new Date().toISOString(),
      },
    };
    onSubmit(updatedData);
  };

  const addTag = () => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <Text style={styles.title}>
            {editingGuide ? "Edit Guide" : "Add New Guide"}
          </Text>
          <TextInput
            label="Title"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            multiline
            style={styles.input}
          />

          <TextInput
            label="Content"
            value={formData.content}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, content: text }))
            }
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <TextInput
            label="Contact Phone"
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
            label="Contact Email"
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

          <View style={styles.tagsContainer}>
            <TextInput
              label="Add Tags"
              value={tag}
              onChangeText={setTag}
              onSubmitEditing={addTag}
              right={<TextInput.Icon icon="plus" onPress={addTag} />}
            />
            <View style={styles.tagsList}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  onClose={() => removeTag(tag)}
                  style={styles.chip}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.buttons}>
            <Button onPress={onDismiss} style={styles.button}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              {editingGuide ? "Update Guide" : "Create Guide"}
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
  tagsContainer: {
    marginBottom: 16,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    margin: 4,
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

export default AddGuideModal;
