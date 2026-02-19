import { Campaign, CampaignStatus } from './types';

const statuses: CampaignStatus[] = ['active', 'paused', 'completed', 'draft'];

const campaignNames = [
  'Summer Sale Campaign',
  'Holiday Special Promotion',
  'Brand Awareness Initiative',
  'Product Launch Event',
  'Customer Retention Program',
  'New Year Kickoff',
  'Black Friday Extravaganza',
  'Spring Collection Launch',
  'Fall Fashion Week',
  'Cyber Monday Deals',
  'Back to School Campaign',
  'Valentine Day Special',
  'Easter Promotion',
  'Memorial Day Sale',
  'Independence Day Offer',
  'Labor Day Event',
  'Halloween Spectacular',
  'Thanksgiving Feast',
  'Christmas Countdown',
  'Winter Clearance',
  'Flash Sale Weekend',
  'Member Exclusive Offer',
  'Referral Bonus Program',
  'Social Media Blitz',
  'Email Marketing Drive',
  'Mobile App Launch',
  'Influencer Partnership',
  'Content Marketing Series',
  'Video Ad Campaign',
  'Display Ad Network',
  'Search Engine Marketing',
  'Retargeting Initiative',
  'Geographic Expansion',
  'Seasonal Collection Drop',
  'Limited Edition Release',
  'VIP Customer Appreciation',
  'Trade Show Promotion',
  'Webinar Series Launch',
  'Podcast Sponsorship',
  'Community Engagement',
  'Sustainability Campaign',
  'Charity Partnership Drive',
  'Educational Content Series',
  'Product Demo Showcase',
  'Free Trial Promotion',
  'Upgrade Incentive Program',
  'Cross-Sell Campaign',
  'Upsell Initiative',
  'Win-Back Campaign',
  'Loyalty Rewards Boost',
];

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

function generateCampaign(index: number): Campaign {
  const budget = Math.floor(Math.random() * 90000) + 10000;
  const spent = Math.floor(budget * (Math.random() * 0.8 + 0.1));
  const impressions = Math.floor(Math.random() * 900000) + 100000;
  const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01));
  const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.01));
  const ctr = (clicks / impressions) * 100;
  const cpc = spent / clicks;

  const startDate = randomDate(
    new Date(2024, 0, 1),
    new Date(2024, 11, 1)
  );
  const endDate = randomDate(
    new Date(startDate),
    new Date(2025, 2, 31)
  );

  return {
    id: `campaign-${index + 1}`,
    name: campaignNames[index % campaignNames.length] + (index >= campaignNames.length ? ` ${Math.floor(index / campaignNames.length) + 1}` : ''),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    budget,
    spent,
    impressions,
    clicks,
    conversions,
    ctr: parseFloat(ctr.toFixed(2)),
    cpc: parseFloat(cpc.toFixed(2)),
    startDate,
    endDate,
    createdAt: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
    updatedAt: randomDate(new Date(2024, 0, 1), new Date()),
  };
}

export const mockCampaigns: Campaign[] = Array.from({ length: 50 }, (_, i) =>
  generateCampaign(i)
);
