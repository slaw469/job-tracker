import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  Settings, 
  Webhook,
  Sparkles,
  Target
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', name: 'Applications', icon: Briefcase },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
  { id: 'automation', name: 'Automation', icon: Sparkles },
  { id: 'webhooks', name: 'Webhooks', icon: Webhook },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-[#111111] border-r border-gray-800 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Target className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">ApplyTrack</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Webhook Status */}
      <div className="mt-8 p-4 bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-400">Webhook Active</span>
        </div>
        <p className="text-xs text-gray-400">
          Automatically syncing job applications
        </p>
      </div>
    </div>
  );
}