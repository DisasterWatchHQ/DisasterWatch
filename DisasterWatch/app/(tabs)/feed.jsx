import { useState, useEffect } from "react";
import { View, ScrollView, Share, Linking, StyleSheet } from "react-native";
import {
  useTheme,
} from "react-native-paper";
import { useReports } from "../../hooks/useReports";
import { useLiveUpdates } from "../../hooks/useLiveUpdates";

export default function DisasterFeed() {
  const { reports, loading, error, filters, updateFilters, refreshReports } =
    useReports();
  const { updates } = useLiveUpdates();
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const theme = useTheme();

  isLoading: propIsLoading,
  error: propError,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState(propIsLoading || false);
  const [error, setError] = useState(propError || null);

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