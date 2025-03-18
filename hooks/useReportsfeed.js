import { useState, useEffect } from 'react';
import { fetchReports } from '../services/api';

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

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetchReports(filters);

      if (response.success && response.data) {
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
      } else {
        setError(response.error || 'Failed to load reports');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = () => {
    loadReports();
  };

  const changePage = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

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