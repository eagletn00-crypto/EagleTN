import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  children: React.ReactNode;
}

export const PartnerRouteWrapper: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};
