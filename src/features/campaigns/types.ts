export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilters {
  status?: CampaignStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  minBudget?: number;
  maxBudget?: number;
  minCTR?: number;
  search?: string;
}

export interface CampaignFormData {
  name: string;
  status: CampaignStatus;
  budget: number;
  description: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  objectives: string;
}

export interface CampaignAsset {
  id: string;
  campaignId: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  uploadedAt: string;
}

export interface CampaignPerformance {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
}
