import React from 'react';
import { JobApplication } from '../types/application';
import { Target, Mail, Clock, TrendingUp } from 'lucide-react';

interface PipelineViewProps {
  applications: JobApplication[];
}

export function PipelineView({ applications }: PipelineViewProps) {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pipelineData = [
    { 
      status: 'applied', 
      name: 'Applied', 
      description: 'Applications sent',
      count: statusCounts.applied || 0, 
      color: 'from-blue-500 to-blue-600',
      icon: Mail
    },
    { 
      status: 'response', 
      name: 'Responses', 
      description: 'Companies responded',
      count: statusCounts.response || 0, 
      color: 'from-emerald-500 to-emerald-600',
      icon: TrendingUp
    },
    { 
      status: 'no_response', 
      name: 'Pending', 
      description: 'Awaiting response',
      count: statusCounts.no_response || 0, 
      color: 'from-gray-500 to-gray-600',
      icon: Clock
    },
  ];

  const responseRate = applications.length > 0 
    ? Math.round(((statusCounts.response || 0) / applications.length) * 100)
    : 0;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Application Flow</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Response Rate</div>
          <div className="text-xl font-bold text-emerald-400">{responseRate}%</div>
        </div>
      </div>

      <div className="space-y-4">
        {pipelineData.map((item) => {
          const percentage = applications.length > 0 ? (item.count / applications.length) * 100 : 0;
          const Icon = item.icon;
          
          return (
            <div key={item.status} className="relative">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold text-lg">{item.name}</h4>
                    <span className="text-white font-bold text-lg">{item.count}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No application data yet.</p>
          <p className="text-sm mt-1">Your flow will appear here as you apply!</p>
        </div>
      )}

      {applications.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">This Week</div>
              <div className="text-white font-semibold">
                {applications.filter(app => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(app.dateApplied) >= oneWeekAgo;
                }).length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Auto-Tracked</div>
              <div className="text-emerald-400 font-semibold">
                {applications.filter(app => app.appliedVia === 'Gmail automation').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}