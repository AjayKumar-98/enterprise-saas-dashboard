import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { campaignService } from '../../campaigns/services/campaignService';
import { CampaignPerformance } from '../../campaigns/types';
import { formatCurrency, formatNumber } from '../../../lib/utils';

interface PerformanceTabProps {
  campaignId: string;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  campaignId,
}) => {
  const [performance, setPerformance] = useState<CampaignPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await campaignService.getCampaignPerformance(campaignId, 30);
      setPerformance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [campaignId]);

  if (isLoading) {
    return <LoadingState message="Loading performance data..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchPerformance} />;
  }

  if (performance.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }

  const chartData = performance.map((p) => ({
    date: new Date(p.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    impressions: p.impressions,
    clicks: p.clicks,
    conversions: p.conversions,
    spend: p.spend,
    ctr: p.ctr,
    cpc: p.cpc,
  }));

  const totals = performance.reduce(
    (acc, p) => ({
      impressions: acc.impressions + p.impressions,
      clicks: acc.clicks + p.clicks,
      conversions: acc.conversions + p.conversions,
      spend: acc.spend + p.spend,
    }),
    { impressions: 0, clicks: 0, conversions: 0, spend: 0 }
  );

  const avgCTR = (totals.clicks / totals.impressions) * 100;
  const avgCPC = totals.spend / totals.clicks;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Impressions</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {formatNumber(totals.impressions)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Total Clicks</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {formatNumber(totals.clicks)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Total Conversions</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {formatNumber(totals.conversions)}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-medium">Total Spend</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {formatCurrency(totals.spend)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Impressions, Clicks & Conversions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="impressions"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Spend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="spend" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Click-Through Rate (CTR)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${(value as number).toFixed(2)}%`} />
              <Line
                type="monotone"
                dataKey="ctr"
                stroke="#059669"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-600 mt-4">
            Average CTR: <strong>{avgCTR.toFixed(2)}%</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Per Click (CPC)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line
                type="monotone"
                dataKey="cpc"
                stroke="#dc2626"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-600 mt-4">
            Average CPC: <strong>{formatCurrency(avgCPC)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
