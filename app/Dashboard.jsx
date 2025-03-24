import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Button,
  useTheme,
  ActivityIndicator,
  Surface,
  FAB,
  Portal,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HeaderBar from "../components/HeaderBar";
import api from "../api/services/dash";
import wardash from "../api/services/wardash";
import CreateWarningDialog from "../components/warnings/CreateWarningDialog";
import { WarningActions } from "../components/warnings/WarningActions";
import { useRouter } from "expo-router";
import ResourceModals from "../components/resources/ResourceModals";
import { resources } from "../api/services/api";
import * as SecureStore from "expo-secure-store";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card style={styles.statsCard}>
      <Card.Content>
        <View style={styles.statsCardHeader}>
          <MaterialCommunityIcons name={icon} size={28} color={color} />
          <Text
            variant="headlineMedium"
            style={{ color: color, fontWeight: "bold" }}
          >
            {value}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.statsCardTitle}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
};

const PendingReportCard = ({ report, onVerify, onReject }) => {
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Date unavailable";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Date unavailable";
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  return (
    <Card style={styles.reportCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.reportTitle}>
          {report.title}
        </Text>
        <Text variant="bodyMedium" style={styles.reportDetails}>
          {`${report.type} - ${report.location}`}
        </Text>
        <Text variant="bodySmall" style={styles.reportTimestamp}>
          {formatDate(report.timestamp)}
        </Text>

        <View style={styles.reportActions}>
          <Button
            mode="contained"
            onPress={() => onVerify(report.id)}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
          >
            Verify
          </Button>
          <Button
            mode="outlined"
            onPress={() => onReject(report.id)}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
          >
            Dismiss
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const ActiveWarningCard = ({ warning }) => {
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Date unavailable";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Date unavailable";
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  return (
    <Card style={styles.warningCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.warningTitle}>
          {warning.title}
        </Text>
        <Text variant="bodyMedium" style={styles.warningDetails}>
          {warning.disaster_category} - Severity: {warning.severity}
        </Text>
        <Text variant="bodySmall" style={styles.warningTimestamp}>
          Created: {formatDate(warning.created_at)}
        </Text>
        {warning.updates?.length > 0 && (
          <Text variant="bodyMedium" style={styles.warningUpdate}>
            Last update:{" "}
            {warning.updates[warning.updates.length - 1].update_text}
          </Text>
        )}
        <WarningActions warning={warning} />
      </Card.Content>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const router = useRouter();
  const [fabOpen, setFabOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    pendingCount: 0,
    verifiedToday: 0,
    activeIncidents: 0,
    avgVerificationTime: 0,
    totalReports: 0,
    reportTypes: [],
  });
  const [pendingReports, setPendingReports] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);

  const onStateChange = ({ open }) => setFabOpen(open);
  const handleModalDismiss = () => {
    setVisibleModal(null);
  };
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        verificationStats,
        reportStats,
        reportsResponse,
        warningsResponse,
        feedStats,
      ] = await Promise.all([
        api.get("/reports/stats/verification"),
        api.get("/reports/stats"),
        api.get("/reports/public", {
          params: { verification_status: "pending", limit: 5 },
        }),
        wardash.get("/warnings/active"),
        api.get("/reports/feedstats"),
      ]);

      // Combine all stats
      setDashboardStats({
        pendingCount: verificationStats.data.pendingCount || 0,
        verifiedToday: verificationStats.data.verifiedToday || 0,
        activeIncidents: verificationStats.data.activeIncidents || 0,
        avgVerificationTime: Math.round(
          verificationStats.data.avgVerificationTime || 0,
        ),
        totalReports:
          reportStats.data.byStatus?.reduce(
            (acc, curr) => acc + curr.count,
            0,
          ) || 0,
        reportTypes: reportStats.data.byCategory || [],
      });

      // Set pending reports
      if (reportsResponse.data && reportsResponse.data.reports) {
        setPendingReports(
          reportsResponse.data.reports.map((report) => ({
            id: report._id || report.id,
            title: report.title,
            type: report.disaster_category,
            location: report.location?.address
              ? `${report.location.address.district || ""}, ${report.location.address.city || ""}`
              : "Location not specified",
            timestamp: report.date_time || report.createdAt,
          })),
        );
      } else {
        setPendingReports([]);
      }

      // Set active warnings
      if (warningsResponse.data && warningsResponse.data.data) {
        setActiveWarnings(warningsResponse.data.data);
      } else {
        setActiveWarnings([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);

        if (error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again.",
            [
              {
                text: "OK",
                onPress: () => router.push("/login"),
              },
            ],
          );
        } else if (error.response.status === 404) {
          Alert.alert(
            "API Error",
            "The requested endpoint was not found. Please check your API configuration.",
            [{ text: "OK" }],
          );
        } else {
          Alert.alert(
            "Error",
            "Failed to fetch dashboard data. Please try again later.",
            [{ text: "OK" }],
          );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection.",
          [{ text: "OK" }],
        );
      } else {
        console.error("Error setting up request:", error.message);
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }],
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleResourceSubmit = async (type, data) => {
    try {
      let response;
      switch (type) {
        case "guide":
          response = await resources.createGuide(data);
          break;
        case "contact":
          response = await resources.createEmergencyContact(data);
          break;
        case "facility":
          response = await resources.createFacility(data);
          break;
      }
      Alert.alert("Success", `${type} created successfully`);
      handleModalDismiss();
    } catch (error) {
      console.error("Error creating resource:", error);
      Alert.alert("Error", error.message || `Failed to create ${type}`);
    }
  };
  const handleVerifyReport = async (reportId) => {
    try {
      const response = await api.post(`/reports/${reportId}/verify`, {
        severity: "medium",
        notes: "Verified through dashboard",
      });

      await fetchDashboardData();
      Alert.alert("Success", "Report verified successfully");
    } catch (error) {
      console.error("Error verifying report:", error);
      console.error("Full error object:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // More specific error handling
      if (error.response?.status === 401) {
        Alert.alert("Error", "Please log in again to verify reports");
        router.push("/login");
      } else if (error.response?.status === 403) {
        Alert.alert("Error", "You don't have permission to verify reports");
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to verify report",
        );
      }
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      const response = await api.post(`/reports/${reportId}/dismiss`, {
        notes: "Dismissed through dashboard",
      });

      await fetchDashboardData();
      Alert.alert("Success", "Report dismissed successfully");
    } catch (error) {
      console.error("Error dismissing report:", error);
      console.error("Full error object:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // More specific error handling
      if (error.response?.status === 401) {
        Alert.alert("Error", "Please log in again to dismiss reports");
        router.push("/login");
      } else if (error.response?.status === 403) {
        Alert.alert("Error", "You don't have permission to dismiss reports");
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to dismiss report",
        );
      }
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <HeaderBar title="Dashboard" showBack={false} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar
        title="Dashboard"
        showBack={false}
        subtitle="Disaster Management Overview"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <View style={styles.statsGrid}>
          <StatsCard
            title="Pending Reports"
            value={dashboardStats.pendingCount}
            icon="clock-outline"
            color={theme.colors.warning}
          />
          <StatsCard
            title="Verified Today"
            value={dashboardStats.verifiedToday}
            icon="check-circle-outline"
            color={theme.colors.success}
          />
          <StatsCard
            title="Total Reports"
            value={dashboardStats.totalReports}
            icon="file-document-outline"
            color={theme.colors.primary}
          />
          <StatsCard
            title="Avg Response Time"
            value={`${dashboardStats.avgVerificationTime}h`}
            icon="clock-alert-outline"
            color={theme.colors.error}
          />
        </View>

        <Surface style={styles.section}>
          <Text variant="headlineMedium" style={styles.sectionTitle}>
            Pending Reports
          </Text>
          {pendingReports.length > 0 ? (
            pendingReports.map((report) => (
              <PendingReportCard
                key={report.id}
                report={report}
                onVerify={handleVerifyReport}
                onReject={handleRejectReport}
              />
            ))
          ) : (
            <Text style={styles.emptyMessage}>
              No pending reports to verify
            </Text>
          )}
        </Surface>

        <Surface style={styles.section}>
          <Text variant="headlineMedium" style={styles.sectionTitle}>
            Active Warnings
          </Text>
          <CreateWarningDialog onWarningCreated={fetchDashboardData} />
          {activeWarnings.map((warning) => (
            <ActiveWarningCard key={warning._id} warning={warning} />
          ))}
        </Surface>
      </ScrollView>

      <Portal>
        <ResourceModals
          visibleModal={visibleModal}
          onDismiss={handleModalDismiss}
          onSubmit={handleResourceSubmit}
        />
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? "close" : "plus"}
          actions={[
            {
              icon: "home",
              label: "Home",
              onPress: () => router.push("/home"),
            },
            {
              icon: "tab",
              label: "Dashboard",
              onPress: () => router.push("/Dashboard"),
            },
            {
              icon: "plus",
              label: "New Report",
              onPress: () => router.push("/report"),
            },
            {
              icon: "book-plus",
              label: "New Guide",
              onPress: () => setVisibleModal("guide"),
            },
            {
              icon: "phone-plus",
              label: "New Contact",
              onPress: () => setVisibleModal("contact"),
            },
            {
              icon: "hospital-building",
              label: "New Facility",
              onPress: () => setVisibleModal("facility"),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (fabOpen) {
              setFabOpen(false);
            }
          }}
          style={styles.fabGroup}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: "45%",
    elevation: 2,
    borderRadius: 12,
  },
  statsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statsCardTitle: {
    color: "#666",
  },
  section: {
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  reportCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  reportTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  reportDetails: {
    opacity: 0.8,
    marginBottom: 4,
  },
  reportTimestamp: {
    opacity: 0.6,
  },
  reportActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    minWidth: 100,
  },
  buttonLabel: {
    fontSize: 14,
  },
  warningCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  warningTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  warningDetails: {
    opacity: 0.8,
    marginBottom: 4,
  },
  warningTimestamp: {
    opacity: 0.6,
    marginBottom: 8,
  },
  warningUpdate: {
    opacity: 0.8,
    marginBottom: 12,
    fontStyle: "italic",
  },
  emptyMessage: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 16,
  },
  fabGroup: {
    paddingBottom: 50,
  },
});

export default Dashboard;
