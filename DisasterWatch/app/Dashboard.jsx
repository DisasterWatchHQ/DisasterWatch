import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Button,
  useTheme,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HeaderBar from "../components/headerBar";
import api from "../services/dash";
import wardash from "../services/wardash";
import CreateWarningDialog from "../components/warnings/CreateWarningDialog";
import { WarningActions } from "../components/warnings/WarningActions";

const StatsCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Card style={{ margin: 5, flex: 1 }}>
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name={icon} size={24} color={color} />
          <Text variant="titleMedium">{value}</Text>
        </View>
        <Text variant="bodySmall" style={{ marginTop: 5 }}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
};

const PendingReportCard = ({ report, onVerify, onReject }) => {
  return (
    <Card style={{ marginVertical: 5 }}>
      <Card.Content>
        <Text variant="titleMedium">{report.title}</Text>
        <Text variant="bodySmall">{`${report.type} - ${report.location}`}</Text>
        <Text variant="bodySmall">
          {new Date(report.timestamp).toLocaleString()}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <Button
            mode="outlined"
            onPress={() => onVerify(report.id)}
            style={{ marginRight: 10 }}
          >
            Verify
          </Button>
          <Button mode="outlined" onPress={() => onReject(report.id)}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <HeaderBar
        title="Dashboard"
        showBack={false}
        subtitle="Disaster Management Overview"
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Stats Grid */}
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}
        >
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

        <Divider style={{ marginVertical: 16 }} />

        <View style={{ marginTop: 16 }}>
          <CreateWarningDialog />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text variant="titleLarge">Active Warnings</Text>
          {activeWarnings.map((warning) => (
            <Card key={warning._id} style={{ marginTop: 8 }}>
              <Card.Content>
                <Text variant="titleMedium">{warning.title}</Text>
                <Text variant="bodySmall">
                  {warning.disaster_category} - Severity: {warning.severity}
                </Text>
                <Text variant="bodySmall">
                  Created: {new Date(warning.created_at).toLocaleString()}
                </Text>
                {warning.updates.length > 0 && (
                  <Text variant="bodySmall">
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
        </View>

        {/* Pending Reports Section */}
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
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
          <Text
            style={{
              textAlign: "center",
              color: theme.colors.onSurfaceVariant,
            }}
          >
            No pending reports to verify
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
