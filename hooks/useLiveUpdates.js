import { useState, useEffect } from 'react';
import { fetchLiveUpdates } from '../services/api';
import { warningApi } from '../services/warningApi';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState(0);
  const [warningStats, setWarningStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const [updatesData, warningsData] = await Promise.all([
        fetchLiveUpdates(),
        warningApi.getActiveWarnings(),
      ]);

      if (updatesData.success && updatesData.data?.updates) {
        setUpdates(updatesData.data.updates);
      }

      if (warningsData) {
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
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading updates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
    const interval = setInterval(loadUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    updates,
    activeWarnings,
    warningStats,
    loading,
    error,
    refresh: loadUpdates,
  };
};