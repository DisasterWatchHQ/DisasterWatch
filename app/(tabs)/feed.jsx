import { useState } from "react";
import {
  View,
  ScrollView,
  Linking,
  StyleSheet,
  RefreshControl,
} from "react-native";
import {
  Button,
  Card,
  Chip,
  Text,
  ActivityIndicator,
  Portal,
  Dialog,
  SegmentedButtons,
  IconButton,
  TextInput,
} from "react-native-paper";
import { useReports } from "../../hooks/useReportsfeed";
import { useLiveUpdates } from "../../hooks/useLiveUpdates";
import HeaderBar from "../../components/HeaderBar";

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
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterDistricts = (districts) => {
    if (!districtSearch) return districts;
    return districts.filter((district) =>
      district.toLowerCase().includes(districtSearch.toLowerCase()),
    );
  };

  const handleDistrictSelect = (district) => {
    updateFilters({ district });
    setShowDistrictPicker(false);
    setDistrictSearch("");
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.district) count++;
    if (filters.disaster_category) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const clearAllFilters = () => {
    updateFilters({
      district: "",
      disaster_category: "",
      verified_only: false,
    });
    setSelectedTab("all");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshReports(), refreshUpdates()]);
    } finally {
      setRefreshing(false);
    }
  };

  if (error || updatesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || updatesError}</Text>
        <Button
          mode="contained"
          onPress={() => {
            refreshReports();
            refreshUpdates();
          }}
          style={styles.errorButton}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Disaster Feed"
        subtitle="Live updates and verified reports"
        rightActions={[
          {
            icon: "bell-outline",
            onPress: () => setShowAlert(true),
            accessibilityLabel: "Notification settings",
          },
          {
            icon: "refresh",
            onPress: () => {
              refreshReports();
              refreshUpdates();
            },
            loading: loading || updatesLoading,
          },
        ]}
      />

      {activeWarnings > 0 && (
        <View style={styles.warningBannerContainer}>
          <View style={styles.warningBannerHeader}>
            <IconButton
              icon="alert"
              size={20}
              style={styles.warningIcon}
              color="#7C2D12"
            />
            <Text style={styles.warningBannerTitle}>Active Warnings</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.warningBanner}
            contentContainerStyle={styles.warningBannerContent}
          >
            {warningStats.map((warning, index) => (
              <Chip
                key={index}
                style={styles.warningChip}
                textStyle={styles.warningText}
                icon="alert"
                mode="flat"
              >
                {`${warning._id}: ${warning.active_warnings} active`}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.quickFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersContent}
        >
          <Chip
            mode={selectedTab === "all" ? "flat" : "outlined"}
            onPress={() => handleTabChange("all")}
            style={[
              styles.quickFilterChip,
              selectedTab === "all" && styles.selectedQuickFilterChip,
            ]}
            textStyle={[
              styles.quickFilterText,
              selectedTab === "all" && styles.selectedQuickFilterText,
            ]}
          >
            All Reports
          </Chip>
          <Chip
            mode={selectedTab === "verified" ? "flat" : "outlined"}
            onPress={() => handleTabChange("verified")}
            style={[
              styles.quickFilterChip,
              selectedTab === "verified" && styles.selectedQuickFilterChip,
            ]}
            textStyle={[
              styles.quickFilterText,
              selectedTab === "verified" && styles.selectedQuickFilterText,
            ]}
          >
            Verified Only
          </Chip>
          <Chip
            mode={showFilterDialog ? "flat" : "outlined"}
            onPress={() => setShowFilterDialog(true)}
            icon="filter-variant"
            style={[
              styles.quickFilterChip,
              showFilterDialog && styles.selectedQuickFilterChip,
            ]}
            textStyle={[
              styles.quickFilterText,
              showFilterDialog && styles.selectedQuickFilterText,
            ]}
          >
            Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
          </Chip>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.reportsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reportsContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color="#3b82f6"
              style={styles.loader}
            />
            <Text style={styles.loaderText}>Loading reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconButton icon="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Reports Found</Text>
            <Text style={styles.emptyText}>
              Try changing your filters or check back later
            </Text>
            <Button
              mode="outlined"
              onPress={() => {
                refreshReports();
                refreshUpdates();
              }}
              style={styles.emptyRefreshButton}
              icon="refresh"
            >
              Refresh
            </Button>
          </View>
        ) : (
          <>
            <View style={styles.resultsSummary}>
              <Text style={styles.resultsSummaryText}>
                Showing {reports.length}{" "}
                {reports.length === 1 ? "report" : "reports"}
                {filters.district ? ` in ${filters.district}` : ""}
                {filters.disaster_category
                  ? ` - ${filters.disaster_category}`
                  : ""}
              </Text>
            </View>

            {reports.map((report) => (
              <Card key={report.id} style={styles.reportCard} mode="outlined">
                <Card.Title
                  title={report.title}
                  titleNumberOfLines={2}
                  titleStyle={styles.cardTitle}
                  right={(props) => (
                    <Chip
                      mode={report.verified ? "flat" : "outlined"}
                      style={
                        report.verified
                          ? styles.verifiedChip
                          : styles.unverifiedChip
                      }
                      textStyle={styles.verificationChipText}
                    >
                      {report.verification_status}
                    </Chip>
                  )}
                />
                <Card.Content>
                  <View style={styles.locationRow}>
                    <IconButton
                      icon="map-marker"
                      size={16}
                      style={styles.locationIcon}
                    />
                    <Text style={styles.locationText}>
                      {`${report.location.address.district}, ${report.location.address.city}`}
                    </Text>
                  </View>

                  <Text variant="bodyMedium" style={styles.reportDescription}>
                    {report.description}
                  </Text>

                  <View style={styles.badgeContainer}>
                    <Chip
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: getCategoryColor(
                            report.disaster_category,
                          ),
                        },
                      ]}
                      textStyle={styles.categoryChipText}
                    >
                      {report.disaster_category}
                    </Chip>
                  </View>

                  <View style={styles.timestampContainer}>
                    <IconButton
                      icon="clock-outline"
                      size={16}
                      style={styles.timestampIcon}
                    />
                    <Text variant="bodySmall" style={styles.timestamp}>
                      {new Date(report.date_time).toLocaleString()}
                    </Text>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <Text style={styles.shareText}>Share:</Text>
                  <View style={styles.shareButtons}>
                    <IconButton
                      icon="twitter"
                      size={20}
                      onPress={() => handleSocialShare(report, "twitter")}
                      style={styles.shareButton}
                      accessibilityLabel="Share on Twitter"
                    />
                    <IconButton
                      icon="facebook"
                      size={20}
                      onPress={() => handleSocialShare(report, "facebook")}
                      style={styles.shareButton}
                      accessibilityLabel="Share on Facebook"
                    />
                    <IconButton
                      icon="whatsapp"
                      size={20}
                      onPress={() => handleSocialShare(report, "whatsapp")}
                      style={styles.shareButton}
                      accessibilityLabel="Share on WhatsApp"
                    />
                  </View>
                </Card.Actions>
              </Card>
            ))}
          </>
        )}

        {pagination && pagination.totalPages > 1 && (
          <View style={styles.pagination}>
            <Button
              mode="contained-tonal"
              disabled={pagination.currentPage === 1}
              onPress={() =>
                updateFilters({ page: pagination.currentPage - 1 })
              }
              icon="chevron-left"
              contentStyle={styles.paginationButtonContent}
              style={styles.paginationButton}
            >
              Previous
            </Button>
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </Text>
            </View>
            <Button
              mode="contained-tonal"
              disabled={pagination.currentPage === pagination.totalPages}
              onPress={() =>
                updateFilters({ page: pagination.currentPage + 1 })
              }
              contentStyle={[
                styles.paginationButtonContent,
                styles.paginationNextButtonContent,
              ]}
              style={styles.paginationButton}
              icon="chevron-right"
            >
              Next
            </Button>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Portal>
        <Dialog
          visible={showFilterDialog}
          onDismiss={() => setShowFilterDialog(false)}
          style={styles.filterDialog}
        >
          <Dialog.Title>Filter Options</Dialog.Title>
          <Dialog.Content>
            <View style={styles.filterContent}>
              <View style={styles.filterHeader}>
                {activeFiltersCount > 0 && (
                  <Button
                    mode="text"
                    onPress={clearAllFilters}
                    textColor="#EF4444"
                    style={styles.clearFiltersButton}
                  >
                    Clear All
                  </Button>
                )}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>
                <Chip
                  mode={filters.district ? "flat" : "outlined"}
                  onPress={() => {
                    setShowFilterDialog(false);
                    setShowDistrictPicker(true);
                  }}
                  style={[
                    styles.filterChip,
                    styles.districtChip,
                    filters.district && styles.selectedFilterChip,
                  ]}
                  icon="map-marker"
                  textStyle={[
                    styles.filterChipText,
                    filters.district && styles.selectedFilterChipText,
                  ]}
                >
                  {currentDistrict}
                </Chip>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Disaster Type</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.disasterCategoryContainer}
                  contentContainerStyle={styles.disasterCategoryContent}
                >
                  {["flood", "fire", "earthquake", "landslide", "cyclone"].map(
                    (category) => (
                      <Chip
                        key={category}
                        selected={filters.disaster_category === category}
                        onPress={() => {
                          handleFilterChange(
                            "disaster_category",
                            filters.disaster_category === category
                              ? ""
                              : category,
                          );
                          setShowFilterDialog(false);
                        }}
                        style={[
                          styles.filterChip,
                          filters.disaster_category === category &&
                            styles.selectedFilterChip,
                        ]}
                        textStyle={[
                          styles.filterChipText,
                          filters.disaster_category === category &&
                            styles.selectedFilterChipText,
                        ]}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Chip>
                    ),
                  )}
                </ScrollView>
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFilterDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search districts..."
              value={districtSearch}
              onChangeText={setDistrictSearch}
              style={styles.searchInput}
              mode="outlined"
              left={<TextInput.Icon icon="magnify" />}
              right={
                districtSearch ? (
                  <TextInput.Icon
                    icon="close"
                    onPress={() => setDistrictSearch("")}
                  />
                ) : null
              }
            />
          </View>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView contentContainerStyle={styles.districtScrollContent}>
              <Chip
                mode="outlined"
                onPress={() => handleDistrictSelect("")}
                style={[
                  styles.districtOption,
                  !filters.district && styles.selectedDistrictOption,
                ]}
                textStyle={
                  !filters.district
                    ? styles.selectedDistrictOptionText
                    : undefined
                }
              >
                All Districts
              </Chip>

              {Object.entries(DISTRICT_GROUPS).map(([province, districts]) => {
                const filteredDistricts = filterDistricts(districts);
                if (districtSearch && filteredDistricts.length === 0)
                  return null;

                return (
                  <View key={province} style={styles.provinceSection}>
                    {(!districtSearch || filteredDistricts.length > 0) && (
                      <Text style={styles.provinceHeader}>{province}</Text>
                    )}
                    <View style={styles.districtGrid}>
                      {filteredDistricts.map((district) => (
                        <Chip
                          key={district}
                          mode="outlined"
                          onPress={() => handleDistrictSelect(district)}
                          style={[
                            styles.districtOption,
                            filters.district === district &&
                              styles.selectedDistrictOption,
                          ]}
                          textStyle={
                            filters.district === district
                              ? styles.selectedDistrictOptionText
                              : undefined
                          }
                        >
                          {district}
                        </Chip>
                      ))}
                    </View>
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
          <Dialog.Title>Alert Preferences</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSubtitle}>
              Choose which alerts you want to receive
            </Text>

            <View style={styles.notificationOption}>
              <Text style={styles.notificationLabel}>Critical Alerts</Text>
              <Chip mode="outlined" style={styles.notificationChip} selected>
                Enabled
              </Chip>
            </View>

            <View style={styles.notificationOption}>
              <Text style={styles.notificationLabel}>Verified Reports</Text>
              <Chip mode="outlined" style={styles.notificationChip} selected>
                Enabled
              </Chip>
            </View>

            <View style={styles.notificationOption}>
              <Text style={styles.notificationLabel}>Nearby Incidents</Text>
              <Chip mode="outlined" style={styles.notificationChip}>
                Disabled
              </Chip>
            </View>

            <View style={styles.notificationOption}>
              <Text style={styles.notificationLabel}>Daily Summaries</Text>
              <Chip mode="outlined" style={styles.notificationChip}>
                Disabled
              </Chip>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAlert(false)}>Cancel</Button>
            <Button mode="contained" onPress={() => setShowAlert(false)}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const getCategoryColor = (category) => {
  const colors = {
    flood: "#60A5FA",
    fire: "#F87171",
    earthquake: "#FBBF24",
    landslide: "#34D399",
    cyclone: "#A78BFA",
  };
  return colors[category] || "#E5E7EB";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: 30,
    paddingBottom: 40,
  },
  warningBannerContainer: {
    backgroundColor: "#FFEDD5",
    padding: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDBA74",
  },
  warningBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  warningIcon: {
    margin: 0,
    marginRight: 4,
  },
  warningBannerTitle: {
    fontWeight: "bold",
    color: "#7C2D12",
  },
  warningBanner: {
    flexDirection: "row",
  },
  warningBannerContent: {
    paddingRight: 8,
  },
  warningChip: {
    backgroundColor: "#FED7AA",
    marginRight: 8,
  },
  warningText: {
    color: "#7C2D12",
  },
  quickFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickFiltersContent: {
    flexDirection: "row",
  },
  quickFilterChip: {
    marginRight: 8,
  },
  selectedQuickFilterChip: {
    backgroundColor: "#3b82f6",
  },
  quickFilterText: {
    fontSize: 12,
  },
  selectedQuickFilterText: {
    color: "white",
  },
  reportsContainer: {
    flex: 1,
  },
  reportsContent: {
    paddingHorizontal: 16,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  loader: {
    marginBottom: 16,
  },
  loaderText: {
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5563",
    marginTop: 8,
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  emptyRefreshButton: {
    marginTop: 8,
  },
  resultsSummary: {
    marginBottom: 12,
  },
  resultsSummaryText: {
    color: "#6B7280",
    fontSize: 14,
  },
  reportCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  verifiedChip: {
    backgroundColor: "#D1FAE5",
  },
  unverifiedChip: {
    backgroundColor: "transparent",
    borderColor: "#E5E7EB",
  },
  verificationChipText: {
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8,
  },
  locationIcon: {
    margin: 0,
  },
  locationText: {
    color: "#6B7280",
    flex: 1,
  },
  reportDescription: {
    marginVertical: 8,
    lineHeight: 20,
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  categoryChipText: {
    color: "white",
    fontWeight: "500",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8,
    marginTop: 8,
  },
  timestampIcon: {
    margin: 0,
  },
  timestamp: {
    color: "#9CA3AF",
  },
  cardActions: {
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  shareText: {
    marginRight: 8,
    color: "#6B7280",
  },
  shareButtons: {
    flexDirection: "row",
  },
  shareButton: {
    margin: 0,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  paginationButton: {
    minWidth: 100,
  },
  paginationButtonContent: {
    flexDirection: "row-reverse",
  },
  paginationNextButtonContent: {
    flexDirection: "row",
  },
  paginationInfo: {
    alignItems: "center",
  },
  paginationText: {
    color: "#6B7280",
  },
  bottomSpacer: {
    height: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#B91C1C",
    marginBottom: 16,
    textAlign: "center",
  },
  errorButton: {
    marginTop: 8,
  },
  districtDialog: {
    maxHeight: "80%",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    marginBottom: 8,
  },
  dialogScrollArea: {
    marginHorizontal: 0,
  },
  districtScrollContent: {
    padding: 16,
  },
  provinceSection: {
    marginBottom: 16,
  },
  provinceHeader: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4B5563",
  },
  districtGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  districtOption: {
    margin: 4,
    backgroundColor: "white",
  },
  selectedDistrictOption: {
    backgroundColor: "#3b82f6",
  },
  selectedDistrictOptionText: {
    color: "white",
  },
  dialogSubtitle: {
    color: "#6B7280",
    marginBottom: 16,
  },
  notificationOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  notificationLabel: {
    fontSize: 16,
  },
  notificationChip: {
    minWidth: 90,
    justifyContent: "center",
  },
  filterDialog: {
    maxHeight: "80%",
    borderRadius: 20,
  },
  filterContent: {
    padding: 8,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    height: 36,
  },
  selectedFilterChip: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipText: {
    color: "#4b5563",
    fontSize: 13,
  },
  selectedFilterChipText: {
    color: "#ffffff",
  },
  districtChip: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    height: 36,
  },
});
