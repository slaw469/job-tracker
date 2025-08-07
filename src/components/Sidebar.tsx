import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  Settings, 
  Webhook,
  Sparkles,
  Target,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onAddApplication: () => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', name: 'Applications', icon: Briefcase },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
  { id: 'automation', name: 'Automation', icon: Sparkles },
  { id: 'webhooks', name: 'Webhooks', icon: Webhook },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar({ activeView, onViewChange, onAddApplication }: SidebarProps) {
  return (
    <>
      {/* CSS Animation for sidebar logo trace */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes traceSidebar {
            0% { 
              stroke-dashoffset: 120;
              animation-timing-function: ease-out;
            }
            25% { 
              stroke-dashoffset: 90;
              animation-timing-function: ease-in;
            }
            50% { 
              stroke-dashoffset: 60;
              animation-timing-function: ease-out;
            }
            75% { 
              stroke-dashoffset: 30;
              animation-timing-function: ease-in;
            }
            100% { 
              stroke-dashoffset: 0;
              animation-timing-function: ease-out;
            }
          }
          .logo-trace-sidebar {
            animation: traceSidebar 3s infinite;
          }
        `
      }} />
      
      <div className="w-64 bg-[#111111] border-r border-gray-800 p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 flex items-center justify-center relative">
            {/* Enhanced glow effect background */}
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-lg"></div>
            <div className="absolute inset-0 bg-white/5 rounded-lg backdrop-blur-sm border border-white/20"></div>
            
            {/* Animated white box trace */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
              <rect
                x="1"
                y="1"
                width="30"
                height="30"
                rx="6"
                ry="6"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="120"
                strokeDashoffset="120"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="logo-trace-sidebar"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.4))'
                }}
              />
            </svg>
            
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="ApplyTrack" 
              className="w-5 h-5 object-contain relative z-10" 
              style={{
                filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
              }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg italic" 
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              ApplyTrack
            </h1>
            <p className="text-gray-400 text-xs italic" 
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: '0 0 8px rgba(156, 163, 175, 0.4)'
              }}
            >
              AI Job Tracker
            </p>
          </div>
        </div>

      {/* Add Application Button */}
      <button
        onClick={onAddApplication}
        className="w-full mb-8 p-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Application
      </button>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <div className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">Gmail Automation</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Connect Gmail to auto-track applications
          </p>
          <button className="w-full py-2 px-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded text-xs font-medium hover:bg-cyan-600/30 transition-colors">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
    </>
  );
}