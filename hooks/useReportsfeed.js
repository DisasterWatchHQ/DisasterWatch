import { useState, useEffect, useCallback } from 'react';
import { fetchReports } from '../api/services/api';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    disaster_category: '',
    verified_only: false,
    district: '', 
  });

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchReports(filters);

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load reports');
      }

      if (!response.data?.reports) {
        throw new Error('Invalid response format');
      }

      // Filter reports on the frontend if verified_only is true
      const filteredReports = filters.verified_only 
        ? response.data.reports.filter(report => report.verification_status === 'verified')
        : response.data.reports;

      setReports(filteredReports);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalReports: response.data.pagination.totalReports
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading reports:', err);
      // Keep the old data in case of error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshReports = useCallback(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    refreshReports,
    changePage,
  };
};