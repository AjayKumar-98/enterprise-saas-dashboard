import React, { useEffect, useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import { useCampaignStore } from '../store';
import { CampaignTable } from '../components/CampaignTable';
import { CampaignFilters } from '../components/CampaignFilters';
import { BulkActions } from '../components/BulkActions';
import { Input } from '../../../components/Input';
import { Pagination } from '../../../components/Pagination';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { EmptyState } from '../../../components/EmptyState';
import { useDebounce } from '../../../hooks/useDebounce';
import { useToast } from '../../../hooks/useToast';
import { FolderOpen } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const toast = useToast();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const {
    campaigns,
    total,
    page,
    pageSize,
    totalPages,
    sortField,
    sortOrder,
    filters,
    isLoading,
    error,
    selectedRows,
    fetchCampaigns,
    setPage,
    setSort,
    setFilters,
    bulkUpdateStatus,
    toggleRowSelection,
    toggleAllRows,
    clearSelection,
  } = useCampaignStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || undefined });
  }, [debouncedSearch, setFilters]);

  const handleBulkUpdate = useCallback(
    async (status: string) => {
      try {
        await bulkUpdateStatus(Array.from(selectedRows), status as any);
        toast.success(`Successfully updated ${selectedRows.size} campaigns`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to update campaigns'
        );
      }
    },
    [bulkUpdateStatus, selectedRows, toast]
  );

  const handleRetry = useCallback(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and monitor all your marketing campaigns
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <CampaignFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <BulkActions
        selectedCount={selectedRows.size}
        onUpdateStatus={handleBulkUpdate}
        onClearSelection={clearSelection}
      />

      {isLoading && campaigns.length === 0 ? (
        <LoadingState message="Loading campaigns..." />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No campaigns found"
          description="Try adjusting your filters or search query to find what you're looking for."
        />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <CampaignTable
              campaigns={campaigns}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={setSort}
              selectedRows={selectedRows}
              onRowSelect={toggleRowSelection}
              onSelectAll={toggleAllRows}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, total)} of {total} campaigns
            </p>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
