import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  RefreshControl,
  StatusBar,
  FlatList,
} from "react-native";
import {
  useTheme,
  SegmentedButtons,
  Surface,
  Portal,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../../constants/globalProvider";
import { FAB, Modal } from "react-native-paper";
import AddGuideModal from "../../components/resources/AddGuideModal";
import { GuideCard } from "../../components/resources/GuideCard";
import { EmergencyContactCard } from "../../components/resources/EmergencyContactCard";
import { FacilityCard } from "../../components/resources/FacilityCard";
import { FilterHeader } from "../../components/resources/FilterHeader";
import HeaderBar from "../../components/headerBar";
import { facilityApi } from "../../services/resourceApi";

import {
  FACILITY_TYPES,
  STATUS_TYPES,
  GUIDE_CATEGORIES,
} from "../../constants/ResourceContsnts";

const ResourcesScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState({
    guides: {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
      },
    },
    contacts: {
      data: [],
    },
    facilities: {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
      },
    },
  });
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = React.useContext(UserContext);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    guides: "all",
    facilities: "all",
    status: "all",
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 60],
    extrapolate: "clamp",
  });

  const navigationSegments = [
    {
      value: "guides",
      label: "Guides",
      icon: "book-open-variant",
    },
    {
      value: "contacts",
      label: "Emergency",
      icon: "phone-alert",
    },
    {
      value: "facilities",
      label: "Facilities",
      icon: "hospital-building",
    },
  ];

  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => setIsAddModalVisible(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (value) => {
    if (FACILITY_TYPES.some((t) => t.value === value)) {
      setFilters((prev) => ({ ...prev, facilities: value }));
    } else if (STATUS_TYPES.some((s) => s.value === value)) {
      setFilters((prev) => ({ ...prev, status: value }));
    } else {
      setFilters((prev) => ({ ...prev, [activeSection]: value }));
    }
  };

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data, pagination } = await facilityApi.getGuides({
        type: filters.guides !== "all" ? filters.guides : undefined,
        page: 1,
        limit: 20,
      });
      setData((prev) => ({
        ...prev,
        guides: {
          data: data || [],
          pagination,
        },
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      setLoading(true);
      const response = await facilityApi.getEmergencyContacts({});
      setData((prev) => ({ ...prev, contacts: { data: response.data || [] } }));
    } catch (error) {
      setError("Error fetching emergency contacts.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilityApi.getFacilities({
        type: filters.facilities !== "all" ? filters.facilities : undefined,
        availability_status:
          filters.status !== "all" ? filters.status : undefined,
        limit: 20,
        page: 1,
      });
      setData((prev) => ({
        ...prev,
        facilities: { data: response.data || [] },
      }));
    } catch (error) {
      setError("Error fetching facilities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      switch (activeSection) {
        case "guides":
          await fetchGuides();
          break;
        case "contacts":
          await fetchEmergencyContacts();
          break;
        case "facilities":
          await fetchFacilities();
          break;
      }
    };

    fetchData();
  }, [activeSection, filters]);

  const getFiltersForSection = () => {
    switch (activeSection) {
      case "guides":
        return GUIDE_CATEGORIES.map((category) => ({
          ...category,
          selected: filters.guides === category.value,
          key: `guide-${category.value}`,
        }));
      case "facilities":
        return [
          ...FACILITY_TYPES.map((type) => ({
            ...type,
            selected: filters.facilities === type.value,
            key: `facility-${type.value}`,
          })),
          ...STATUS_TYPES.map((status) => ({
            ...status,
            selected: filters.status === status.value,
            key: `status-${status.value}`,
          })),
        ];
      default:
        return [];
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      switch (activeSection) {
        case "guides":
          await fetchGuides();
          break;
        case "contacts":
          await fetchEmergencyContacts();
          break;
        case "facilities":
          await fetchFacilities();
          break;
      }
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  }, [activeSection]);

  const getFilteredData = () => {
    const searchLower = searchQuery.toLowerCase();
    switch (activeSection) {
      case "guides":
        return (data.guides.data || []).filter(
          (guide) =>
            guide.name.toLowerCase().includes(searchLower) ||
            guide.description.toLowerCase().includes(searchLower),
        );
      case "contacts":
        return (data.contacts.data || []).filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchLower) ||
            contact.description.toLowerCase().includes(searchLower),
        );
      case "facilities":
        return (data.facilities.data || []).filter((facility) =>
          facility.name.toLowerCase().includes(searchLower),
        );
      default:
        return [];
    }
  };

  const renderItem = ({ item }) => {
    switch (activeSection) {
      case "guides":
        return <GuideCard guide={item} />;
      case "contacts":
        return <EmergencyContactCard contact={item} />;
      case "facilities":
        return <FacilityCard facility={item} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Emergency Resources"
        subtitle="Guides, contacts, and facilities"
        showBack={false}
        containerStyle={{ marginTop: 32 }}
        showBell={false}
      />

      <View style={styles.subHeader}>
        <SegmentedButtons
          value={activeSection}
          onValueChange={setActiveSection}
          buttons={navigationSegments.map((segment) => ({
            ...segment,
            icon: (props) => (
              <MaterialCommunityIcons
                name={segment.icon}
                size={20}
                color={props.color}
              />
            ),
          }))}
          style={styles.segmentedButtons}
          dense
        />

        <FilterHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          filters={getFiltersForSection()}
          onFilterChange={handleFilterChange}
          placeholder={`Search ${activeSection}...`}
          compact
        />
      </View>

      <FlatList
        data={getFilteredData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 70 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={theme.colors.onSurfaceDisabled}
            />
            <Text style={styles.emptyText}>{error || "No results found"}</Text>
          </View>
        )}
      />

      {loading && (
        <Portal>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" />
          </View>
        </Portal>
      )}

      {isAuthenticated && activeSection === "guides" && (
        <Portal>
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={showAddModal}
            label="Add Guide"
          />
        </Portal>
      )}

      <AddGuideModal
        visible={isAddModalVisible}
        onDismiss={hideAddModal}
        onSubmit={async (guideData) => {
          try {
            setLoading(true);
            await facilityApi.createGuide(guideData);
            await fetchGuides();
            hideAddModal();
          } catch (error) {
            console.error("Error creating guide:", error);
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  subHeader: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  listContent: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ResourcesScreen;
