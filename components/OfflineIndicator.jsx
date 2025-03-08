import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { useNetwork } from '../context/NetworkContext';
import offlineStorage from '../services/offlineStorage';
import syncService from '../services/syncService';

export default function OfflineIndicator() {
  const { isConnected, isInternetReachable } = useNetwork();
  const [pendingActions, setPendingActions] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const translateY = new Animated.Value(0);

  useEffect(() => {
    checkPendingActions();
    const interval = setInterval(checkPendingActions, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(!isConnected || !isInternetReachable || pendingActions > 0);
  }, [isConnected, isInternetReachable, pendingActions]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : -100,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const checkPendingActions = async () => {
    const actions = await offlineStorage.getPendingActions();
    setPendingActions(actions.length);
  };

  const handleSync = async () => {
    if (isConnected && isInternetReachable) {
      await syncService.forceSyncData();
      await checkPendingActions();
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <Surface style={styles.surface}>
        <View style={styles.content}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isConnected && isInternetReachable
                    ? '#4CAF50'
                    : '#F44336',
                },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected && isInternetReachable
                ? 'Online'
                : 'Offline'}
            </Text>
          </View>
          
          {pendingActions > 0 && (
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingText}>
                {pendingActions} pending {pendingActions === 1 ? 'action' : 'actions'}
              </Text>
              {isConnected && isInternetReachable && (
                <IconButton
                  icon="sync"
                  size={20}
                  onPress={handleSync}
                  style={styles.syncButton}
                />
              )}
            </View>
          )}
        </View>
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  surface: {
    margin: 8,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  syncButton: {
    margin: -8,
  },
}); 