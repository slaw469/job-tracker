import React, { useState } from 'react';
import { JobApplication, ActivityItem } from '../types/application';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Mail,
  Phone,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

interface ApplicationModalProps {
  application: JobApplication;
  onClose: () => void;
  onUpdate: (application: JobApplication) => void;
}

export function ApplicationModal({ application, onClose, onUpdate }: ApplicationModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(application);
  const [newNote, setNewNote] = useState('');

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedApplication = {
        ...formData,
        notes: formData.notes ? `${formData.notes}\n\n${newNote}` : newNote
      };
      setFormData(updatedApplication);
      setNewNote('');
    }
  };

  const getStatusBadge = (status: JobApplication['status']) => {
    const styles = {
      applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      interviewing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      offer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      withdrawn: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} capitalize`}>
        {status}
      </span>
    );
  };

  const getActivityIcon = (type: string, completed?: boolean) => {
    if (completed === false) return AlertCircle;
    if (completed === true) return CheckCircle;
    return Clock;
  };

  const getActivityColor = (type: string, completed?: boolean) => {
    if (completed === false) return 'text-amber-400';
    if (completed === true) return 'text-emerald-400';
    return 'text-gray-400';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{formData.jobTitle}</h2>
              <p className="text-gray-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {formData.company}
              </p>
            </div>
            {getStatusBadge(formData.status)}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700/50 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  Save
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>Applied: {new Date(formData.dateApplied).toLocaleDateString()}</span>
                  </div>
                  {formData.salary && (
                    <div className="flex items-center gap-3 text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                      <span>{formData.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-300">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="capitalize">{formData.jobType}</span>
                  </div>
                  {formData.jobUrl && (
                    <a
                      href={formData.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>View Job Posting</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(formData.contactPerson || formData.contactEmail) && (
                <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {formData.contactPerson && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{formData.contactPerson}</span>
                      </div>
                    )}
                    {formData.contactEmail && (
                      <a
                        href={`mailto:${formData.contactEmail}`}
                        className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span>{formData.contactEmail}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Add your notes about this application..."
                      className="w-full h-32 p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a quick note..."
                        className="flex-1 p-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        onClick={handleAddNote}
                        className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {formData.notes || 'No notes added yet.'}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Activity Timeline */}
            <div className="space-y-6">
              <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.activities.map((activity) => {
                    const Icon = getActivityIcon(activity.type, activity.completed);
                    const colorClass = getActivityColor(activity.type, activity.completed);
                    
                    return (
                      <div key={activity.id} className="flex gap-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700/20">
                        <Icon className={`w-5 h-5 mt-1 ${colorClass}`} />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{activity.title}</h4>
                          {activity.description && (
                            <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Update */}
              {isEditing && (
                <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as JobApplication['status'] })}
                    className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}