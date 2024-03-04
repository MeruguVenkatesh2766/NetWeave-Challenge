import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI if there's an error
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>Please try again later.</p>
        </div>
      );
    }
    // Render the children normally if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
