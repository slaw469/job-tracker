import { useEffect, useState } from 'react';
import { ApplicationsTable } from './components/ApplicationsTable';
import { ApplicationModal } from './components/ApplicationModal';
import { AddApplicationModal } from './components/AddApplicationModal';
import { AuthPage } from './components/Auth/AuthPage';
import { JobApplication } from './types/application';
import { mockApplications } from './data/mockData';
// Replaced Supabase imports with Firebase for authentication and database
import { firebaseAuth } from './lib/firebaseAuth';
import { WelcomeModal } from './components/WelcomeModal';

interface User {
  name: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [showWelcome, setShowWelcome] = useState(false);
  const [pendingNameUpdate, setPendingNameUpdate] = useState(false);

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

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleGmailScrape = async () => {
    // Gmail integration logic would go here
    // For now, this is a placeholder
    console.log('Gmail scrape requested');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    const email = userData.email.toLowerCase();
    const hasName = Boolean(userData.name && userData.name.trim().length > 0);
    const key = `welcome_shown:${email}`;
    const alreadyShown = (() => { try { return sessionStorage.getItem(key) === '1'; } catch { return false; } })();
    if (!alreadyShown) {
      setShowWelcome(true);
      setPendingNameUpdate(!hasName);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    try {
      if (user?.email) sessionStorage.setItem(`welcome_shown:${user.email.toLowerCase()}`, '1');
    } catch {}
  };

  const handleLogout = async () => {
    // Sign out from Firebase to clear session and provider token linkage
    try {
      await firebaseAuth.signOut();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Sign out error:', e);
    }
    // Clear any per-tab flags used by UI
    try {
      sessionStorage.removeItem('gmail_connected_toast_shown');
    } catch {}

    setUser(null);
    setShowWelcome(false);

    // Optional: navigate to login/root to avoid stale route state
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
  };

  // Firebase authentication setup - replaces Supabase OAuth debugging
  useEffect(() => {
    const allowedEmailsEnv = (import.meta.env.VITE_ALLOWED_GOOGLE_EMAILS as string | undefined) || '';
    const allowedEmails = new Set(
      allowedEmailsEnv
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0)
    );

    const isEmailAllowed = (email?: string | null): boolean => {
      if (!email) return false;
      // If list provided, enforce allowlist; if empty, allow all (no restriction configured)
      if (allowedEmails.size === 0) return true;
      return allowedEmails.has(email.toLowerCase());
    };

    const initializeAuth = async () => {
      // eslint-disable-next-line no-console
      console.log('=== FIREBASE AUTH INIT ===');
      
      // Check current Firebase auth state
      const { data: { session } } = await firebaseAuth.getSession();
      
      if (session) {
        const email = session.user.email || '';
        if (!isEmailAllowed(email)) {
          // eslint-disable-next-line no-console
          console.log('⛔ User not allowed:', email);
          setBlockedMessage('This Google account is not permitted. Please sign up or contact support.');
          try {
            await firebaseAuth.signOut();
          } catch {}
          setUser(null);
          setAuthLoading(false);
          if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/');
          }
          return;
        }
        
        // eslint-disable-next-line no-console
        console.log('✅ USER IS LOGGED IN');
        const userName = session.user.user_metadata?.name || (session.user.email?.split('@')[0] || 'User');
        setUser({ name: userName, email });
        
        const hasName = Boolean(userName && String(userName).trim().length > 0);
        const key = `welcome_shown:${email.toLowerCase()}`;
        const alreadyShown = (() => { try { return sessionStorage.getItem(key) === '1'; } catch { return false; } })();
        if (!alreadyShown) {
          setShowWelcome(true);
          setPendingNameUpdate(!hasName);
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('❌ USER IS NOT LOGGED IN');
      }
      
      setAuthLoading(false);
    };

    initializeAuth();

    // Set up Firebase auth state listener - replaces Supabase onAuthStateChange
    const { data: listener } = firebaseAuth.onAuthStateChange((event, session) => {
      // eslint-disable-next-line no-console
      console.log('🔄 Auth state changed:', event);
      // eslint-disable-next-line no-console
      console.log('🔄 New session:', !!session);

      if (event === 'SIGNED_IN' && session) {
        // eslint-disable-next-line no-console
        console.log('✅ SIGNED IN EVENT - User:', session.user.email);
        const email = session.user.email || '';
        const allowedEmailsEnv2 = (import.meta.env.VITE_ALLOWED_GOOGLE_EMAILS as string | undefined) || '';
        const allowedEmails2 = new Set(allowedEmailsEnv2.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
        const allowed = allowedEmails2.size === 0 || allowedEmails2.has(email.toLowerCase());
        
        if (!allowed) {
          // eslint-disable-next-line no-console
          console.log('⛔ User not allowed (listener):', email);
          setBlockedMessage('This Google account is not permitted. Please sign up or contact support.');
          (async () => {
            try { await firebaseAuth.signOut(); } catch {}
            setUser(null);
            if (window.location.pathname !== '/') {
              window.history.replaceState(null, '', '/');
            }
          })();
          return;
        }
        
        const userName = session.user.user_metadata?.name || (email.split('@')[0] || 'User');
        setUser({ name: userName, email });
        
        // Show onboarding modal on sign-in only if not already shown this session
        const hasName = Boolean(userName && String(userName).trim().length > 0);
        const key = `welcome_shown:${email.toLowerCase()}`;
        const alreadyShown = (() => { try { return sessionStorage.getItem(key) === '1'; } catch { return false; } })();
        if (!alreadyShown) {
          setShowWelcome(true);
          setPendingNameUpdate(!hasName);
        }
        if (window.location.pathname !== '/dashboard') {
          window.history.replaceState(null, '', '/dashboard');
        }
      }

      if (event === 'SIGNED_OUT') {
        // eslint-disable-next-line no-console
        console.log('❌ SIGNED OUT EVENT');
        setUser(null);
      }
    });

    // Cleanup function for Firebase auth listener
    return () => {
      if (listener?.subscription?.unsubscribe) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  // Show loading while checking authentication state
  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Show auth page if user is not logged in or if blocked
  if (!user || blockedMessage) {
    return (
      <>
        {blockedMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            {blockedMessage}
          </div>
        )}
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        userName={user.name}
        onSubmitName={async (name: string) => {
          setPendingNameUpdate(true);
          try {
            // Update user name in Firebase instead of Supabase
            await firebaseAuth.updateUser({ data: { name } });
            setUser((prev) => (prev ? { ...prev, name } : prev));
          } finally {
            setPendingNameUpdate(false);
          }
        }}
      />
      <ApplicationsTable
        applications={applications}
        onSelectApplication={handleSelectApplication}
        onAddApplication={() => setShowAddModal(true)}
        onGmailScrape={handleGmailScrape}
        onSetApplications={setApplications}
        onDeleteApplication={handleDeleteApplication}
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
