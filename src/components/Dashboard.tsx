import React from 'react';
import { MetricsCard } from './MetricsCard';
import { ApplicationChart } from './ApplicationChart';
import { RecentActivity } from './RecentActivity';
import { PipelineView } from './PipelineView';
import { JobApplication } from '../types/application';
import { 
  Briefcase, 
  TrendingUp, 
  Mail, 
  Zap,
  Clock,
  Bot
} from 'lucide-react';

interface DashboardProps {
  applications: JobApplication[];
}

export function Dashboard({ applications }: DashboardProps) {
  const totalApplications = applications.length;
  
  // If no applications, show empty state
  if (totalApplications === 0) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center">
            <Bot className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to ApplyTrack</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Your AI-powered job application tracker is ready to go!<br/>
            Connect your Gmail to start automatically tracking applications.
          </p>
          
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Gmail Integration</h3>
                <p className="text-gray-400">Auto-detect "thank you for applying" emails</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Instant Tracking</h3>
                <p className="text-gray-400">Applications logged automatically with details</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Smart Insights</h3>
                <p className="text-gray-400">Track response rates and optimize your search</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-cyan-500/25">
              Connect Gmail
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-colors">
              Add Application Manually
            </button>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            Gmail integration coming soon • For now, applications are tracked manually
          </p>
        </div>
      </div>
    );
  }

  // Calculate this week's applications (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekApplications = applications.filter(app => 
    new Date(app.dateApplied) >= oneWeekAgo
  ).length;

  // Response rate (applications that got any response vs total)
  const responsesReceived = applications.filter(app => 
    app.status === 'response' || app.status === 'rejected'
  ).length;
  const responseRate = applications.length > 0 
    ? Math.round((responsesReceived / applications.length) * 100)
    : 0;

  // Count automated vs manual entries
  const automatedApplications = applications.filter(app => 
    app.appliedVia === 'Gmail automation'
  ).length;
  const automationRate = applications.length > 0 
    ? Math.round((automatedApplications / applications.length) * 100)
    : 0;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Tracker Dashboard</h1>
          <p className="text-gray-400">AI-powered application tracking • Automate smarter, track faster</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
            <Bot className="w-4 h-4" />
            Automation Active
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Applications"
          value={totalApplications}
          icon={Briefcase}
          trend={{ value: thisWeekApplications, isPositive: true }}
          glowColor="cyan"
          subtitle="Jobs tracked"
        />
        <MetricsCard
          title="This Week"
          value={thisWeekApplications}
          icon={TrendingUp}
          trend={{ value: 25, isPositive: true }}
          glowColor="blue"
          subtitle="New applications"
        />
        <MetricsCard
          title="Response Rate"
          value={`${responseRate}%`}
          icon={Mail}
          trend={{ value: 5, isPositive: true }}
          glowColor="emerald"
          subtitle="Companies responded"
        />
        <MetricsCard
          title="Automation Rate"
          value={`${automationRate}%`}
          icon={Zap}
          trend={{ value: 10, isPositive: true }}
          glowColor="amber"
          subtitle="Auto-tracked via Gmail"
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