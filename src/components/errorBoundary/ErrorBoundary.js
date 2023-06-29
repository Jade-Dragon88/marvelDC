//@ts-check

import React, { useState, useEffect } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.log(error, errorInfo);
      setError(true);
    };

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return <ErrorMessage />;
  }

  return children;
};

export default ErrorBoundary;
