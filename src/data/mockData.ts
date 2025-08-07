import { JobApplication } from '../types/application';

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    status: 'interviewing',
    dateApplied: '2024-01-15',
    location: 'San Francisco, CA',
    jobType: 'full-time',
    salary: '$120,000 - $160,000',
    jobUrl: 'https://example.com/job/1',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah@techcorp.com',
    notes: 'Great company culture, strong technical team',
    source: 'LinkedIn',
    priority: 'high',
    activities: [
      {
        id: '1',
        type: 'application',
        title: 'Application submitted',
        description: 'Applied through LinkedIn',
        date: '2024-01-15',
        completed: true
      },
      {
        id: '2',
        type: 'email',
        title: 'Confirmation email received',
        date: '2024-01-16',
        completed: true
      },
      {
        id: '3',
        type: 'interview',
        title: 'Phone screening scheduled',
        description: 'Technical interview with engineering manager',
        date: '2024-01-22',
        completed: false
      }
    ]
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'applied',
    dateApplied: '2024-01-12',
    location: 'Remote',
    jobType: 'full-time',
    salary: '$100,000 - $130,000',
    source: 'AngelList',
    priority: 'medium',
    activities: [
      {
        id: '4',
        type: 'application',
        title: 'Application submitted',
        date: '2024-01-12',
        completed: true
      }
    ]
  },
  {
    id: '3',
    jobTitle: 'React Developer',
    company: 'DesignStudio',
    status: 'offer',
    dateApplied: '2024-01-08',
    location: 'New York, NY',
    jobType: 'contract',
    salary: '$80/hour',
    source: 'Indeed',
    priority: 'high',
    activities: [
      {
        id: '5',
        type: 'application',
        title: 'Application submitted',
        date: '2024-01-08',
        completed: true
      },
      {
        id: '6',
        type: 'interview',
        title: 'Technical interview completed',
        date: '2024-01-15',
        completed: true
      },
      {
        id: '7',
        type: 'offer',
        title: 'Job offer received',
        description: '$80/hour, 6-month contract',
        date: '2024-01-18',
        completed: true
      }
    ]
  },
  {
    id: '4',
    jobTitle: 'UI/UX Developer',
    company: 'CreativeAgency',
    status: 'rejected',
    dateApplied: '2024-01-05',
    location: 'Austin, TX',
    jobType: 'full-time',
    source: 'Company Website',
    priority: 'low',
    activities: [
      {
        id: '8',
        type: 'application',
        title: 'Application submitted',
        date: '2024-01-05',
        completed: true
      },
      {
        id: '9',
        type: 'rejection',
        title: 'Rejection email received',
        description: 'Position filled internally',
        date: '2024-01-10',
        completed: true
      }
    ]
  },
  {
    id: '5',
    jobTitle: 'Software Engineer',
    company: 'BigTech',
    status: 'interviewing',
    dateApplied: '2024-01-20',
    location: 'Seattle, WA',
    jobType: 'full-time',
    salary: '$140,000 - $180,000',
    source: 'Referral',
    priority: 'high',
    activities: [
      {
        id: '10',
        type: 'application',
        title: 'Application submitted',
        date: '2024-01-20',
        completed: true
      },
      {
        id: '11',
        type: 'interview',
        title: 'Initial screening',
        date: '2024-01-23',
        completed: true
      }
    ]
  }
];