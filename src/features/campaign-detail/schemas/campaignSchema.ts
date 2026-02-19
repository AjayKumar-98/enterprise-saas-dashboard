import { z } from 'zod';

export const campaignSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  status: z.enum(['active', 'paused', 'completed', 'draft']),
  budget: z.number().min(100, 'Budget must be at least $100'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  targetAudience: z.string().min(5, 'Target audience must be at least 5 characters'),
  objectives: z.string().min(10, 'Objectives must be at least 10 characters'),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type CampaignFormSchema = z.infer<typeof campaignSchema>;
