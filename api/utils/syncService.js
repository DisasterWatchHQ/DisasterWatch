import NetInfo from "@react-native-community/netinfo";
import offlineStorage from "./offlineStorage";
import { warningApi } from "../services/warnings";
import { resourceApi } from "../services/resources";

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.lastOnlineStatus = true;
    this.setupNetworkListener();
  }

  setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable;

      if (isOnline && !this.lastOnlineStatus) {
        this.handleConnectionRestored();
      }

      this.lastOnlineStatus = isOnline;
    });
  }

  async handleConnectionRestored() {
    try {
      const pendingActions = await offlineStorage.getPendingActions();

      if (pendingActions.length > 0 || (await this.shouldSync())) {
        await this.syncData();
      }
    } catch (error) {
      console.error("Error handling connection restore:", error);
    }
  }

  async syncData() {
    if (this.isSyncing) return;

    try {
      this.isSyncing = true;

      const pendingActions = await offlineStorage.getPendingActions();

      for (const action of pendingActions) {
        await this.processPendingAction(action);
      }

      await Promise.all([
        this.syncDisasters(),
        this.syncEmergencyContacts(),
        this.syncFacilities(),
      ]);

      await offlineStorage.updateLastSync();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      this.isSyncing = false;
    }
  }

  async processPendingAction(action) {
    try {

      switch (action.type) {
        case "CREATE_DISASTER_REPORT":
          await warningApi.createWarning(action.data);
          break;
        case "UPDATE_DISASTER_STATUS":
          await warningApi.updateWarning(action.data.id, action.data);
          break;
        case "ADD_EMERGENCY_CONTACT":
          await resourceApi.addEmergencyContact(action.data);
          break;
        case "UPDATE_EMERGENCY_CONTACT":
          await resourceApi.updateEmergencyContact(action.data.id, action.data);
          break;
        default:
          console.warn(`Unknown action type: ${action.type}`);
          return;
      }

      await offlineStorage.clearPendingAction(action.id);
    } catch (error) {
      console.error(`Error processing action ${action.type}:`, error);
      if (error.status === 409) {
        await this.handleConflict(action);
      }
    }
  }

  async handleConflict(action) {
    let serverData;
    try {
      switch (action.type) {
        case "UPDATE_DISASTER_STATUS":
          serverData = await warningApi.getWarning(action.data.id);
          break;
        case "UPDATE_EMERGENCY_CONTACT":
          serverData = await resourceApi.getEmergencyContact(action.data.id);
          break;
        default:
          return;
      }

      switch (action.type) {
        case "UPDATE_DISASTER_STATUS":
          await offlineStorage.storeDisasters([serverData]);
          break;
        case "UPDATE_EMERGENCY_CONTACT":
          await offlineStorage.storeEmergencyContacts([serverData]);
          break;
      }
    } catch (error) {
      console.error("Error handling conflict:", error);
    }
  }

  async syncDisasters() {
    try {
      const disasters = await warningApi.getWarnings();
      await offlineStorage.storeDisasters(disasters);
    } catch (error) {
      console.error("Error syncing disasters:", error);
    }
  }

  async syncEmergencyContacts() {
    try {
      const contacts = await resourceApi.getEmergencyContacts();
      await offlineStorage.storeEmergencyContacts(contacts);
    } catch (error) {
      console.error("Error syncing emergency contacts:", error);
    }
  }

  async syncFacilities() {
    try {
      const facilities = await resourceApi.getFacilities();
      await offlineStorage.storeFacilities(facilities);
    } catch (error) {
      console.error("Error syncing facilities:", error);
    }
  }

  async forceSyncData() {
    await this.syncData();
  }

  async shouldSync() {
    const lastSync = await offlineStorage.getLastSync();
    if (!lastSync) return true;

    const now = new Date();
    const lastSyncDate = new Date(lastSync);
    const minutesSinceLastSync = (now - lastSyncDate) / (1000 * 60);

    return minutesSinceLastSync > 15;
  }
}

export default new SyncService();
