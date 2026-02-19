import {
  simulateRequest,
  paginateArray,
  sortArray,
  filterArray,
  PaginatedResponse,
} from '../../../services/mockApi';
import { mockCampaigns } from '../mockData';
import {
  Campaign,
  CampaignFilters,
  CampaignFormData,
  CampaignPerformance,
  CampaignStatus,
} from '../types';

let campaignsData = [...mockCampaigns];

function applyCampaignFilters(
  campaigns: Campaign[],
  filters: CampaignFilters
): Campaign[] {
  return filterArray(campaigns, (campaign) => {
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(campaign.status)) {
        return false;
      }
    }

    if (filters.dateRange) {
      const startDate = new Date(campaign.startDate);
      const filterStart = new Date(filters.dateRange.start);
      const filterEnd = new Date(filters.dateRange.end);

      if (startDate < filterStart || startDate > filterEnd) {
        return false;
      }
    }

    if (filters.minBudget !== undefined && campaign.budget < filters.minBudget) {
      return false;
    }

    if (filters.maxBudget !== undefined && campaign.budget > filters.maxBudget) {
      return false;
    }

    if (filters.minCTR !== undefined && campaign.ctr < filters.minCTR) {
      return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!campaign.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

export const campaignService = {
  async getCampaigns(
    page: number = 1,
    pageSize: number = 10,
    sortField: keyof Campaign = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filters: CampaignFilters = {}
  ): Promise<PaginatedResponse<Campaign>> {
    return simulateRequest({
      delay: [400, 900],
      failRate: 0.05,
      data: () => {
        let filtered = applyCampaignFilters(campaignsData, filters);
        let sorted = sortArray(filtered, sortField, sortOrder);
        return paginateArray(sorted, page, pageSize);
      },
    });
  },

  async getCampaignById(id: string): Promise<Campaign> {
    return simulateRequest({
      delay: [300, 600],
      failRate: 0.03,
      data: () => {
        const campaign = campaignsData.find((c) => c.id === id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        return campaign;
      },
    });
  },

  async updateCampaign(
    id: string,
    updates: Partial<CampaignFormData>
  ): Promise<Campaign> {
    return simulateRequest({
      delay: [500, 1000],
      failRate: 0.08,
      data: () => {
        const index = campaignsData.findIndex((c) => c.id === id);
        if (index === -1) {
          throw new Error('Campaign not found');
        }

        campaignsData[index] = {
          ...campaignsData[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        return campaignsData[index];
      },
    });
  },

  async updateCampaignStatus(
    id: string,
    status: CampaignStatus
  ): Promise<Campaign> {
    return simulateRequest({
      delay: [400, 700],
      failRate: 0.06,
      data: () => {
        const index = campaignsData.findIndex((c) => c.id === id);
        if (index === -1) {
          throw new Error('Campaign not found');
        }

        campaignsData[index] = {
          ...campaignsData[index],
          status,
          updatedAt: new Date().toISOString(),
        };

        return campaignsData[index];
      },
    });
  },

  async bulkUpdateStatus(
    ids: string[],
    status: CampaignStatus
  ): Promise<Campaign[]> {
    return simulateRequest({
      delay: [800, 1500],
      failRate: 0.1,
      data: () => {
        const updated: Campaign[] = [];

        ids.forEach((id) => {
          const index = campaignsData.findIndex((c) => c.id === id);
          if (index !== -1) {
            campaignsData[index] = {
              ...campaignsData[index],
              status,
              updatedAt: new Date().toISOString(),
            };
            updated.push(campaignsData[index]);
          }
        });

        return updated;
      },
    });
  },

  async getCampaignPerformance(
    id: string,
    days: number = 30
  ): Promise<CampaignPerformance[]> {
    return simulateRequest({
      delay: [600, 1200],
      failRate: 0.05,
      data: () => {
        const campaign = campaignsData.find((c) => c.id === id);
        if (!campaign) {
          throw new Error('Campaign not found');
        }

        const performance: CampaignPerformance[] = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dailyImpressions = Math.floor(campaign.impressions / days);
          const dailyClicks = Math.floor(campaign.clicks / days);
          const dailyConversions = Math.floor(campaign.conversions / days);
          const dailySpend = campaign.spent / days;

          performance.push({
            date: d.toISOString().split('T')[0],
            impressions: dailyImpressions + Math.floor(Math.random() * 1000),
            clicks: dailyClicks + Math.floor(Math.random() * 50),
            conversions: dailyConversions + Math.floor(Math.random() * 10),
            spend: dailySpend + Math.random() * 100,
            ctr: campaign.ctr + (Math.random() - 0.5),
            cpc: campaign.cpc + (Math.random() - 0.5) * 0.5,
          });
        }

        return performance;
      },
    });
  },
};
