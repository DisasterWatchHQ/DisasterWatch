import { useState, useEffect } from 'react';
import { fetchReports } from '../services/api';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    disaster_category: '',
    verified_only: false,
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetchReports(filters);
      if (response.success) {
        setReports(response.data.reports);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = () => {
    loadReports();
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  return {
    reports,
    loading,
    error,
    filters,
    updateFilters,
    refreshReports,
  };
};