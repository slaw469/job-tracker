import React from 'react';
import { JobApplication } from '../types/application';
import { Activity, Building2, Calendar, Bot, Mail } from 'lucide-react';

interface RecentActivityProps {
  applications: JobApplication[];
}

export function RecentActivity({ applications }: RecentActivityProps) {
  const recentApplications = applications
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
    .slice(0, 6);

  const getStatusColor = (status: JobApplication['status']) => {
    const colors = {
      applied: 'text-blue-400',
      response: 'text-emerald-400',
      rejected: 'text-red-400',
      no_response: 'text-gray-400'
    };
    return colors[status];
  };

  const getStatusLabel = (status: JobApplication['status']) => {
    const labels = {
      applied: 'Applied',
      response: 'Response Received',
      rejected: 'Rejected',
      no_response: 'No Response Yet'
    };
    return labels[status];
  };

  const getDaysAgo = (dateApplied: string) => {
    const now = new Date();
    const applied = new Date(dateApplied);
    const diffTime = Math.abs(now.getTime() - applied.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays - 1} days ago`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Recent Applications</h3>
      </div>

      {recentApplications.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No applications yet.</p>
          <p className="text-sm mt-1">Your recent activity will appear here!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentApplications.map((app) => (
            <div key={app.id} className="flex gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:bg-gray-700/30 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-semibold truncate">{app.jobTitle}</h4>
                    <p className="text-gray-400 text-sm truncate">{app.company}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {app.appliedVia === 'Gmail automation' && (
                      <div title="Auto-tracked">
                        <Bot className="w-3 h-3 text-emerald-400" />
                      </div>
                    )}
                    {app.emailSubject && (
                      <div title="Email tracked">
                        <Mail className="w-3 h-3 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${getStatusColor(app.status)}`}>
                    {getStatusLabel(app.status)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {getDaysAgo(app.dateApplied)}
                  </div>
                </div>
                
                {app.emailSubject && (
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    "{app.emailSubject}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {recentApplications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
            View All Applications →
          </button>
        </div>
      )}
    </div>
  );
}