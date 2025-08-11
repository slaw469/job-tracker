import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function OnboardingName() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const session = (await supabase?.auth.getSession())?.data.session;
      if (!session) {
        navigate('/login');
        return;
      }
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      await supabase?.auth.updateUser({ data: { name: name.trim() } });
      navigate('/onboarding/welcome');
    } catch (e: any) {
      setError(e?.message || 'Failed to save name');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Hey there! Ready to track your jobs?</h1>
        <p className="text-gray-500">Enter your name to personalize your experience.</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3"
          placeholder="Your name"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="px-4 py-2 bg-black text-white">Continue</button>
      </form>
    </div>
  );
}

