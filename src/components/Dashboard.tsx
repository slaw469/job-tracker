import React from 'react';
import { MetricsCard } from './MetricsCard';
import { ApplicationChart } from './ApplicationChart';
import { RecentActivity } from './RecentActivity';
import { PipelineView } from './PipelineView';
import { JobApplication } from '../types/application';
import { 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Award,
  Clock,
  Target
} from 'lucide-react';

interface DashboardProps {
  applications: JobApplication[];
}

export function Dashboard({ applications }: DashboardProps) {
  const totalApplications = applications.length;
  const activeApplications = applications.filter(app => 
    app.status === 'applied' || app.status === 'interviewing'
  ).length;
  const interviewsScheduled = applications.filter(app => 
    app.status === 'interviewing'
  ).length;
  const offersReceived = applications.filter(app => 
    app.status === 'offer'
  ).length;

  const responseRate = applications.length > 0 
    ? Math.round(((applications.length - applications.filter(app => app.status === 'applied').length) / applications.length) * 100)
    : 0;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Track your job application journey with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Applications"
          value={totalApplications}
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
          glowColor="cyan"
        />
        <MetricsCard
          title="Active Pipeline"
          value={activeApplications}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          glowColor="blue"
        />
        <MetricsCard
          title="Interviews"
          value={interviewsScheduled}
          icon={Calendar}
          trend={{ value: 3, isPositive: true }}
          glowColor="emerald"
        />
        <MetricsCard
          title="Offers"
          value={offersReceived}
          icon={Award}
          trend={{ value: 1, isPositive: true }}
          glowColor="amber"
        />
      </div>

      {/* Charts and Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ApplicationChart applications={applications} />
        <PipelineView applications={applications} />
      </div>

      {/* Recent Activity */}
      <RecentActivity applications={applications} />
    </div>
  );
}