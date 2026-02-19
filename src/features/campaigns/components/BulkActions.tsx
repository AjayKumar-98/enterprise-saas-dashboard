import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../../../components/Button';
import { CampaignStatus } from '../types';

interface BulkActionsProps {
  selectedCount: number;
  onUpdateStatus: (status: CampaignStatus) => Promise<void>;
  onClearSelection: () => void;
}

export const BulkActions = React.memo<BulkActionsProps>(
  ({ selectedCount, onUpdateStatus, onClearSelection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async (status: CampaignStatus) => {
      setIsUpdating(true);
      try {
        await onUpdateStatus(status);
        setIsOpen(false);
      } finally {
        setIsUpdating(false);
      }
    };

    if (selectedCount === 0) return null;

    return (
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} selected
        </span>

        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            isLoading={isUpdating}
            disabled={isUpdating}
          >
            Update Status
            <ChevronDown className="h-4 w-4" />
          </Button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                <button
                  onClick={() => handleUpdateStatus('active')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Set as Active
                </button>
                <button
                  onClick={() => handleUpdateStatus('paused')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Set as Paused
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Set as Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus('draft')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Set as Draft
                </button>
              </div>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isUpdating}
        >
          Clear Selection
        </Button>
      </div>
    );
  }
);

BulkActions.displayName = 'BulkActions';
