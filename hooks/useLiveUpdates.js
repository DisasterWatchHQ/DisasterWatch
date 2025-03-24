import { useState, useEffect, useCallback } from 'react';
import { warningApi } from '../api/services/warnings';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState(0);
  const [warningStats, setWarningStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [updatesData, warningsData] = await Promise.all([
        warningApi.fetchLiveUpdates(),
        warningApi.getActiveWarnings(),
      ]);

      if (!updatesData?.success) {
        throw new Error(updatesData?.error || 'Failed to fetch updates');
      }

      setUpdates(updatesData.data?.updates || []);

      if (Array.isArray(warningsData)) {
        // Group warnings by disaster category
        const stats = warningsData.reduce((acc, warning) => {
          const category = warning.disaster_category;
          if (!acc[category]) {
            acc[category] = {
              _id: category,
              active_warnings: 0
            };
          }
          acc[category].active_warnings += 1;
          return acc;
        }, {});

        setActiveWarnings(warningsData.length);
        setWarningStats(Object.values(stats));
      } else {
        throw new Error('Invalid warnings data received');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading updates:', err);
      // Keep the old data in case of error
      // This prevents showing empty state on temporary errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpdates();
    // Refresh every 30 seconds
    const interval = setInterval(loadUpdates, 30000);
    return () => clearInterval(interval);
  }, [loadUpdates]);

  return {
    updates,
    activeWarnings,
    warningStats,
    loading,
    error,
    refresh: loadUpdates,
  };
};