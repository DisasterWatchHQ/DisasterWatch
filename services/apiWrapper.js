import NetInfo from '@react-native-community/netinfo';
import offlineStorage from './offlineStorage';
import { v4 as uuidv4 } from 'react-native-get-random-values';

export const createOfflineAwareAPI = (api) => {
  const wrapper = {};

  // Wrap all API methods
  for (const methodName of Object.keys(api)) {
    wrapper[methodName] = async (...args) => {
      const networkState = await NetInfo.fetch();
      const isOnline = networkState.isConnected && networkState.isInternetReachable;

      if (isOnline) {
        try {
          // Try online request
          const result = await api[methodName](...args);
          return result;
        } catch (error) {
          // If request fails, fall back to offline handling
          return handleOfflineOperation(methodName, args);
        }
      } else {
        // Handle offline operation
        return handleOfflineOperation(methodName, args);
      }
    };
  }

  const handleOfflineOperation = async (methodName, args) => {
    // Read operations
    if (methodName.startsWith('get')) {
      return handleOfflineRead(methodName);
    }
    // Write operations
    else {
      return handleOfflineWrite(methodName, args);
    }
  };

  const handleOfflineRead = async (methodName) => {
    switch (methodName) {
      case 'getWarnings':
        return offlineStorage.getDisasters();
      case 'getEmergencyContacts':
        return offlineStorage.getEmergencyContacts();
      case 'getFacilities':
        return offlineStorage.getFacilities();
      default:
        throw new Error('Offline operation not supported');
    }
  };

  const handleOfflineWrite = async (methodName, args) => {
    const action = {
      id: uuidv4(),
      type: getActionType(methodName),
      data: args[0],
      timestamp: new Date().toISOString(),
    };

    await offlineStorage.queueAction(action);

    // Return optimistic response
    return {
      ...action.data,
      id: action.id,
      status: 'pending',
      _isOffline: true,
    };
  };

  const getActionType = (methodName) => {
    switch (methodName) {
      case 'createWarning':
        return 'CREATE_DISASTER_REPORT';
      case 'updateWarning':
        return 'UPDATE_DISASTER_STATUS';
      case 'addEmergencyContact':
        return 'ADD_EMERGENCY_CONTACT';
      case 'updateEmergencyContact':
        return 'UPDATE_EMERGENCY_CONTACT';
      default:
        return methodName.toUpperCase();
    }
  };

  return wrapper;
};

// Usage example:
// export const offlineAwareWarningApi = createOfflineAwareAPI(warningApi);
// export const offlineAwareResourceApi = createOfflineAwareAPI(resourceApi); 