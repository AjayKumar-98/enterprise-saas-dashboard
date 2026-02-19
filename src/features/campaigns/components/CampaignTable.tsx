import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { Campaign, CampaignStatus } from '../types';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../../../lib/utils';

interface CampaignTableProps {
  campaigns: Campaign[];
  sortField: keyof Campaign;
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof Campaign) => void;
  selectedRows: Set<string>;
  onRowSelect: (id: string) => void;
  onSelectAll: () => void;
}

const statusVariants: Record<CampaignStatus, 'success' | 'warning' | 'error' | 'info'> = {
  active: 'success',
  paused: 'warning',
  completed: 'info',
  draft: 'error',
};

export const CampaignTable = React.memo<CampaignTableProps>(
  ({
    campaigns,
    sortField,
    sortOrder,
    onSort,
    selectedRows,
    onRowSelect,
    onSelectAll,
  }) => {
    const navigate = useNavigate();

    const handleRowClick = useCallback(
      (campaign: Campaign) => {
        navigate(`/campaigns/${campaign.id}`);
      },
      [navigate]
    );

    const columns: Column<Campaign>[] = React.useMemo(
      () => [
        {
          key: 'name',
          header: 'Campaign Name',
          sortable: true,
          render: (campaign) => (
            <div className="font-medium text-gray-900">{campaign.name}</div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          sortable: true,
          render: (campaign) => (
            <Badge variant={statusVariants[campaign.status]}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          ),
        },
        {
          key: 'budget',
          header: 'Budget',
          sortable: true,
          render: (campaign) => formatCurrency(campaign.budget),
        },
        {
          key: 'spent',
          header: 'Spent',
          sortable: true,
          render: (campaign) => (
            <div>
              <div className="font-medium">{formatCurrency(campaign.spent)}</div>
              <div className="text-xs text-gray-500">
                {formatPercent((campaign.spent / campaign.budget) * 100)}
              </div>
            </div>
          ),
        },
        {
          key: 'impressions',
          header: 'Impressions',
          sortable: true,
          render: (campaign) => formatNumber(campaign.impressions),
        },
        {
          key: 'clicks',
          header: 'Clicks',
          sortable: true,
          render: (campaign) => formatNumber(campaign.clicks),
        },
        {
          key: 'ctr',
          header: 'CTR',
          sortable: true,
          render: (campaign) => formatPercent(campaign.ctr),
        },
        {
          key: 'conversions',
          header: 'Conversions',
          sortable: true,
          render: (campaign) => formatNumber(campaign.conversions),
        },
        {
          key: 'startDate',
          header: 'Start Date',
          sortable: true,
          render: (campaign) => formatDate(campaign.startDate),
        },
      ],
      []
    );

    return (
      <Table
        columns={columns}
        data={campaigns}
        keyExtractor={(campaign) => campaign.id}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        onRowClick={handleRowClick}
        selectedRows={selectedRows}
        onRowSelect={onRowSelect}
        onSelectAll={onSelectAll}
      />
    );
  }
);

CampaignTable.displayName = 'CampaignTable';
