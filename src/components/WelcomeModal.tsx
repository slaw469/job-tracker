import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getRandomJobMarketQuote } from '../data/jobMarketQuotes';
import { User, Target, Sparkles, TrendingUp, MousePointer2, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSubmitName?: (name: string) => Promise<void> | void;
}

export function WelcomeModal({ isOpen, onClose, userName, onSubmitName }: WelcomeModalProps) {
  const { isDark } = useTheme();
  const [welcomeQuote] = useState(getRandomJobMarketQuote());
  const [askName, setAskName] = useState(!userName || userName.trim().length === 0);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getQuoteColor = (type: string) => {
    if (isDark) {
      switch (type) {
        case 'ceo_quote': return 'text-blue-400';
        case 'fact': return 'text-red-400';
        case 'prediction': return 'text-purple-400';
        case 'trend': return 'text-green-400';
        default: return 'text-gray-400';
      }
    } else {
      switch (type) {
        case 'ceo_quote': return 'text-blue-600';
        case 'fact': return 'text-red-600';
        case 'prediction': return 'text-purple-600';
        case 'trend': return 'text-green-600';
        default: return 'text-gray-600';
      }
    }
  };

  const getQuoteIcon = (type: string) => {
    switch (type) {
      case 'ceo_quote': return <User className="w-6 h-6" />;
      case 'fact': return <TrendingUp className="w-6 h-6" />;
      case 'prediction': return <Sparkles className="w-6 h-6" />;
      case 'trend': return <TrendingUp className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
        onClick={onClose}
        style={{
          background: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div
          className={`max-w-2xl w-full p-8 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          onClick={onClose}
        >
          {/* Onboarding name prompt */}
          {askName ? (
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-2xl font-bold mb-3">Hey there! Ready to track your jobs?</h2>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Enter your name down below to personalize your experience.</p>
              <div className="flex gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className={`flex-1 px-4 py-3 border ${isDark ? 'bg-black border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Your name"
                />
                <button
                  className="px-5 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  onClick={async () => {
                    if (!nameInput.trim()) return;
                    if (onSubmitName) {
                      await onSubmitName(nameInput.trim());
                    }
                    setAskName(false);
                  }}
                  disabled={!nameInput.trim()}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
          <>
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center relative`}>
              {/* Enhanced glow effect background with downward glow */}
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl"></div>
              <div className="absolute top-0 left-0 right-0 bottom-4 bg-white/10 blur-md rounded-2xl"></div>
              <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20"></div>
              
              {/* Logo */}
              <img 
                src="/logo.png" 
                alt="ApplyTrack" 
                className="w-10 h-10 object-contain relative z-10 drop-shadow-lg" 
                style={{
                  filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
                }}
              />
            </div>
            <h1 className={`text-4xl font-bold mb-3 italic ${
              isDark ? 'text-white' : 'text-gray-900'
            }`} 
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: isDark ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4)' : '0 0 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              Welcome to ApplyTrack
            </h1>
            
            <p className={`text-lg italic ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: isDark ? '0 0 15px rgba(156, 163, 175, 0.6)' : 'none'
              }}
            >
              {getTimeGreeting()}, {userName}! 👋
            </p>
          </div>

          {/* Quote Section - Redesigned */}
          <div className="text-center mb-8">
            {/* Quote Text */}
            <blockquote className={`text-2xl leading-relaxed mb-6 italic font-light ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: isDark ? '0 0 25px rgba(255, 255, 255, 0.6)' : '0 0 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              "{welcomeQuote.quote}"
            </blockquote>
            
            {/* Quote Source */}
            <cite className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                textShadow: isDark ? '0 0 15px rgba(156, 163, 175, 0.4)' : 'none'
              }}
            >
              — {welcomeQuote.source}
            </cite>
          </div>

          {/* Continue Instructions */}
          <div className="text-center mt-8">
            <div className={`inline-flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
              isDark 
                ? 'bg-white/10 border border-white/20 text-gray-300' 
                : 'bg-gray-50 border border-gray-300 text-gray-600'
            }`}
              style={{
                backdropFilter: 'blur(8px)',
                borderRadius: '12px'
              }}
            >
              <MousePointer2 className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Click anywhere to continue</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            
            <p className={`text-xs mt-3 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              or press <kbd className={`px-2 py-1 text-xs border ${
                isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>Esc</kbd>
            </p>
          </div>
          </>
          )}
        </div>
      </div>
    </>
  );
} 