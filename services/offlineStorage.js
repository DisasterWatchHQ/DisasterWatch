import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DISASTERS: '@disasters',
  PENDING_ACTIONS: '@pending_actions',
  LAST_SYNC: '@last_sync',
  USER_DATA: '@user_data',
  EMERGENCY_CONTACTS: '@emergency_contacts',
  FACILITIES: '@facilities',
  GUIDES: '@guides',
};

class OfflineStorage {
  // Store disaster data
  async storeDisasters(disasters) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DISASTERS, JSON.stringify(disasters));
      await this.updateLastSync();
    } catch (error) {
      console.error('Error storing disasters:', error);
    }
  }

  // Get stored disaster data
  async getDisasters() {
    try {
      const disasters = await AsyncStorage.getItem(STORAGE_KEYS.DISASTERS);
      return disasters ? JSON.parse(disasters) : [];
    } catch (error) {
      console.error('Error getting disasters:', error);
      return [];
    }
  }

  // Queue an action for later sync
  async queueAction(action) {
    try {
      const pendingActions = await this.getPendingActions();
      pendingActions.push({
        ...action,
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_ACTIONS,
        JSON.stringify(pendingActions)
      );
    } catch (error) {
      console.error('Error queuing action:', error);
    }
  }

  // Get pending actions
  async getPendingActions() {
    try {
      const actions = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
      return actions ? JSON.parse(actions) : [];
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  }

  // Clear completed actions
  async clearPendingAction(actionId) {
    try {
      const pendingActions = await this.getPendingActions();
      const updatedActions = pendingActions.filter(action => action.id !== actionId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_ACTIONS,
        JSON.stringify(updatedActions)
      );
    } catch (error) {
      console.error('Error clearing pending action:', error);
    }
  }

  // Store emergency contacts
  async storeEmergencyContacts(contacts) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EMERGENCY_CONTACTS,
        JSON.stringify(contacts)
      );
    } catch (error) {
      console.error('Error storing emergency contacts:', error);
    }
  }

  // Get emergency contacts
  async getEmergencyContacts() {
    try {
      const contacts = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }

  // Store facilities data
  async storeFacilities(facilities) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
    } catch (error) {
      console.error('Error storing facilities:', error);
    }
  }

  // Get facilities data
  async getFacilities() {
    try {
      const facilities = await AsyncStorage.getItem(STORAGE_KEYS.FACILITIES);
      return facilities ? JSON.parse(facilities) : [];
    } catch (error) {
      console.error('Error getting facilities:', error);
      return [];
    }
  }

  // Store user data
  async storeUserData(userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Get user data
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Update last sync timestamp
  async updateLastSync() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
    } catch (error) {
      console.error('Error updating last sync:', error);
    }
  }

  // Get last sync timestamp
  async getLastSync() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  }

  // Clear all stored data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new OfflineStorage(); 