import React, { useState } from 'react';
import { JobApplication } from '../types/application';
import { useTheme } from '../contexts/ThemeContext';
import { 
  X, 
  Plus
} from 'lucide-react';

interface AddApplicationModalProps {
  onClose: () => void;
  onAdd: (application: Omit<JobApplication, 'id'>) => void;
}

export function AddApplicationModal({ onClose, onAdd }: AddApplicationModalProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    dateApplied: new Date().toISOString().split('T')[0],
    source: '',
    jobUrl: '',
    emailSubject: '',
    hasReferral: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.source.trim()) newErrors.source = 'Source is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const newApplication: Omit<JobApplication, 'id'> = {
      ...formData,
      dateAdded: new Date().toISOString(),
      emailSubject: formData.emailSubject.trim() || undefined,
      appliedVia: 'Manual entry'
    };

    onAdd(newApplication);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b transition-colors duration-200 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center ${
              isDark ? 'bg-white' : 'bg-black'
            }`}>
              <Plus className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} />
            </div>
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Add Application
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Job Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              className={`w-full p-3 border transition-colors duration-200 ${
                errors.jobTitle 
                  ? (isDark ? 'border-red-500' : 'border-red-300')
                  : (isDark ? 'border-gray-600' : 'border-gray-300')
              } ${
                isDark 
                  ? 'bg-gray-800 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
              placeholder="e.g. Senior Frontend Developer"
            />
            {errors.jobTitle && (
              <p className={`text-sm mt-1 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>
                {errors.jobTitle}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Company *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className={`w-full p-3 border transition-colors duration-200 ${
                errors.company 
                  ? (isDark ? 'border-red-500' : 'border-red-300')
                  : (isDark ? 'border-gray-600' : 'border-gray-300')
              } ${
                isDark 
                  ? 'bg-gray-800 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
              placeholder="e.g. TechCorp"
            />
            {errors.company && (
              <p className={`text-sm mt-1 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>
                {errors.company}
              </p>
            )}
          </div>

          {/* Date Applied */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Date Applied
            </label>
            <input
              type="date"
              value={formData.dateApplied}
              onChange={(e) => setFormData({...formData, dateApplied: e.target.value})}
              className={`w-full p-3 border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
            />
          </div>

          {/* Source */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Source *
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className={`w-full p-3 border transition-colors duration-200 ${
                errors.source 
                  ? (isDark ? 'border-red-500' : 'border-red-300')
                  : (isDark ? 'border-gray-600' : 'border-gray-300')
              } ${
                isDark 
                  ? 'bg-gray-800 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
              placeholder="e.g. LinkedIn, Indeed, Referral"
            />
            {errors.source && (
              <p className={`text-sm mt-1 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>
                {errors.source}
              </p>
            )}
          </div>

          {/* Email Subject */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email Subject
            </label>
            <input
              type="text"
              value={formData.emailSubject}
              onChange={(e) => setFormData({...formData, emailSubject: e.target.value})}
              className={`w-full p-3 border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
              placeholder="e.g. Thank you for your application"
            />
            <p className={`text-xs mt-1 ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Subject line from confirmation email
            </p>
          </div>

          {/* Referral */}
          <div className={`border p-4 transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.hasReferral}
                onChange={(e) => setFormData({...formData, hasReferral: e.target.checked})}
                className={`w-4 h-4 border focus:ring-1 transition-colors duration-200 ${
                  isDark 
                    ? 'text-white bg-gray-700 border-gray-600 focus:ring-white' 
                    : 'text-black bg-white border-gray-300 focus:ring-black'
                }`}
              />
              <span className={`font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                This application was referred
              </span>
            </label>
          </div>

          {/* Job URL */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Job Posting URL
            </label>
            <input
              type="url"
              value={formData.jobUrl}
              onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
              className={`w-full p-3 border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
              placeholder="https://..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className={`w-full p-3 border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
              } focus:outline-none focus:ring-1`}
              placeholder="Any additional notes..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t transition-colors duration-200 ${
          isDark 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 transition-colors duration-200 ${
              isDark 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-4 py-2 transition-colors duration-200 ${
              isDark 
                ? 'bg-white hover:bg-gray-200 text-black' 
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>
    </div>
  );
} 