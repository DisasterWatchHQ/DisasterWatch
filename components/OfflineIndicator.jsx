import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { useNetwork } from '../context/NetworkContext';
import offlineStorage from '../api/utils/offlineStorage';
import syncService from '../api/utils/syncService';

/**
 * @typedef {Object} OfflineIndicatorProps
 * @property {number} [checkInterval=30000] - Interval in ms to check for pending actions
 * @property {number} [animationDuration=300] - Duration of show/hide animation in ms
 */

/**
 * Component that shows network status and pending offline actions
 * @param {OfflineIndicatorProps} props
 */
export default function OfflineIndicator({ 
  checkInterval = 30000,
  animationDuration = 300 
}) {
  const theme = useTheme();
  const { isConnected, isInternetReachable } = useNetwork();
  const [pendingActions, setPendingActions] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const translateY = useMemo(() => new Animated.Value(0), []);

  const checkPendingActions = useCallback(async () => {
    try {
      const actions = await offlineStorage.getPendingActions();
      setPendingActions(actions.length);
    } catch (error) {
      console.error('Error checking pending actions:', error);
    }
  }, []);

  const handleSync = useCallback(async () => {
    if (!isConnected || !isInternetReachable) return;

    try {
      setIsSyncing(true);
      setSyncError(null);
      await syncService.forceSyncData();
      await checkPendingActions();
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, isInternetReachable, checkPendingActions]);

  useEffect(() => {
    checkPendingActions();
    const interval = setInterval(checkPendingActions, checkInterval);
    return () => clearInterval(interval);
  }, [checkInterval, checkPendingActions]);

  useEffect(() => {
    setIsVisible(!isConnected || !isInternetReachable || pendingActions > 0);
  }, [isConnected, isInternetReachable, pendingActions]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : -100,
      useNativeDriver: true,
      duration: animationDuration,
    }).start();
  }, [isVisible, translateY, animationDuration]);

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
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.content}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isConnected && isInternetReachable
                    ? theme.colors.success
                    : theme.colors.error,
                },
              ]}
            />
            <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
              {isConnected && isInternetReachable ? 'Online' : 'Offline'}
            </Text>
          </View>
          
          {pendingActions > 0 && (
            <View style={styles.pendingContainer}>
              <Text style={[styles.pendingText, { color: theme.colors.onSurfaceVariant }]}>
                {pendingActions} pending {pendingActions === 1 ? 'action' : 'actions'}
              </Text>
              {isConnected && isInternetReachable && (
                <IconButton
                  icon={isSyncing ? 'sync-circle' : 'sync'}
                  size={20}
                  onPress={handleSync}
                  style={styles.syncButton}
                  disabled={isSyncing}
                />
              )}
            </View>
          )}
        </View>
        
        {syncError && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {syncError}
          </Text>
        )}
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
    marginRight: 4,
  },
  syncButton: {
    margin: -8,
  },
  errorText: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});