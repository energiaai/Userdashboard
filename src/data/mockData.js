export const campaignData = [
  {
    id: 'food',
    name: 'Food Manufacturers',
    value: 45,
    color: '#10b981', // Solid color for Recharts, gradients defined in SVG
    outreach: 2500,
    responses: 340,
    mqls: 124,
    sqls: 58,
    meetings: 24,
  },
  {
    id: 'enterpryze',
    name: 'Enterpryze',
    value: 35,
    color: '#6366f1',
    outreach: 1800,
    responses: 210,
    mqls: 89,
    sqls: 42,
    meetings: 18,
  },
  {
    id: 'tortilla',
    name: 'Tortilla',
    value: 20,
    color: '#f59e0b',
    outreach: 950,
    responses: 85,
    mqls: 45,
    sqls: 21,
    meetings: 8,
  }
];

// Time series data for AreaChart
export const timeSeriesData = [
  { name: 'Mon', outreach: 400, responses: 24, mqls: 10 },
  { name: 'Tue', outreach: 300, responses: 13, mqls: 5 },
  { name: 'Wed', outreach: 550, responses: 98, mqls: 45 },
  { name: 'Thu', outreach: 1200, responses: 130, mqls: 60 },
  { name: 'Fri', outreach: 1800, responses: 240, mqls: 90 },
  { name: 'Sat', outreach: 800, responses: 110, mqls: 40 },
  { name: 'Sun', outreach: 200, responses: 20, mqls: 8 },
];

export const globalMetrics = {
  totalOutreach: campaignData.reduce((acc, curr) => acc + curr.outreach, 0),
  totalResponses: campaignData.reduce((acc, curr) => acc + curr.responses, 0),
  totalMQLs: campaignData.reduce((acc, curr) => acc + curr.mqls, 0),
  totalSQLs: campaignData.reduce((acc, curr) => acc + curr.sqls, 0),
  totalMeetings: campaignData.reduce((acc, curr) => acc + curr.meetings, 0),
  responseRate: ((campaignData.reduce((acc, curr) => acc + curr.responses, 0) / campaignData.reduce((acc, curr) => acc + curr.outreach, 0)) * 100).toFixed(1),
  conversionRate: ((campaignData.reduce((acc, curr) => acc + curr.meetings, 0) / campaignData.reduce((acc, curr) => acc + curr.sqls, 0)) * 100).toFixed(1)
};
