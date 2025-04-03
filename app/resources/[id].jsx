import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import HeaderBar from '../../components/HeaderBar';
import { resourceApi } from '../../api/services/resources';

const GuideDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const loadGuide = async () => {
      try {
        const response = await resourceApi.getResourceById(id);
        setGuide(response.resource);
      } catch (error) {
        console.error('Error loading guide:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.centered}>
        <Text>No guide data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={guide?.name}
        subtitle={guide?.type}
        showBack={true}
        containerStyle={{ marginTop: 32 }}
      />
      
      <ScrollView style={styles.content}>
        {guide?.description && (
          <Text style={styles.description}>{guide.description}</Text>
        )}
        {guide?.content ? (
          <Markdown style={markdownStyles}>
            {guide.content}
          </Markdown>
        ) : (
          <Text>No content available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 22,
  },
  list: {
    marginVertical: 8,
  },
  listItem: {
    marginVertical: 4,
  },
};

export default GuideDetailScreen;