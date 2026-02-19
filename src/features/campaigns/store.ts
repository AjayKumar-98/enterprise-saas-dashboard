import { create } from 'zustand';
import { Campaign, CampaignFilters, CampaignStatus } from './types';
import { campaignService } from './services/campaignService';

interface CampaignState {
  campaigns: Campaign[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortField: keyof Campaign;
  sortOrder: 'asc' | 'desc';
  filters: CampaignFilters;
  isLoading: boolean;
  error: string | null;
  selectedRows: Set<string>;

  fetchCampaigns: () => Promise<void>;
  setPage: (page: number) => void;
  setSort: (field: keyof Campaign) => void;
  setFilters: (filters: CampaignFilters) => void;
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: CampaignStatus) => Promise<void>;
  toggleRowSelection: (id: string) => void;
  toggleAllRows: () => void;
  clearSelection: () => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  sortField: 'createdAt',
  sortOrder: 'desc',
  filters: {},
  isLoading: false,
  error: null,
  selectedRows: new Set(),

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, pageSize, sortField, sortOrder, filters } = get();
      const response = await campaignService.getCampaigns(
        page,
        pageSize,
        sortField,
        sortOrder,
        filters
      );

      set({
        campaigns: response.data,
        total: response.total,
        totalPages: response.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch campaigns',
        isLoading: false,
      });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchCampaigns();
  },

  setSort: (field) => {
    const { sortField, sortOrder } = get();
    const newOrder =
      sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';

    set({ sortField: field, sortOrder: newOrder, page: 1 });
    get().fetchCampaigns();
  },

  setFilters: (filters) => {
    set({ filters, page: 1 });
    get().fetchCampaigns();
  },

  updateCampaignStatus: async (id, status) => {
    const { campaigns } = get();
    const optimisticCampaigns = campaigns.map((c) =>
      c.id === id ? { ...c, status } : c
    );
    set({ campaigns: optimisticCampaigns });

    try {
      await campaignService.updateCampaignStatus(id, status);
      get().fetchCampaigns();
    } catch (error) {
      set({ campaigns });
      throw error;
    }
  },

  bulkUpdateStatus: async (ids, status) => {
    const { campaigns } = get();
    const optimisticCampaigns = campaigns.map((c) =>
      ids.includes(c.id) ? { ...c, status } : c
    );
    set({ campaigns: optimisticCampaigns });

    try {
      await campaignService.bulkUpdateStatus(ids, status);
      set({ selectedRows: new Set() });
      get().fetchCampaigns();
    } catch (error) {
      set({ campaigns });
      throw error;
    }
  },

  toggleRowSelection: (id) => {
    set((state) => {
      const newSelection = new Set(state.selectedRows);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedRows: newSelection };
    });
  },

  toggleAllRows: () => {
    set((state) => {
      const allSelected = state.selectedRows.size === state.campaigns.length;
      if (allSelected) {
        return { selectedRows: new Set() };
      } else {
        return {
          selectedRows: new Set(state.campaigns.map((c) => c.id)),
        };
      }
    });
  },

  clearSelection: () => {
    set({ selectedRows: new Set() });
  },
}));
