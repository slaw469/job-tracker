import React, { useState, useMemo } from 'react';
import { JobApplication } from '../types/application';
import { 
  Search, 
  Filter, 
  Eye, 
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Building2
} from 'lucide-react';

interface ApplicationsTableProps {
  applications: JobApplication[];
  onSelectApplication: (application: JobApplication) => void;
}

export function ApplicationsTable({ applications, onSelectApplication }: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof JobApplication>('dateApplied');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'dateApplied') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof JobApplication) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
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

  const getPriorityBadge = (priority: JobApplication['priority']) => {
    const styles = {
      low: 'bg-gray-500/20 text-gray-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-red-500/20 text-red-400'
    };

    return (
      <span className={`w-2 h-2 rounded-full ${styles[priority]}`} />
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
          <p className="text-gray-400">Manage and track all your job applications</p>
        </div>
        <div className="text-sm text-gray-400">
          {filteredAndSortedApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('jobTitle')}
                    className="text-gray-300 hover:text-white font-medium text-sm flex items-center gap-2"
                  >
                    Job Title
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('company')}
                    className="text-gray-300 hover:text-white font-medium text-sm flex items-center gap-2"
                  >
                    Company
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="text-gray-300 hover:text-white font-medium text-sm"
                  >
                    Status
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('dateApplied')}
                    className="text-gray-300 hover:text-white font-medium text-sm"
                  >
                    Date Applied
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-300 font-medium text-sm">Details</span>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-300 font-medium text-sm">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedApplications.map((application) => (
                <tr key={application.id} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(application.priority)}
                      <div>
                        <div className="text-white font-medium">{application.jobTitle}</div>
                        <div className="text-gray-400 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {application.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{application.company}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-gray-400 text-sm capitalize">{application.jobType}</div>
                      {application.salary && (
                        <div className="text-emerald-400 text-sm flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {application.salary}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectApplication(application)}
                        className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {application.jobUrl && (
                        <a
                          href={application.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-700/50 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-600/50 transition-colors"
                          title="View Job Posting"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}