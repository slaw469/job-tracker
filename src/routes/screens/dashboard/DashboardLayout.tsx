import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { Sun, Moon, Mail, LogOut, Plus, RefreshCw } from 'lucide-react';

export default function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} px-8 py-10 text-center`}>
        <div className="max-w-5xl mx-auto">
          <h1 className={`text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>What companies are we targeting today?</p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={toggleTheme} className={`p-3 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`} onClick={() => navigate('/dashboard/crm')}><Mail className="w-4 h-4" /> Connect Gmail</button>
            <button className={`p-3 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`} onClick={() => navigate('/login')} title="Sign Out"><LogOut className="w-5 h-5" /></button>
            <button className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`} onClick={() => navigate('/dashboard/crm')}><Plus className="w-4 h-4" /> Add Application</button>
            <button className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-800'}`} onClick={() => navigate('/dashboard/crm')}><RefreshCw className="w-4 h-4" /> Refresh</button>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className={`inline-flex rounded-lg overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <NavLink to="/dashboard/crm" className={({ isActive }) => `px-4 py-2 text-sm font-medium ${isActive ? (isDark ? 'bg-white/10 text-white' : 'bg-black text-white') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>CRM</NavLink>
              <NavLink to="/dashboard/settings" className={({ isActive }) => `px-4 py-2 text-sm font-medium ${isActive ? (isDark ? 'bg-white/10 text-white' : 'bg-black text-white') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>Settings</NavLink>
              <NavLink to="/dashboard/upgrade" className={({ isActive }) => `px-4 py-2 text-sm font-medium ${isActive ? (isDark ? 'bg-white/10 text-white' : 'bg-black text-white') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>Upgrade</NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <React.Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
          <Outlet />
        </React.Suspense>
      </div>
    </div>
  );
}

