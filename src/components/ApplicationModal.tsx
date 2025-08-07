import React, { useState } from 'react';
import { JobApplication } from '../types/application';
import { useTheme } from '../contexts/ThemeContext';
import { 
  X, 
  Building2, 
  Calendar, 
  ExternalLink,
  Edit3,
  Save,
  Bot,
  Globe,
  Mail,
  Check,
  XIcon
} from 'lucide-react';

interface ApplicationModalProps {
  application: JobApplication;
  onClose: () => void;
  onUpdate: (application: JobApplication) => void;
}

export function ApplicationModal({ application, onClose, onUpdate }: ApplicationModalProps) {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(application);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(application);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b transition-colors duration-200 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center ${
              isDark ? 'bg-white' : 'bg-black'
            }`}>
              <Building2 className={`w-6 h-6 ${isDark ? 'text-black' : 'text-white'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {application.jobTitle}
              </h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {application.company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {application.appliedVia === 'Gmail automation' && (
              <div className={`flex items-center gap-2 text-sm px-3 py-1 border transition-colors duration-200 ${
                isDark 
                  ? 'text-green-400 bg-green-900/20 border-green-800' 
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                <Bot className="w-4 h-4" />
                Auto-tracked
              </div>
            )}
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
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold pb-2 border-b transition-colors duration-200 ${
                isDark 
                  ? 'text-white border-gray-700' 
                  : 'text-gray-900 border-gray-200'
              }`}>
                Job Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className={`w-5 h-5 mt-0.5 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`} />
                  <div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Date Applied
                    </span>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      {new Date(application.dateApplied).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className={`w-5 h-5 mt-0.5 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`} />
                  <div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Date Added
                    </span>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      {new Date(application.dateAdded).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className={`w-5 h-5 mt-0.5 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`} />
                  <div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Source
                    </span>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      {application.source}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className={`text-lg font-semibold pb-2 border-b transition-colors duration-200 ${
                isDark 
                  ? 'text-white border-gray-700' 
                  : 'text-gray-900 border-gray-200'
              }`}>
                Application Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {application.hasReferral ? (
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XIcon className={`w-5 h-5 mt-0.5 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  )}
                  <div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Referral
                    </span>
                    <p className={application.hasReferral 
                      ? "text-green-500 font-medium" 
                      : (isDark ? "text-gray-600" : "text-gray-400")
                    }>
                      {application.hasReferral ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {application.emailSubject && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Email Subject
                      </span>
                      <p className={`text-blue-500 text-sm p-3 border mt-1 transition-colors duration-200 ${
                        isDark 
                          ? 'bg-blue-900/20 border-blue-800' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        "{application.emailSubject}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Bot className={`w-5 h-5 mt-0.5 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`} />
                  <div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Tracking Method
                    </span>
                    <p className={`flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {application.appliedVia === 'Gmail automation' ? (
                        <>
                          <Bot className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 font-medium">Gmail Automation</span>
                        </>
                      ) : (
                        <span>Manual Entry</span>
                      )}
                    </p>
                  </div>
                </div>

                {application.jobUrl && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className={`w-5 h-5 mt-0.5 ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`} />
                    <div>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Job Posting
                      </span>
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm underline font-medium transition-colors duration-200 ${
                          isDark 
                            ? 'text-white hover:text-gray-300' 
                            : 'text-black hover:text-gray-700'
                        }`}
                      >
                        View Original Posting
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes and Referral Section */}
          {isEditing ? (
            <div className="space-y-6">
              <div className={`border p-4 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Edit Referral
                </h3>
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
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    This application was referred
                  </span>
                </label>
              </div>
              <div className={`border p-4 transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Edit Notes
                </h3>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  placeholder="Add any notes about this application..."
                  className={`w-full p-3 border focus:outline-none focus:ring-1 transition-colors duration-200 ${
                    isDark 
                      ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:border-white focus:ring-white' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black'
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {application.notes && (
                <div className={`border p-4 transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Notes
                  </h3>
                  <p className={`whitespace-pre-wrap ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t transition-colors duration-200 ${
          isDark 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                View Job Posting
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 transition-colors duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors duration-200 ${
                    isDark 
                      ? 'bg-white hover:bg-gray-200 text-black' 
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}