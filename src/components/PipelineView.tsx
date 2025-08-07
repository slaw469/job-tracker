import React from 'react';
import { JobApplication } from '../types/application';
import { Target, ArrowRight } from 'lucide-react';

interface PipelineViewProps {
  applications: JobApplication[];
}

export function PipelineView({ applications }: PipelineViewProps) {
  const pipelineStages = [
    { id: 'applied', name: 'Applied', color: 'from-blue-500 to-blue-600', count: 0 },
    { id: 'interviewing', name: 'Interviewing', color: 'from-amber-500 to-amber-600', count: 0 },
    { id: 'offer', name: 'Offers', color: 'from-emerald-500 to-emerald-600', count: 0 },
  ];

  applications.forEach(app => {
    const stage = pipelineStages.find(s => s.id === app.status);
    if (stage) stage.count++;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Application Pipeline</h3>
      </div>

      <div className="space-y-6">
        {pipelineStages.map((stage, index) => (
          <div key={stage.id} className="relative">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-lg">{stage.count}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg">{stage.name}</h4>
                <p className="text-gray-400 text-sm">
                  {stage.count} {stage.count === 1 ? 'application' : 'applications'}
                </p>
              </div>
            </div>
            
            {index < pipelineStages.length - 1 && (
              <div className="flex justify-center mt-4">
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {applications.length > 0 
              ? Math.round((pipelineStages[2].count / applications.length) * 100)
              : 0}%
          </div>
          <div className="text-sm text-gray-400">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}