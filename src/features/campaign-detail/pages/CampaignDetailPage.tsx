import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, FileText, Image } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Tabs, Tab } from '../../../components/Tabs';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { Badge } from '../../../components/Badge';
import { OverviewTab } from '../components/OverviewTab';
import { AssetsTab } from '../components/AssetsTab';
import { PerformanceTab } from '../components/PerformanceTab';
import { campaignService } from '../../campaigns/services/campaignService';
import { Campaign, CampaignStatus } from '../../campaigns/types';
import { formatCurrency, formatNumber } from '../../../lib/utils';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
  { id: 'assets', label: 'Assets', icon: <Image className="h-4 w-4" /> },
  { id: 'performance', label: 'Performance', icon: <BarChart3 className="h-4 w-4" /> },
];

const statusVariants: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info'> = {
  active: 'success',
  paused: 'warning',
  completed: 'info',
  draft: 'error',
};

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCampaign = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await campaignService.getCampaignById(id);
      setCampaign(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaign');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const handleUpdate = () => {
    fetchCampaign();
  };

  if (isLoading) {
    return <LoadingState message="Loading campaign..." />;
  }

  if (error || !campaign) {
    return (
      <ErrorState
        message={error || 'Campaign not found'}
        onRetry={fetchCampaign}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/campaigns')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {campaign.name}
              </h1>
              <Badge variant={statusVariants[campaign.status]}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Campaign ID: {campaign.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Budget</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(campaign.budget)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Spent</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(campaign.spent)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Impressions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatNumber(campaign.impressions)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Conversions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatNumber(campaign.conversions)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab campaign={campaign} onUpdate={handleUpdate} />
          )}
          {activeTab === 'assets' && <AssetsTab campaignId={campaign.id} />}
          {activeTab === 'performance' && (
            <PerformanceTab campaignId={campaign.id} />
          )}
        </div>
      </div>
    </div>
  );
};
