import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ApplicationsTable } from './components/ApplicationsTable';
import { ApplicationModal } from './components/ApplicationModal';
import { JobApplication } from './types/application';
import { mockApplications } from './data/mockData';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);

  const handleSelectApplication = (application: JobApplication) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleUpdateApplication = (updatedApplication: JobApplication) => {
    setApplications(prev => 
      prev.map(app => app.id === updatedApplication.id ? updatedApplication : app)
    );
    setSelectedApplication(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 overflow-auto">
        {activeView === 'dashboard' && (
          <Dashboard applications={applications} />
        )}
        
        {activeView === 'applications' && (
          <ApplicationsTable 
            applications={applications}
            onSelectApplication={handleSelectApplication}
          />
        )}
      </main>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={handleCloseModal}
          onUpdate={handleUpdateApplication}
        />
      )}
    </div>
  );
}

export default App;