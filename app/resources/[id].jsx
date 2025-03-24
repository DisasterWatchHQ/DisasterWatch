import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import HeaderBar from '../../components/HeaderBar';
import { facilityApi } from '../../api/services/resources';

const GuideDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchGuideDetails();
  }, [id]);

  const fetchGuideDetails = async () => {
    try {
      setLoading(true);
      const response = await facilityApi.getResourceById(id);
      setGuide(response.data);
    } catch (err) {
      setError('Failed to load guide details');
      console.error('Error fetching guide:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <HeaderBar
        title={guide?.name}
        subtitle={guide?.type}
        showBack={false}
        containerStyle={styles.headerBar}
        showBell={false}
        showCog={false}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {guide?.description && (
          <Text style={styles.description}>
            {guide.description}
          </Text>
        )}
        
        <Markdown
          style={{
            body: styles.markdown,
            heading1: styles.heading1,
            heading2: styles.heading2,
            heading3: styles.heading3,
            paragraph: styles.paragraph,
            list: styles.list,
            listItem: styles.listItem,
            link: { color: theme.colors.primary },
          }}
        >
          {guide?.content || ''}
        </Markdown>
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
  },
  contentContainer: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  markdown: {
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
  headerBar: {
    marginTop: 16,
  }
});

export default GuideDetailScreen;