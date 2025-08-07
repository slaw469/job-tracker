import React from 'react';
import { JobApplication } from '../types/application';
import { TrendingUp } from 'lucide-react';

interface ApplicationChartProps {
  applications: JobApplication[];
}

export function ApplicationChart({ applications }: ApplicationChartProps) {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { status: 'Applied', count: statusCounts.applied || 0, color: 'bg-blue-500', glowColor: 'shadow-blue-500/50' },
    { status: 'Response', count: statusCounts.response || 0, color: 'bg-emerald-500', glowColor: 'shadow-emerald-500/50' },
    { status: 'Rejected', count: statusCounts.rejected || 0, color: 'bg-red-500', glowColor: 'shadow-red-500/50' },
    { status: 'No Response', count: statusCounts.no_response || 0, color: 'bg-gray-500', glowColor: 'shadow-gray-500/50' },
  ];

  const maxCount = Math.max(...chartData.map(item => item.count), 1);
  const totalApplications = applications.length;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Application Status</h3>
        </div>
        <div className="text-sm text-gray-400">
          {totalApplications} total applications
        </div>
      </div>

      <div className="space-y-4">
        {chartData.map(({ status, count, color, glowColor }) => (
          <div key={status} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">{status}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{count}</span>
                <span className="text-gray-400 text-sm">
                  ({totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-lg ${glowColor}`}
                style={{ 
                  width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {totalApplications === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No applications to display yet.</p>
          <p className="text-sm mt-1">Start applying to see your progress!</p>
        </div>
      )}
    </div>
  );
}