import React, { useState, useCallback, useRef } from "react";
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

// Import components
import { GuideCard } from "../../components/resources/GuideCard";
import { EmergencyContactCard } from "../../components/resources/EmergencyContactCard";
import { FacilityCard } from "../../components/resources/FacilityCard";
import { FilterHeader } from "../../components/resources/FilterHeader";
import HeaderBar from "../../components/headerBar";

// Import mock data and constants
import {
  MOCK_DATA,
  FACILITY_TYPES,
  STATUS_TYPES,
  GUIDE_CATEGORIES,
} from "../../constants/ResourceContsnts";

const ResourcesScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // State management
  const [activeSection, setActiveSection] = useState("guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    guides: "all",
    facilities: "all",
    status: "all",
  });

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 60],
    extrapolate: "clamp",
  });

  // Navigation segments
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

  // Filter handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (value) => {
    // Check which type of filter was selected
    if (FACILITY_TYPES.some((t) => t.value === value)) {
      setFilters((prev) => ({ ...prev, facilities: value }));
    } else if (STATUS_TYPES.some((s) => s.value === value)) {
      setFilters((prev) => ({ ...prev, status: value }));
    } else {
      setFilters((prev) => ({ ...prev, [activeSection]: value }));
    }
  };

  const getFiltersForSection = () => {
    switch (activeSection) {
      case "guides":
        return GUIDE_CATEGORIES.map((category) => ({
          ...category,
          selected: filters.guides === category.value,
          key: `guide-${category.value}` // Add unique key prefix
        }));
      case "facilities":
        return [
          ...FACILITY_TYPES.map((type) => ({
            ...type,
            selected: filters.facilities === type.value,
            key: `facility-${type.value}` // Add unique key prefix
          })),
          ...STATUS_TYPES.map((status) => ({
            ...status,
            selected: filters.status === status.value,
            key: `status-${status.value}` // Add unique key prefix
          }))
        ];
      default:
        return [];
    }
  };

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Refresh data here
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Filter data based on search query and filters
  const getFilteredData = () => {
    let data = [];
    switch (activeSection) {
      case "guides":
        data = MOCK_DATA.guides.filter((guide) => {
          const matchesSearch =
            guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter =
            filters.guides === "all" || guide.type === filters.guides;
          return matchesSearch && matchesFilter;
        });
        break;
      case "contacts":
        data = MOCK_DATA.contacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
        break;
      case "facilities":
        data = MOCK_DATA.facilities.filter((facility) => {
          const matchesSearch = facility.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesType =
            filters.facilities === "all" ||
            facility.type === filters.facilities;
          const matchesStatus =
            filters.status === "all" ||
            facility.availability_status === filters.status;
          return matchesSearch && matchesType && matchesStatus;
        });
        break;
    }
    return data;
  };

  // Render list items
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
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <HeaderBar
        title="Emergency Resources"
        subtitle="Guides, contacts and facilities"
        showBack={false}
        containerStyle={{ marginTop: 32 }}
      />

      {/* Combine SegmentedButtons and FilterHeader into a more compact header */}
      <View style={styles.subHeader}>
        <SegmentedButtons
          value={activeSection}
          onValueChange={setActiveSection}
          buttons={navigationSegments.map((segment) => ({
            ...segment,
            icon: (props) => (
              <MaterialCommunityIcons
                name={segment.icon}
                size={20} // Reduced icon size
                color={props.color}
              />
            ),
          }))}
          style={styles.segmentedButtons}
          dense // Add dense prop for more compact buttons
        />

        <FilterHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          filters={getFiltersForSection()}
          onFilterChange={handleFilterChange}
          placeholder={`Search ${activeSection}...`}
          compact // Add a compact prop to your FilterHeader component
        />
      </View>

      <FlatList
        data={getFilteredData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
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
            <Text style={styles.emptyText}>No results found</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
