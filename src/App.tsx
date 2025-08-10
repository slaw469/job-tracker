import { useEffect, useState } from 'react';
import { ApplicationsTable } from './components/ApplicationsTable';
import { ApplicationModal } from './components/ApplicationModal';
import { AddApplicationModal } from './components/AddApplicationModal';
import { AuthPage } from './components/Auth/AuthPage';
import { JobApplication } from './types/application';
import { mockApplications } from './data/mockData';
import { supabase } from './lib/supabase';
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

  const handleGmailScrape = (newApplications: JobApplication[]) => {
    setApplications(prev => [...newApplications, ...prev]);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    // If user has no name yet, open onboarding modal to capture it
    const hasName = Boolean(userData.name && userData.name.trim().length > 0);
    setShowWelcome(true);
    setPendingNameUpdate(!hasName);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleLogout = async () => {
    // Sign out from Supabase to clear session and provider token linkage
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
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

  // OAuth debugging – logs current URL, session state, and auth events
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

    const debugOAuthFlow = async () => {
      // eslint-disable-next-line no-console
      console.log('=== OAUTH DEBUG START ===');
      // eslint-disable-next-line no-console
      console.log('🔍 Current URL:', window.location.href);
      // eslint-disable-next-line no-console
      console.log('🔍 Current pathname:', window.location.pathname);
      // eslint-disable-next-line no-console
      console.log('🔍 URL params:', window.location.search);
      // eslint-disable-next-line no-console
      console.log('🔍 URL hash:', window.location.hash);

      if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
        // eslint-disable-next-line no-console
        console.log('🔄 OAuth redirect detected!');
      }

      if (!supabase) {
        // eslint-disable-next-line no-console
        console.log('⚠️ Supabase client not configured');
        // eslint-disable-next-line no-console
        console.log('=== OAUTH DEBUG END ===');
        return;
      }

      const { data: { session }, error } = supabase ? await supabase.auth.getSession() : ({ data: { session: null }, error: null } as any);
      // eslint-disable-next-line no-console
      console.log('🔍 Session exists:', !!session);
      // eslint-disable-next-line no-console
      console.log('🔍 User email:', session?.user?.email);
      // eslint-disable-next-line no-console
      console.log('🔍 Provider token exists:', !!(session as any)?.provider_token);
      // eslint-disable-next-line no-console
      console.log('🔍 Session error:', error);

      if (session) {
        const email = session.user.email || '';
        if (!isEmailAllowed(email)) {
          // eslint-disable-next-line no-console
          console.log('⛔ OAuth user not allowed:', email);
          setBlockedMessage('This Google account is not permitted. Please sign up or contact support.');
          try {
            if (supabase) await supabase.auth.signOut();
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
        const userName = (session.user.user_metadata as any)?.name || (session.user.email?.split('@')[0] || 'User');
        setUser({ name: userName, email: session.user.email || '' });
      } else {
        // eslint-disable-next-line no-console
        console.log('❌ USER IS NOT LOGGED IN');
      }
      // eslint-disable-next-line no-console
      console.log('=== OAUTH DEBUG END ===');

      // Clean OAuth hash if present after we processed session
      if (window.location.hash.includes('access_token')) {
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 300);
      }

      setAuthLoading(false);
    };

    debugOAuthFlow();

    let unsubscribe: (() => void) | undefined;
    if (supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        // eslint-disable-next-line no-console
        console.log('🔄 Auth state changed:', event);
        // eslint-disable-next-line no-console
        console.log('🔄 New session:', !!session);
        // eslint-disable-next-line no-console
        console.log('🔄 Current URL during auth change:', window.location.href);

        if (event === 'SIGNED_IN' && session) {
          // eslint-disable-next-line no-console
          console.log('✅ SIGNED IN EVENT - User:', session.user.email);
          // eslint-disable-next-line no-console
          console.log('✅ Should redirect to dashboard now...');
          const email = session.user.email || '';
          const allowedEmailsEnv2 = (import.meta.env.VITE_ALLOWED_GOOGLE_EMAILS as string | undefined) || '';
          const allowedEmails2 = new Set(allowedEmailsEnv2.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
          const allowed = allowedEmails2.size === 0 || allowedEmails2.has(email.toLowerCase());
          if (!allowed) {
            // eslint-disable-next-line no-console
            console.log('⛔ OAuth user not allowed (listener):', email);
            setBlockedMessage('This Google account is not permitted. Please sign up or contact support.');
            (async () => {
              try { if (supabase) await supabase.auth.signOut(); } catch {}
              setUser(null);
              if (window.location.pathname !== '/') {
                window.history.replaceState(null, '', '/');
              }
            })();
            return;
          }
          const userName = (session.user.user_metadata as any)?.name || (email.split('@')[0] || 'User');
          setUser({ name: userName, email });
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
      unsubscribe = listener.subscription.unsubscribe;
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Routing decision with detailed debug
  // eslint-disable-next-line no-console
  console.log('🔍 ROUTING DEBUG:', {
    user: !!user,
    userEmail: user?.email,
    authLoading,
    pathname: window.location.pathname,
    shouldShowDashboard: !!user && !authLoading,
    componentRendering: (!user || authLoading) ? 'AUTH_PAGE' : 'DASHBOARD',
  });
  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (!user) {
    return (
      <>
        {blockedMessage && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 m-4 rounded">
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
            await supabase?.auth.updateUser({ data: { name } });
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