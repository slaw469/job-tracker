export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  dateApplied: string;
  dateAdded: string; // When it was added to the system
  source: string; // LinkedIn, Indeed, Gmail, etc.
  jobUrl?: string;
  emailSubject?: string; // Subject line from confirmation email
  notes?: string;
  appliedVia?: string; // "Gmail automation" or "Manual entry"
  hasReferral: boolean; // Yes/No for referral
}