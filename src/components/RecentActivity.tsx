import React from 'react';
import { JobApplication } from '../types/application';
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface RecentActivityProps {
  applications: JobApplication[];
}

export function RecentActivity({ applications }: RecentActivityProps) {
  const recentActivities = applications
    .flatMap(app => 
      app.activities.map(activity => ({
        ...activity,
        applicationTitle: `${app.jobTitle} at ${app.company}`,
        applicationId: app.id
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const getActivityIcon = (type: string, completed?: boolean) => {
    if (completed === false) return AlertCircle;
    if (completed === true) return CheckCircle;
    return Clock;
  };

  const getActivityColor = (type: string, completed?: boolean) => {
    if (completed === false) return 'text-amber-400';
    if (completed === true) return 'text-emerald-400';
    return 'text-gray-400';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type, activity.completed);
          const colorClass = getActivityColor(activity.type, activity.completed);
          
          return (
            <div key={`${activity.applicationId}-${activity.id}`} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors">
              <Icon className={`w-5 h-5 mt-1 ${colorClass}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-sm text-gray-400 truncate">{activity.applicationTitle}</p>
                {activity.description && (
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}