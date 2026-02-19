import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { CampaignFilters as FilterType, CampaignStatus } from '../types';
import { cn } from '../../../lib/utils';

interface CampaignFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  className?: string;
}

const statusOptions: { value: CampaignStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' },
];

export const CampaignFilters = React.memo<CampaignFiltersProps>(
  ({ filters, onFiltersChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterType>(filters);

    const hasActiveFilters = React.useMemo(() => {
      return (
        (filters.status && filters.status.length > 0) ||
        filters.dateRange !== undefined ||
        filters.minBudget !== undefined ||
        filters.maxBudget !== undefined ||
        filters.minCTR !== undefined
      );
    }, [filters]);

    const handleApply = () => {
      onFiltersChange(localFilters);
      setIsOpen(false);
    };

    const handleClear = () => {
      const clearedFilters = {};
      setLocalFilters(clearedFilters);
      onFiltersChange(clearedFilters);
      setIsOpen(false);
    };

    const handleStatusToggle = (status: CampaignStatus) => {
      setLocalFilters((prev) => {
        const currentStatus = prev.status || [];
        const newStatus = currentStatus.includes(status)
          ? currentStatus.filter((s) => s !== status)
          : [...currentStatus, status];

        return {
          ...prev,
          status: newStatus.length > 0 ? newStatus : undefined,
        };
      });
    };

    return (
      <div className={cn('relative', className)}>
        <Button
          variant={hasActiveFilters ? 'primary' : 'secondary'}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {(filters.status?.length || 0) +
                (filters.dateRange ? 1 : 0) +
                (filters.minBudget ? 1 : 0) +
                (filters.maxBudget ? 1 : 0) +
                (filters.minCTR ? 1 : 0)}
            </span>
          )}
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={
                            localFilters.status?.includes(option.value) || false
                          }
                          onChange={() => handleStatusToggle(option.value)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={localFilters.dateRange?.start || ''}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            start: e.target.value,
                            end: prev.dateRange?.end || '',
                          },
                        }))
                      }
                      placeholder="Start date"
                    />
                    <Input
                      type="date"
                      value={localFilters.dateRange?.end || ''}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            start: prev.dateRange?.start || '',
                            end: e.target.value,
                          },
                        }))
                      }
                      placeholder="End date"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={localFilters.minBudget || ''}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minBudget: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      placeholder="Min budget"
                    />
                    <Input
                      type="number"
                      value={localFilters.maxBudget || ''}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          maxBudget: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      placeholder="Max budget"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    type="number"
                    label="Minimum CTR (%)"
                    value={localFilters.minCTR || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minCTR: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="e.g., 2.5"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

CampaignFilters.displayName = 'CampaignFilters';
