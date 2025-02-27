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
  TextInput
} from "react-native-paper";
import { useReports } from "../../hooks/useReports";
import { useLiveUpdates } from "../../hooks/useLiveUpdates";

const DISTRICT_GROUPS = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  Eastern: ["Batticaloa", "Ampara", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
};

export default function DisasterFeed() {
  const {
    reports,
    loading,
    error,
    filters,
    updateFilters,
    refreshReports,
    pagination,
  } = useReports();

  const {
    updates,
    activeWarnings,
    warningStats,
    loading: updatesLoading,
    error: updatesError,
    refresh: refreshUpdates,
  } = useLiveUpdates();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");

  const filterDistricts = (districts) => {
    if (!districtSearch) return districts;
    return districts.filter((district) =>
      district.toLowerCase().includes(districtSearch.toLowerCase()),
    );
  };

  const handleDistrictSelect = (district) => {
    updateFilters({ district });
    setShowDistrictPicker(false);
    setDistrictSearch(""); // Clear search when selection is made
  };

  const currentDistrict = filters.district || "All Districts";

  const handleSocialShare = async (report, platform) => {
    const shareText = encodeURIComponent(
      `${report.title} - ${report.description}\nLocation: ${report.location.address.district}, ${report.location.address.city}`,
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

  const handleFilterChange = (type, value) => {
    updateFilters({ [type]: value });
  };

  const handleTabChange = (value) => {
    setSelectedTab(value);
    updateFilters({ verified_only: value === "verified" });
  };

  if (error || updatesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || updatesError}</Text>
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
            onPress={() => {
              refreshReports();
              refreshUpdates();
            }}
            loading={loading || updatesLoading}
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

      {activeWarnings > 0 && (
        <ScrollView horizontal style={styles.warningBanner}>
          {warningStats.map((warning, index) => (
            <Chip
              key={index}
              style={styles.warningChip}
              textStyle={styles.warningText}
            >
              {`${warning._id}: ${warning.active_warnings} active warnings`}
            </Chip>
          ))}
        </ScrollView>
      )}

      <SegmentedButtons
        value={selectedTab}
        onValueChange={handleTabChange}
        buttons={[
          { value: "all", label: "All Reports" },
          { value: "verified", label: "Verified Only" },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.filterContainer} horizontal>
        <Chip
          mode="outlined"
          onPress={() => setShowDistrictPicker(true)}
          style={[styles.filterChip, styles.districtChip]}
          icon="map-marker"
        >
          {currentDistrict}
        </Chip>
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
          reports.map((report) => (
            <Card key={report.id} style={styles.reportCard} mode="outlined">
              <Card.Title
                title={report.title}
                subtitle={`${report.location.address.district}, ${report.location.address.city}`}
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
                  <Chip mode={report.verified ? "flat" : "outlined"}>
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
                  {new Date(report.date_time).toLocaleString()}
                </Text>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {pagination && pagination.totalPages > 1 && (
        <View style={styles.pagination}>
          <Button
            disabled={pagination.currentPage === 1}
            onPress={() => updateFilters({ page: pagination.currentPage - 1 })}
          >
            Previous
          </Button>
          <Text>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          <Button
            disabled={pagination.currentPage === pagination.totalPages}
            onPress={() => updateFilters({ page: pagination.currentPage + 1 })}
          >
            Next
          </Button>
        </View>
      )}

      <Portal>
        <Dialog
          visible={showDistrictPicker}
          onDismiss={() => {
            setShowDistrictPicker(false);
            setDistrictSearch("");
          }}
          style={styles.districtDialog}
        >
          <Dialog.Title>Select District</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search districts..."
                value={districtSearch}
                onChangeText={setDistrictSearch}
                style={styles.searchInput}
                mode="outlined"
                left={<TextInput.Icon icon="magnify" />}
                clearButtonMode="while-editing"
              />
            </View>
            <ScrollView>
              <Chip
                mode="outlined"
                onPress={() => handleDistrictSelect("")}
                style={styles.districtOption}
                selected={!filters.district}
              >
                All Districts
              </Chip>

              {Object.entries(DISTRICT_GROUPS).map(([province, districts]) => {
                const filteredDistricts = filterDistricts(districts);
                if (districtSearch && filteredDistricts.length === 0)
                  return null;

                return (
                  <View key={province}>
                    {(!districtSearch || filteredDistricts.length > 0) && (
                      <Text style={styles.provinceHeader}>{province}</Text>
                    )}
                    {filteredDistricts.map((district) => (
                      <Chip
                        key={district}
                        mode="outlined"
                        onPress={() => handleDistrictSelect(district)}
                        style={styles.districtOption}
                        selected={filters.district === district}
                      >
                        {district}
                      </Chip>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setShowDistrictPicker(false);
                setDistrictSearch("");
              }}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  districtDialog: {
    maxHeight: "80%",
  },
  dialogScrollArea: {
    paddingHorizontal: 0,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#fff",
    fontSize: 14,
  },
  provinceHeader: {
    fontWeight: "bold",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  districtOption: {
    margin: 4,
    marginHorizontal: 8,
    backgroundColor: "transparent",
  },
  districtChip: {
    backgroundColor: "#fff",
    marginRight: 8,
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
});
