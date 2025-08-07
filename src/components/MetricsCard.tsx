import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  glowColor: 'cyan' | 'blue' | 'emerald' | 'amber' | 'purple';
  subtitle?: string;
}

const glowStyles = {
  cyan: 'shadow-cyan-500/20 border-cyan-500/30 from-cyan-500/10 to-blue-600/10',
  blue: 'shadow-blue-500/20 border-blue-500/30 from-blue-500/10 to-indigo-600/10',
  emerald: 'shadow-emerald-500/20 border-emerald-500/30 from-emerald-500/10 to-green-600/10',
  amber: 'shadow-amber-500/20 border-amber-500/30 from-amber-500/10 to-yellow-600/10',
  purple: 'shadow-purple-500/20 border-purple-500/30 from-purple-500/10 to-pink-600/10',
};

const iconColors = {
  cyan: 'text-cyan-400',
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400',
};

export function MetricsCard({ title, value, icon: Icon, trend, glowColor, subtitle }: MetricsCardProps) {
  return (
    <div className={`p-6 bg-gradient-to-br ${glowStyles[glowColor]} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${iconColors[glowColor]}`} />
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  );
}