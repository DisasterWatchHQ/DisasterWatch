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

  useEffect(() => {
    const fetchActiveWarnings = async () => {
      try {
        const warnings = await warningApi.getActiveWarnings();
        setActiveWarnings(warnings);
      } catch (error) {
        console.error("Error fetching active warnings:", error);
      }
    };

    fetchActiveWarnings();
  }, []);

  const handleShare = async (report) => {
    try {
      const shareText = `${report.title} - ${report.description}`;
      const result = await Share.share({
        message: shareText,
        title: report.title,
      });
    } catch (error) {
      console.error("Error sharing report:", error);
    }
  };

  const handleSocialShare = async (report, platform) => {
    const shareText = encodeURIComponent(
      `${report.title} - ${report.description}`,
    );

    switch (platform) {
      case "twitter":
        await Linking.openURL(
          `https://twitter.com/intent/tweet?text=${shareText}`,
        );
        break;
      case "facebook":
        await Linking.openURL(
          `https://www.facebook.com/sharer/sharer.php?u=${shareText}`,
        );
        break;
      case "whatsapp":
        await Linking.openURL(`whatsapp://send?text=${shareText}`);
        break;
    }
  };


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