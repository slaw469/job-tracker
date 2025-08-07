import { JobApplication } from '../types/application';

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    dateApplied: '2024-01-15',
    dateAdded: '2024-01-15T14:30:00Z',
    source: 'LinkedIn',
    jobUrl: 'https://techcorp.com/careers/senior-frontend',
    emailSubject: 'Thank you for your application to TechCorp',
    appliedVia: 'Gmail automation',
    hasReferral: false,
    notes: 'Great company, applied through LinkedIn'
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    dateApplied: '2024-01-18',
    dateAdded: '2024-01-18T09:15:00Z',
    source: 'Referral',
    appliedVia: 'Manual entry',
    hasReferral: true
  },
  {
    id: '3',
    jobTitle: 'React Developer',
    company: 'DesignStudio',
    dateApplied: '2024-01-12',
    dateAdded: '2024-01-12T16:45:00Z',
    source: 'Indeed',
    emailSubject: 'Application received - React Developer position',
    appliedVia: 'Gmail automation',
    hasReferral: false
  },
  {
    id: '4',
    jobTitle: 'Software Engineer',
    company: 'BigTech',
    dateApplied: '2024-01-05',
    dateAdded: '2024-01-05T11:20:00Z',
    source: 'Referral',
    appliedVia: 'Manual entry',
    hasReferral: true
  },
  {
    id: '5',
    jobTitle: 'Web Developer',
    company: 'LocalBusiness',
    dateApplied: '2024-01-22',
    dateAdded: '2024-01-22T13:10:00Z',
    source: 'Company Website',
    appliedVia: 'Manual entry',
    hasReferral: false,
    notes: 'Small company, seems promising'
  }
];