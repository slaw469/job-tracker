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
    { status: 'Interviewing', count: statusCounts.interviewing || 0, color: 'bg-amber-500', glowColor: 'shadow-amber-500/50' },
    { status: 'Offer', count: statusCounts.offer || 0, color: 'bg-emerald-500', glowColor: 'shadow-emerald-500/50' },
    { status: 'Rejected', count: statusCounts.rejected || 0, color: 'bg-red-500', glowColor: 'shadow-red-500/50' },
  ];

  const maxCount = Math.max(...chartData.map(item => item.count), 1);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Application Status Overview</h3>
      </div>

      <div className="space-y-4">
        {chartData.map(({ status, count, color, glowColor }) => (
          <div key={status} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">{status}</span>
              <span className="text-white font-semibold">{count}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-lg ${glowColor} animate-pulse`}
                style={{ 
                  width: `${(count / maxCount) * 100}%`,
                  animationDelay: `${status.length * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total Applications</span>
          <span className="font-semibold text-white">{applications.length}</span>
        </div>
      </div>
    </div>
  );
}