import { JobApplication } from '../../types/application';

export interface DashboardOutletContext {
  user: { name: string; email: string };
  applications: JobApplication[];
  setApplications: (apps: JobApplication[]) => void;
  onSelectApplication: (app: JobApplication) => void;
  onAddApplication: (app: Omit<JobApplication, 'id'>) => void;
  onUpdateApplication: (app: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
  onLogout: () => void;
  showWelcome: boolean;
  onWelcomeClose: () => void;
}

