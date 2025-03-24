import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children - Child components to render
 * @property {Function} [onError] - Optional callback when an error occurs
 * @property {Function} [onRetry] - Optional callback for custom retry logic
 * @property {string} [fallbackTitle] - Custom title for error message
 * @property {string} [fallbackMessage] - Custom error message
 */

/**
 * Error Boundary component that catches JavaScript errors in child components
 * @component
 * @param {ErrorBoundaryProps} props
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Call onRetry callback if provided
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorView 
        error={this.state.error}
        onRetry={this.handleRetry}
        title={this.props.fallbackTitle}
        message={this.props.fallbackMessage}
      />;
    }

    return this.props.children;
  }
}

/**
 * Error view component that displays the error message and retry button
 */
const ErrorView = ({ error, onRetry, title, message }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.error }]}>
        {title || 'Something went wrong'}
      </Text>
      <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {message || error?.message || 'An unexpected error occurred'}
      </Text>
      <Button 
        mode="contained" 
        onPress={onRetry}
        style={{ backgroundColor: theme.colors.primary }}
      >
        Try Again
      </Button>
    </View>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  onRetry: PropTypes.func,
  fallbackTitle: PropTypes.string,
  fallbackMessage: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ErrorBoundary; 