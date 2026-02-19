import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../../components/EmptyState';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Detailed analytics and insights
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Analytics Dashboard"
        description="Advanced analytics features will be available here. View detailed metrics, trends, and insights across all your campaigns."
      />
    </div>
  );
};
