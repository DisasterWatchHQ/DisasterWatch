import { useState, useEffect } from 'react';
import { fetchFeedStats, fetchLiveUpdates } from '../services/api';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const [updatesResponse, statsResponse] = await Promise.all([
        fetchLiveUpdates(),
        fetchFeedStats(),
      ]);

      if (updatesResponse.success) {
        setUpdates(updatesResponse.data.updates);
      }

      if (statsResponse.success) {
        setActiveWarnings(statsResponse.data.warningStats.filter(w => w.active_warnings > 0));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
    const interval = setInterval(loadUpdates, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    updates,
    activeWarnings,
    loading,
    error,
  };
};