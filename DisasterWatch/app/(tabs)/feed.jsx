import { useState, useEffect } from "react";
import { View, ScrollView, Share, Linking, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Chip,
  Text,
  ActivityIndicator,
  Portal,
  Dialog,
  SegmentedButtons,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useReports } from "../../hooks/useReports";
import { useLiveUpdates } from "../../hooks/useLiveUpdates";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { warningApi } from "../../services/warningApi";

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

  const filteredReports = (showVerifiedOnly) => {
    return reports.filter(
      (report) =>
        !showVerifiedOnly || report.verification_status === "verified",
    );
  };

  const handleFilterChange = (type, value) => {
    updateFilters({ [type]: value, page: 1 });
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading reports: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            Disaster Feed
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Live updates and verified reports
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Button
            mode="contained"
            onPress={refreshReports}
            loading={loading}
            compact
            style={styles.refreshButton}
            contentStyle={styles.refreshButtonContent}
          >
            Refresh
          </Button>
          <IconButton
            icon="bell"
            mode="outlined"
            size={20}
            onPress={() => setShowAlert(true)}
            style={styles.notificationButton}
          />
        </View>
      </View>

      {activeWarnings.length > 0 && (
        <ScrollView horizontal style={styles.warningBanner}>
          {activeWarnings.map((warning, index) => (
            <Chip
              key={index}
              style={styles.warningChip}
              textStyle={styles.warningText}
            >
              {`${warning.disaster_category}: ${warning.title}`}
            </Chip>
          ))}
        </ScrollView>
      )}

      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={[
          { value: "all", label: "All Reports" },
          { value: "verified", label: "Verified Only" },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.filterContainer} horizontal>
        {["flood", "fire", "earthquake", "landslide", "cyclone"].map(
          (category) => (
            <Chip
              key={category}
              compact
              selected={filters.disaster_category === category}
              onPress={() =>
                handleFilterChange(
                  "disaster_category",
                  filters.disaster_category === category ? "" : category,
                )
              }
              style={styles.filterChip}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Chip>
          ),
        )}
      </ScrollView>

      <ScrollView style={styles.reportsContainer}>
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          filteredReports(selectedTab === "verified").map((report) => (
            <Card key={report.id} style={styles.reportCard} mode="outlined">
              <Card.Title
                title={report.title}
                titleNumberOfLines={2}
                titleStyle={{ fontSize: 16, fontWeight: "bold" }}
                right={(props) => (
                  <View style={styles.shareButtons}>
                    <Button
                      compact
                      icon="twitter"
                      onPress={() => handleSocialShare(report, "twitter")}
                    />
                    <Button
                      compact
                      icon="facebook"
                      onPress={() => handleSocialShare(report, "facebook")}
                    />
                    <Button
                      compact
                      icon="whatsapp"
                      onPress={() => handleSocialShare(report, "whatsapp")}
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium" style={{ fontSize: 14 }}>
                  {report.description}
                </Text>
                <View style={styles.badgeContainer}>
                  <Chip>{report.disaster_category}</Chip>
                  <Chip
                    mode={
                      report.verification_status === "verified"
                        ? "flat"
                        : "outlined"
                    }
                  >
                    {report.verification_status}
                  </Chip>
                  {report.severity && (
                    <Chip
                      mode="flat"
                      style={
                        report.severity === "critical"
                          ? styles.criticalChip
                          : report.severity === "high"
                            ? styles.highChip
                            : styles.normalChip
                      }
                    >
                      {report.severity}
                    </Chip>
                  )}
                </View>
              </Card.Content>
              <Card.Actions>
                <Text variant="bodySmall" style={styles.timestamp}>
                  {new Date(report.timestamp).toLocaleString()}
                </Text>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={showAlert} onDismiss={() => setShowAlert(false)}>
          <Dialog.Title>Notification Settings</Dialog.Title>
          <Dialog.Content>
            <Text>Choose which types of alerts you want to receive.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAlert(false)}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  warningBanner: {
    backgroundColor: "#FEF3C7",
    padding: 8,
    maxHeight: 60,
  },
  warningChip: {
    marginHorizontal: 4,
    backgroundColor: "#FBBF24",
    height: 36,
  },
  warningText: {
    color: "#000",
    fontSize: 12,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  notificationButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  refreshButton: {
    marginLeft: 4,
    scale: 0.9,
    height: 40,
  },
  refreshButtonContent: {
    height: 40,
    paddingHorizontal: 9,
  },
  segmentedButtons: {
    margin: 12,
  },
  filterContainer: {
    maxHeight: 32,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    height: 32,
    alignSelf: "top",
  },
  reportsContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  reportCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  shareButtons: {
    flexDirection: "row",
    paddingRight: 8,
    scale: 0.8,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  criticalChip: {
    backgroundColor: "#EF4444",
    height: 28,
    scale: 0.9,
  },
  highChip: {
    backgroundColor: "#F59E0B",
    height: 28,
    scale: 0.9,
  },
  normalChip: {
    backgroundColor: "#10B981",
    height: 28,
    scale: 0.9,
  },
  timestamp: {
    color: "#6B7280",
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
});
