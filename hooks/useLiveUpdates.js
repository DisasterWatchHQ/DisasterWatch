import { useState, useEffect } from 'react';
import { fetchFeedStats, fetchLiveUpdates } from '../services/api';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState(0);
  const [warningStats, setWarningStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const [updatesData, statsData] = await Promise.all([
        fetchLiveUpdates(),
        fetchFeedStats(),
      ]);

      if (updatesData.success && updatesData.data?.updates) {
        setUpdates(updatesData.data.updates);
      }

      if (statsData.success && statsData.data) {
        setActiveWarnings(statsData.data.activeWarnings);
        setWarningStats(statsData.data.warningStats);
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