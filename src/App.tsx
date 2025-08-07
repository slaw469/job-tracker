import React, { useState } from 'react';
import { ApplicationsTable } from './components/ApplicationsTable';
import { ApplicationModal } from './components/ApplicationModal';
import { AddApplicationModal } from './components/AddApplicationModal';
import { AuthPage } from './components/Auth/AuthPage';
import { JobApplication } from './types/application';
import { mockApplications } from './data/mockData';

interface User {
  name: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSelectApplication = (application: JobApplication) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleUpdateApplication = (updatedApplication: JobApplication) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
    setSelectedApplication(null);
  };

  const handleAddApplication = (applicationData: Omit<JobApplication, 'id'>) => {
    const newApplication: JobApplication = {
      ...applicationData,
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setApplications(prev => [newApplication, ...prev]);
    setShowAddModal(false);
  };

  const handleGmailScrape = (newApplications: JobApplication[]) => {
    setApplications(prev => [...newApplications, ...prev]);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowWelcome(true); // Show welcome modal when user logs in
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowWelcome(false);
  };

  // Show authentication page if user is not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <ApplicationsTable
        applications={applications}
        onSelectApplication={handleSelectApplication}
        onAddApplication={() => setShowAddModal(true)}
        onGmailScrape={handleGmailScrape}
        user={user}
        onLogout={handleLogout}
        showWelcome={showWelcome}
        onWelcomeClose={handleWelcomeClose}
      />

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={handleCloseModal}
          onUpdate={handleUpdateApplication}
        />
      )}

      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddApplication}
        />
      )}
    </div>
  );
}

export default App;