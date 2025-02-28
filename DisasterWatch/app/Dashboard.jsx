import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Button,
  useTheme,
  ActivityIndicator,
  Divider,
  Surface,
  FAB,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HeaderBar from "../components/headerBar";
import api from "../services/dash";
import wardash from "../services/wardash";
import CreateWarningDialog from "../components/warnings/CreateWarningDialog";
import { WarningActions } from "../components/warnings/WarningActions";
import { useNavigation } from "@react-navigation/native";

const StatsCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

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
          {new Date(report.timestamp).toLocaleString()}
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
            Reject
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [dashboardStats, setDashboardStats] = useState({
    pendingCount: 0,
    verifiedToday: 0,
    activeIncidents: 0,
    avgVerificationTime: 0,
  });
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWarnings, setActiveWarnings] = useState([]);
  const navigation = useNavigation();
  const fetchActiveWarnings = async () => {
    try {
      const response = await wardash.get("/warning/active");
      setActiveWarnings(response.data.data);
    } catch (error) {
      console.error("Error fetching active warnings:", error);
      Alert.alert("Error", "Failed to fetch active warnings");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse, warningsResponse] =
        await Promise.all([
          api.get("/userReport/stats/verification"),
          api.get("/userReport/public", {
            params: { verification_status: "pending", limit: 5 },
          }),
          wardash.get("/warning/active"),
        ]);

      setDashboardStats({
        pendingCount: statsResponse.data.pendingCount,
        verifiedToday: statsResponse.data.verifiedToday,
        activeIncidents: statsResponse.data.activeIncidents,
        avgVerificationTime: Math.round(statsResponse.data.avgVerificationTime),
      });

      setPendingReports(
        reportsResponse.data.reports.map((report) => ({
          id: report.id, // Make sure this matches your API response
          title: report.title,
          type: report.disaster_category,
          location: report.location?.address
            ? `${report.location.address.district || ""}, ${report.location.address.city || ""}`
            : "Location not specified",
          timestamp: report.date_time,
        })),
      );
      setActiveWarnings(warningsResponse.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async (reportId) => {
    try {
      await api.post(`/userReport/${reportId}/verify`, {
        severity: "medium",
        notes: "Verified through dashboard",
      });
      fetchDashboardData(); // Refresh data after verification
      Alert.alert("Success", "Report verified successfully");
    } catch (error) {
      console.error("Error verifying report:", error);
      Alert.alert("Error", "Failed to verify report");
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      await api.post(`/userReport/${reportId}/dismiss`, {
        notes: "Dismissed through dashboard",
      });
      fetchDashboardData(); // Refresh data after rejection
      Alert.alert("Success", "Report rejected successfully");
    } catch (error) {
      console.error("Error rejecting report:", error);
      Alert.alert("Error", "Failed to reject report");
    }
  };

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Pending Verification"
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
            title="Active Incidents"
            value={dashboardStats.activeIncidents}
            icon="alert-outline"
            color={theme.colors.error}
          />
          <StatsCard
            title="Avg Response Time"
            value={`${dashboardStats.avgVerificationTime}h`}
            icon="clock-alert-outline"
            color={theme.colors.primary}
          />
        </View>

        <Surface style={styles.section}>
          <Text variant="headlineMedium" style={styles.sectionTitle}>
            Active Warnings
          </Text>
          <CreateWarningDialog />
          {activeWarnings.map((warning) => (
            <Card key={warning._id} style={styles.warningCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.warningTitle}>
                  {warning.title}
                </Text>
                <Text variant="bodyMedium" style={styles.warningDetails}>
                  {warning.disaster_category} - Severity: {warning.severity}
                </Text>
                <Text variant="bodySmall" style={styles.warningTimestamp}>
                  Created: {new Date(warning.created_at).toLocaleString()}
                </Text>
                {warning.updates.length > 0 && (
                  <Text variant="bodyMedium" style={styles.warningUpdate}>
                    Last update:{" "}
                    {warning.updates[warning.updates.length - 1].update_text}
                  </Text>
                )}
                <WarningActions
                  warning={warning}
                  onUpdate={() => fetchActiveWarnings()}
                />
              </Card.Content>
            </Card>
          ))}
        </Surface>

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
      </ScrollView>
      <FAB
        icon="tab"
        style={styles.fab}
        onPress={() => navigation.navigate("(tabs)")}
        label="Go to Tabs"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light background color
  },
  scrollContent: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    width: "47%",
    elevation: 2,
    borderRadius: 12,
  },
  statsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statsCardTitle: {
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
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
});

export default Dashboard;
