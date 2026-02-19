import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { Button } from '../../components/Button';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Total Campaigns',
      value: '50',
      change: '+12%',
      icon: BarChart3,
      color: 'blue',
    },
    {
      label: 'Active Users',
      value: '2,543',
      change: '+8%',
      icon: Users,
      color: 'green',
    },
    {
      label: 'Total Revenue',
      value: '$54,239',
      change: '+23%',
      icon: DollarSign,
      color: 'orange',
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: '+5%',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 text-${stat.color}-600`} />
                <span className="text-green-600 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/campaigns')}>
            View All Campaigns
          </Button>
          <Button variant="secondary" onClick={() => navigate('/analytics')}>
            View Analytics
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            'Campaign "Summer Sale" was updated',
            'New campaign "Holiday Special" created',
            '15 campaigns marked as completed',
            'Performance report generated',
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 border-b last:border-b-0"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <p className="text-sm text-gray-700">{activity}</p>
              <span className="ml-auto text-xs text-gray-500">
                {index + 1}h ago
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
