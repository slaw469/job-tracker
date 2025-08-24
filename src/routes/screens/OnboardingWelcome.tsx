import React from 'react';
import { useNavigate } from 'react-router-dom';
// Replaced Supabase with Firebase for authentication
import { firebaseAuth } from '../../lib/firebaseAuth';

export default function OnboardingWelcome() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      // Using Firebase instead of Supabase for session management
      const { data: { session } } = await firebaseAuth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      const name = session.user.user_metadata?.name || 'Friend';
      setUserName(name);
    })();
  }, [navigate]);

  const handleContinue = async () => {
    // Get user email from Firebase session instead of Supabase
    const { data: { session } } = await firebaseAuth.getSession();
    const email = session?.user?.email || '';
    try {
      if (email) localStorage.setItem(`onboarding_complete:${email.toLowerCase()}`, '1');
    } catch {}
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-4 text-center">
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        <p className="text-gray-600">Ready to start tracking? Click continue to head to your dashboard.</p>
        <button className="px-4 py-2 bg-black text-white" onClick={handleContinue}>Continue to Dashboard</button>
      </div>
    </div>
  );
}

