import NetInfo from '@react-native-community/netinfo';
import offlineStorage from './offlineStorage';
import { warningApi } from './warningApi';
import { resourceApi } from './resourceApi';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.lastOnlineStatus = true;
    this.setupNetworkListener();
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const isOnline = state.isConnected && state.isInternetReachable;
      
      // Check if we're coming back online
      if (isOnline && !this.lastOnlineStatus) {
        console.log('Connection restored - starting sync');
        this.handleConnectionRestored();
      }
      
      this.lastOnlineStatus = isOnline;
    });
  }

  async handleConnectionRestored() {
    try {
      // Check if we have pending actions
      const pendingActions = await offlineStorage.getPendingActions();
      
      // If we have pending actions or haven't synced in a while, sync immediately
      if (pendingActions.length > 0 || await this.shouldSync()) {
        await this.syncData();
      }
    } catch (error) {
      console.error('Error handling connection restore:', error);
    }
  }

  async syncData() {
    if (this.isSyncing) return;
    
    try {
      this.isSyncing = true;
      console.log('Starting data sync...');

      // Get pending actions
      const pendingActions = await offlineStorage.getPendingActions();
      
      // Process each pending action
      for (const action of pendingActions) {
        await this.processPendingAction(action);
      }

      // Sync latest data from server
      await Promise.all([
        this.syncDisasters(),
        this.syncEmergencyContacts(),
        this.syncFacilities()
      ]);
      
      // Update last sync timestamp
      await offlineStorage.updateLastSync();
      console.log('Data sync completed');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  async processPendingAction(action) {
    try {
      console.log(`Processing pending action: ${action.type}`);
      
      switch (action.type) {
        case 'CREATE_DISASTER_REPORT':
          await warningApi.createWarning(action.data);
          break;
        case 'UPDATE_DISASTER_STATUS':
          await warningApi.updateWarning(action.data.id, action.data);
          break;
        case 'ADD_EMERGENCY_CONTACT':
          await resourceApi.addEmergencyContact(action.data);
          break;
        case 'UPDATE_EMERGENCY_CONTACT':
          await resourceApi.updateEmergencyContact(action.data.id, action.data);
          break;
        default:
          console.warn(`Unknown action type: ${action.type}`);
          return;
      }
      
      // Remove processed action
      await offlineStorage.clearPendingAction(action.id);
      console.log(`Successfully processed action: ${action.type}`);
    } catch (error) {
      console.error(`Error processing action ${action.type}:`, error);
      // If the error is due to conflict, we might want to handle it specially
      if (error.status === 409) {
        await this.handleConflict(action);
      }
      // Keep the action in queue if it fails
    }
  }

  async handleConflict(action) {
    // Get the latest version from server
    let serverData;
    try {
      switch (action.type) {
        case 'UPDATE_DISASTER_STATUS':
          serverData = await warningApi.getWarning(action.data.id);
          break;
        case 'UPDATE_EMERGENCY_CONTACT':
          serverData = await resourceApi.getEmergencyContact(action.data.id);
          break;
        default:
          return;
      }

      // Store the latest version locally
      switch (action.type) {
        case 'UPDATE_DISASTER_STATUS':
          await offlineStorage.storeDisasters([serverData]);
          break;
        case 'UPDATE_EMERGENCY_CONTACT':
          await offlineStorage.storeEmergencyContacts([serverData]);
          break;
      }
    } catch (error) {
      console.error('Error handling conflict:', error);
    }
  }

  async syncDisasters() {
    try {
      const disasters = await warningApi.getWarnings();
      await offlineStorage.storeDisasters(disasters);
    } catch (error) {
      console.error('Error syncing disasters:', error);
    }
  }

  async syncEmergencyContacts() {
    try {
      const contacts = await resourceApi.getEmergencyContacts();
      await offlineStorage.storeEmergencyContacts(contacts);
    } catch (error) {
      console.error('Error syncing emergency contacts:', error);
    }
  }

  async syncFacilities() {
    try {
      const facilities = await resourceApi.getFacilities();
      await offlineStorage.storeFacilities(facilities);
    } catch (error) {
      console.error('Error syncing facilities:', error);
    }
  }

  // Force immediate sync
  async forceSyncData() {
    await this.syncData();
  }

  // Enhanced shouldSync to consider different factors
  async shouldSync() {
    const lastSync = await offlineStorage.getLastSync();
    if (!lastSync) return true;

    const now = new Date();
    const lastSyncDate = new Date(lastSync);
    const minutesSinceLastSync = (now - lastSyncDate) / (1000 * 60);

    // Sync if more than 15 minutes have passed
    return minutesSinceLastSync > 15;
  }
}

export default new SyncService(); 