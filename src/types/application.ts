export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
  dateApplied: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  jobUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  notes?: string;
  source: string;
  priority: 'low' | 'medium' | 'high';
  activities: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'application' | 'interview' | 'follow-up' | 'email' | 'call' | 'offer' | 'rejection';
  title: string;
  description?: string;
  date: string;
  completed?: boolean;
}

export interface DashboardMetrics {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  responseRate: number;
  avgResponseTime: number;
}