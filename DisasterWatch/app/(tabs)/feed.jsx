import { Text, View, ScrollView, SafeAreaView, RefreshControl, Image } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import ReportCard from '../../components/reportCard';
import HeaderBar from '../../components/headerBar';

// Sample data
const sampleReports = [
  {
    id: '1',
    type: 'Flood',
    location: 'Colombo District',
    description: 'Water level rising rapidly in Wellawatta area',
    timestamp: '2 minutes ago',
    severity: 'high',
    images: ['https://example.com/image1.jpg'],
    user: {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    },
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    }
  },
  {
    id: '2',
    type: 'Flood',
    location: 'Colombo District',
    description: 'Water level rising rapidly in Wellawatta area',
    timestamp: '2 minutes ago',
    severity: 'high',
    images: ['https://example.com/image1.jpg'],
    user: {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    },
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    }
  },
  // Add more sample reports as needed
];

const Feed = ({
  initialReports = sampleReports,
  onRefresh: propOnRefresh,
  onReportPress,
  onUserPress,
  onLocationPress,
  onImagePress,
  isLoading: propIsLoading,
  error: propError,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState(propIsLoading || false);
  const [error, setError] = useState(propError || null);

  // Simulate data fetching
  const fetchReports = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newReport = {
      id: Date.now().toString(),
      type: 'Flood',
      location: 'New Location',
      description: 'New disaster report',
      timestamp: 'Just now',
      severity: 'high',
      images: ['https://example.com/new-image.jpg'],
      user: {
        id: 'user2',
        name: 'Jane Doe',
        avatar: 'https://example.com/avatar2.jpg'
      }
    };
    return [newReport, ...reports];
  };

  // Refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      if (propOnRefresh) {
        const newReports = await propOnRefresh();
        setReports(newReports);
      } else {
        const newReports = await fetchReports();
        setReports(newReports);
      }
    } catch (err) {
      setError('Failed to refresh reports');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [propOnRefresh]);

  // Handle report interactions
  const handleReportPress = useCallback((report) => {
    if (onReportPress) {
      onReportPress(report);
    }
  }, [onReportPress]);

  const handleUserPress = useCallback((user) => {
    if (onUserPress) {
      onUserPress(user);
    }
  }, [onUserPress]);

  const handleLocationPress = useCallback((location) => {
    if (onLocationPress) {
      onLocationPress(location);
    }
  }, [onLocationPress]);

  const handleImagePress = useCallback((images, index) => {
    if (onImagePress) {
      onImagePress(images, index);
    }
  }, [onImagePress]);

  // Error component
  const ErrorMessage = () => (
    <View className="flex-1 items-center justify-center py-20">
      <MaterialIcons name="error-outline" size={48} color="#666" />
      <Text className="text-neutral-400 mt-4">{error}</Text>
      <Text 
        className="text-blue-500 mt-2"
        onPress={onRefresh}
      >
        Try Again
      </Text>
    </View>
  );

  // Loading component
  const LoadingMessage = () => (
    <View className="flex-1 items-center justify-center py-20">
      <MaterialIcons name="hourglass-empty" size={48} color="#666" />
      <Text className="text-neutral-400 mt-4">Loading reports...</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-800">
      <HeaderBar 
        showBack 
        title="Recent Reports" 
        containerStyle="mt-8"
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={["#fff"]}
            progressBackgroundColor="#262626"
            style={{ backgroundColor: '#262626' }}
          />
        }
        contentContainerStyle={loading || error ? { flex: 1 } : null}
      >
        <View className="py-2">
          {loading ? (
            <LoadingMessage />
          ) : error ? (
            <ErrorMessage />
          ) : reports.length > 0 ? (
            reports.map(report => (
              <ReportCard 
                key={report.id} 
                report={report}
                onPress={() => handleReportPress(report)}
                onUserPress={() => handleUserPress(report.user)}
                onLocationPress={() => handleLocationPress(report.location)}
                onImagePress={(index) => handleImagePress(report.images, index)}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name="error-outline" size={48} color="#666" />
              <Text className="text-neutral-400 mt-4">No reports available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Example usage:
{/* 
<Feed
  initialReports={yourReports}
  onRefresh={async () => {
    const response = await fetch('your-api-endpoint');
    return response.json();
  }}
  onReportPress={(report) => {
    navigation.navigate('ReportDetail', { report });
  }}
  onUserPress={(user) => {
    navigation.navigate('UserProfile', { userId: user.id });
  }}
  onLocationPress={(location) => {
    navigation.navigate('Map', { location });
  }}
  onImagePress={(images, index) => {
    navigation.navigate('ImageViewer', { images, initialIndex: index });
  }}
  isLoading={false}
  error={null}
/>
*/}

export default Feed;