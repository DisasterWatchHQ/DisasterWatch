import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Button,
  useTheme,
  ActivityIndicator,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
} from "react-native-paper";
import { UserContext } from "../constants/globalProvider";
import api from "../services/dash";
import WarningForm from "../components/warnings/WarningForm";

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWarningModalVisible, setWarningModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [updateText, setUpdateText] = useState("");
  const [severityChange, setSeverityChange] = useState("");

  const [dashboardStats, setDashboardStats] = useState({
    pendingCount: 0,
    verifiedToday: 0,
    activeIncidents: 0,
    avgVerificationTime: 0,
  });
  const [pendingReports, setPendingReports] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse, warningsResponse] =
        await Promise.all([
          api.get("/userReport/stats/verification"),
          api.get("/userReport/public", {
            params: { verification_status: "pending", limit: 5 },
          }),
          api.get("/warning/active"),
        ]);

      setDashboardStats({
        pendingCount: statsResponse.data.pendingCount,
        verifiedToday: statsResponse.data.verifiedToday,
        activeIncidents: statsResponse.data.activeIncidents,
        avgVerificationTime: Math.round(statsResponse.data.avgVerificationTime),
      });

      setPendingReports(
        reportsResponse.data.reports.map((report) => ({
          title: report.title,
          id: report.id,
          type: report.disaster_category,
          location: `${report.location.address.district}, ${report.location.address.city}`,
          timestamp: new Date(report.date_time).toLocaleString(),
          urgency: report.verification?.severity || "Medium",
        })),
      );

      setActiveWarnings(warningsResponse.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Alert.alert("Error", "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      if (action === "verify") {
        await api.post(`/userReport/${reportId}/verify`, {
          severity: "medium",
          notes: "Verified through mobile dashboard",
        });
      } else if (action === "dismiss") {
        await api.post(`/userReport/${reportId}/dismiss`, {
          notes: "Dismissed through mobile dashboard",
        });
      }

      // Refresh the dashboard data after action
      fetchDashboardData();
      Alert.alert(
        "Success",
        `Report ${action === "verify" ? "verified" : "dismissed"} successfully`,
      );
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
      Alert.alert("Error", `Failed to ${action} report. Please try again.`);
    }
  };

  const handleWarningUpdate = async (warningId) => {
    try {
      const updateData = {
        update_text: updateText,
        updated_by: user.id,
        updated_at: new Date(),
        severity_change: severityChange || undefined,
      };

      await api.post(`/warning/${warningId}/updates`, updateData);

      setUpdateModalVisible(false);
      setUpdateText("");
      setSeverityChange("");
      fetchDashboardData();
      Alert.alert("Success", "Warning updated successfully");
    } catch (error) {
      console.error("Error updating warning:", error);
      Alert.alert("Error", "Failed to update warning");
    }
  };

  const handleResolveWarning = async (warningId) => {
    try {
      const resolutionData = {
        status: "resolved",
        resolved_by: user.id,
        resolution_notes: "Warning resolved through mobile dashboard",
        resolved_at: new Date(),
      };

      await api.post(`/warning/${warningId}/resolve`, resolutionData);
      fetchDashboardData();
      Alert.alert("Success", "Warning resolved successfully");
    } catch (error) {
      console.error("Error resolving warning:", error);
      Alert.alert("Error", "Failed to resolve warning");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showUpdateModal = (warning) => {
    setSelectedWarning(warning);
    setUpdateModalVisible(true);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchDashboardData}
          />
        }
      >
        <View style={{ padding: 16 }}>
          {/* Stats Cards */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Card style={{ flex: 1, minWidth: "48%" }}>
              <Card.Content>
                <Text variant="titleMedium">Pending</Text>
                <Text variant="headlineMedium">
                  {dashboardStats.pendingCount}
                </Text>
              </Card.Content>
            </Card>

            <Card style={{ flex: 1, minWidth: "48%" }}>
              <Card.Content>
                <Text variant="titleMedium">Verified Today</Text>
                <Text variant="headlineMedium">
                  {dashboardStats.verifiedToday}
                </Text>
              </Card.Content>
            </Card>

            <Card style={{ flex: 1, minWidth: "48%" }}>
              <Card.Content>
                <Text variant="titleMedium">Active Incidents</Text>
                <Text variant="headlineMedium">
                  {dashboardStats.activeIncidents}
                </Text>
              </Card.Content>
            </Card>

            <Card style={{ flex: 1, minWidth: "48%" }}>
              <Card.Content>
                <Text variant="titleMedium">Avg Response Time</Text>
                <Text variant="headlineMedium">
                  {dashboardStats.avgVerificationTime}h
                </Text>
              </Card.Content>
            </Card>
          </View>
          <Button
            mode="contained"
            onPress={() => setWarningModalVisible(true)}
            style={{ marginVertical: 16 }}
          >
            Create Warning
          </Button>

          {/* Active Warnings */}
          <Card style={{ marginTop: 16 }}>
            <Card.Title title="Active Warnings" />
            <Card.Content>
              {activeWarnings.map((warning) => (
                <View
                  key={warning._id}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.outlineVariant,
                  }}
                >
                  <Text variant="titleMedium">{warning.title}</Text>
                  <Text variant="bodyMedium">
                    {warning.disaster_category} - Severity: {warning.severity}
                  </Text>
                  <Text variant="bodySmall">
                    Created: {new Date(warning.created_at).toLocaleString()}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                    <Button
                      mode="outlined"
                      onPress={() => showUpdateModal(warning)}
                    >
                      Add Update
                    </Button>
                    {warning.status !== "resolved" && (
                      <Button
                        mode="outlined"
                        onPress={() => handleResolveWarning(warning._id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Pending Reports */}
          <Card style={{ marginTop: 16 }}>
            <Card.Title title="Pending Reports" />
            <Card.Content>
              {pendingReports.map((report) => (
                <View
                  key={report.id}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.outlineVariant,
                  }}
                >
                  <Text variant="titleMedium">{report.title}</Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {report.type} - {report.location}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {report.timestamp}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                    <Button
                      mode="outlined"
                      onPress={() => handleReportAction(report.id, "verify")}
                      compact
                    >
                      Verify
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleReportAction(report.id, "dismiss")}
                      compact
                    >
                      Dismiss
                    </Button>
                  </View>
                </View>
              ))}
              {pendingReports.length === 0 && (
                <Text
                  variant="bodyMedium"
                  style={{
                    textAlign: "center",
                    color: theme.colors.onSurfaceVariant,
                  }}
                >
                  No pending reports
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={isWarningModalVisible}
          onDismiss={() => setWarningModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            padding: 20,
            margin: 20,
            borderRadius: 8,
          }}
        >
          <WarningForm
            onSubmit={async (data) => {
              try {
                await api.post("/warning", data);
                setWarningModalVisible(false);
                fetchDashboardData();
                Alert.alert("Success", "Warning created successfully");
              } catch (error) {
                Alert.alert("Error", "Failed to create warning");
              }
            }}
            onCancel={() => setWarningModalVisible(false)}
          />
        </Modal>
      </Portal>

      {/* Warning Update Modal */}
      <Portal>
        <Modal
          visible={isUpdateModalVisible}
          onDismiss={() => setUpdateModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            padding: 20,
            margin: 20,
            borderRadius: 8,
          }}
        >
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            Add Warning Update
          </Text>
          <TextInput
            label="Update Details"
            value={updateText}
            onChangeText={setUpdateText}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 16 }}
          />
          <SegmentedButtons
            value={severityChange}
            onValueChange={setSeverityChange}
            buttons={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
            style={{ marginBottom: 16 }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}
          >
            <Button
              mode="outlined"
              onPress={() => setUpdateModalVisible(false)}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={() => handleWarningUpdate(selectedWarning._id)}
              disabled={!updateText.trim()}
            >
              Submit Update
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default Dashboard;
