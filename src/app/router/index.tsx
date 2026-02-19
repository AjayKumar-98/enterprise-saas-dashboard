import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { LoadingState } from '../../components/LoadingState';
import { ErrorBoundary } from '../ErrorBoundary';

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  }))
);

const CampaignsPage = lazy(() =>
  import('../../features/campaigns/pages/CampaignsPage').then((module) => ({
    default: module.CampaignsPage,
  }))
);

const CampaignDetailPage = lazy(() =>
  import('../../features/campaign-detail/pages/CampaignDetailPage').then(
    (module) => ({
      default: module.CampaignDetailPage,
    })
  )
);

const AnalyticsPage = lazy(() =>
  import('../pages/AnalyticsPage').then((module) => ({
    default: module.AnalyticsPage,
  }))
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingState />}>
                <AppLayout />
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<LoadingState />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="campaigns"
              element={
                <Suspense fallback={<LoadingState />}>
                  <CampaignsPage />
                </Suspense>
              }
            />
            <Route
              path="campaigns/:id"
              element={
                <Suspense fallback={<LoadingState />}>
                  <CampaignDetailPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<LoadingState />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
